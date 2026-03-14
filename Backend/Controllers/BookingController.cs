using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotorSafe.Backend.Data;
using MotorSafe.Backend.Models;
using System.Security.Claims;

namespace MotorSafe.Backend.Controllers
{
    [ApiController]
    [Route("api/bookings")]
    [Authorize]
    public class BookingController : ControllerBase
    {
        private readonly MotorSafeDbContext _context;

        public BookingController(MotorSafeDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingRequest request)
        {
            var customerIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(customerIdStr, out int customerId))
                return Unauthorized();

            var mechanic = await _context.Mechanics.FindAsync(request.MechanicId);
            if (mechanic == null || !mechanic.IsAvailable)
                return BadRequest(new { message = "Mechanic is not available." });

            var booking = new Booking
            {
                CustomerId = customerId,
                MechanicId = request.MechanicId,
                IssueType = request.IssueType,
                LocationLat = request.LocationLat,
                LocationLng = request.LocationLng,
                LocationAddress = request.LocationAddress,
                FinalPrice = request.FinalPrice,
                Status = "Pending"
            };

            _context.Bookings.Add(booking);
            
            // To prevent double booking easily for simulation, we could mark mechanic as unavailable
            // mechanic.IsAvailable = false;
            
            await _context.SaveChangesAsync();

            return Ok(new { success = true, bookingId = booking.Id });
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetBookingHistory()
        {
            var customerIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(customerIdStr, out int customerId))
                return Unauthorized();

            var history = await _context.Bookings
                .Where(b => b.CustomerId == customerId)
                .OrderByDescending(b => b.Id)
                .Select(b => new
                {
                    id = b.Id,
                    status = b.Status,
                    problem = b.IssueType,
                    service_type = b.IssueType,
                    location = b.LocationAddress,
                    created_at = b.CreatedAt,
                    updated_at = b.CreatedAt
                })
                .ToListAsync();

            return Ok(history);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetBooking(int id)
        {
            var booking = await _context.Bookings
                .Include(b => b.Mechanic)
                .Select(b => new
                {
                    b.Id,
                    b.Status,
                    b.IssueType,
                    b.FinalPrice,
                    MechanicName = b.Mechanic.Name,
                    MechanicPhone = b.Mechanic.Phone,
                    b.LocationLat,
                    b.LocationLng
                })
                .FirstOrDefaultAsync(b => b.Id == id);

            if (booking == null)
                return NotFound();

            return Ok(new { success = true, booking });
        }

        [HttpPut("{id}/simulate-status")]
        [AllowAnonymous] // Allow frontend to blindly hit this for demo
        public async Task<IActionResult> SimulateStatus(int id, [FromBody] SimulateStatusRequest request)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return NotFound();

            booking.Status = request.Status;
            
            if (request.Status == "Completed")
            {
                booking.CompletedAt = DateTime.Now;
            }

            await _context.SaveChangesAsync();

            return Ok(new { success = true, newStatus = booking.Status });
        }
    }

    public class CreateBookingRequest
    {
        public int MechanicId { get; set; }
        public string IssueType { get; set; } = string.Empty;
        public double LocationLat { get; set; }
        public double LocationLng { get; set; }
        public string LocationAddress { get; set; } = string.Empty;
        public decimal FinalPrice { get; set; }
    }

    public class SimulateStatusRequest
    {
        public string Status { get; set; } = string.Empty;
    }
}
