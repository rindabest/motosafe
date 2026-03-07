using System.ComponentModel.DataAnnotations.Schema;

namespace MotorSafe.Backend.Models
{
    public class Booking
    {
        public int Id { get; set; }
        
        public int CustomerId { get; set; }
        public User Customer { get; set; } = null!;

        public int MechanicId { get; set; }
        public Mechanic Mechanic { get; set; } = null!;

        public string IssueType { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending"; // Pending, Moving, Arrived, Completed, Cancelled
        public string LocationAddress { get; set; } = string.Empty;
        public double LocationLat { get; set; }
        public double LocationLng { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal FinalPrice { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }
    }
}
