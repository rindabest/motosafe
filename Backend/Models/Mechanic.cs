namespace MotorSafe.Backend.Models
{
    public class Mechanic
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ShopName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double Rating { get; set; }
        public bool IsAvailable { get; set; }
        public string SpecialSkills { get; set; } = string.Empty;
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
