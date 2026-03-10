using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MotorSafe.Backend.Data;
using MotorSafe.Backend.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MotorSafe.Backend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly MotorSafeDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(MotorSafeDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Phone == request.Phone))
                return BadRequest(new { message = "Phone number already exists." });

            if (!string.IsNullOrEmpty(request.Email) && await _context.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest(new { message = "Email already exists." });

            var user = new User
            {
                FullName = request.FullName,
                Phone = request.Phone,
                Email = request.Email,
                Cccd = request.Cccd,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration successful" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Phone == request.AccountIdentifier || u.Email == request.AccountIdentifier);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid phone/email or password." });

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                token,
                user = new { user.Id, user.FullName, user.Phone }
            });
        }

        [Authorize]
        [HttpGet("/api/core/me")]
        public IActionResult GetCurrentUser()
        {
            // Simple mock to satisfy the frontend ProtectedRoute check.
            return Ok(new { success = true, user = new { id = 1, username = "Test User" } });
        }

        [Authorize]
        [HttpGet("/api/profile/me")]
        public async Task<IActionResult> GetUserProfile()
        {
            var customerIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(customerIdStr, out int customerId))
                return Unauthorized();

            var user = await _context.Users.FindAsync(customerId);
            if (user == null) return NotFound();

            // Split FullName into first and last name for frontend mapping
            var names = user.FullName.Split(' ', 2);
            var firstName = names[0];
            var lastName = names.Length > 1 ? names[1] : "";

            return Ok(new
            {
                full_name = user.FullName,
                first_name = firstName,
                last_name = lastName,
                email = user.Email,
                cccd = user.Cccd,
                mobile_number = user.Phone,
                profile_pic = ""
            });
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim("phone", user.Phone),
                new Claim("name", user.FullName)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(24),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }

    public class RegisterRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Cccd { get; set; }
        public string Password { get; set; } = string.Empty;
    }

    public class LoginRequest
    {
        public string AccountIdentifier { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
