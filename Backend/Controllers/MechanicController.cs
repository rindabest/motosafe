using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotorSafe.Backend.Data;
using MotorSafe.Backend.Models;

namespace MotorSafe.Backend.Controllers
{
    [ApiController]
    [Route("api/mechanics")]
    public class MechanicController : ControllerBase
    {
        private readonly MotorSafeDbContext _context;

        public MechanicController(MotorSafeDbContext context)
        {
            _context = context;
        }

        [HttpGet("nearby")]
        public async Task<IActionResult> GetNearbyMechanics([FromQuery] double latitude, [FromQuery] double longitude, [FromQuery] double radius = 10)
        {
            // Note: In a real app we'd use spatial data types or Haversine formula in DB.
            // For mock/demo purposes, we fetch all and calculate in memory, or just a simple bounded box.
            
            var mechanics = await _context.Mechanics
                .Where(m => m.IsAvailable)
                .ToListAsync();

            var nearby = mechanics.Select(m => new
            {
                m.Id,
                m.Name,
                m.ShopName,
                m.Phone,
                m.Address,
                m.Rating,
                LocationLat = m.Latitude,
                LocationLng = m.Longitude,
                m.SpecialSkills,
                m.IsAvailable,
                DistanceKm = CalculateDistance(latitude, longitude, m.Latitude, m.Longitude)
            })
            .Where(m => m.DistanceKm <= radius)
            .OrderBy(m => m.DistanceKm)
            .ToList();

            return Ok(new { success = true, mechanics = nearby });
        }

        private static double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            var r = 6371; // km
            var dLat = ToRadians(lat2 - lat1);
            var dLon = ToRadians(lon2 - lon1);
            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return r * c;
        }

        private static double ToRadians(double angle)
        {
            return angle * (Math.PI / 180);
        }
    }
}
