using Microsoft.EntityFrameworkCore;
using MotorSafe.Backend.Models;

namespace MotorSafe.Backend.Data
{
    public class MotorSafeDbContext : DbContext
    {
        public MotorSafeDbContext(DbContextOptions<MotorSafeDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Mechanic> Mechanics { get; set; }
        public DbSet<Booking> Bookings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Customer)
                .WithMany(u => u.Bookings)
                .HasForeignKey(b => b.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Mechanic)
                .WithMany(m => m.Bookings)
                .HasForeignKey(b => b.MechanicId)
                .OnDelete(DeleteBehavior.Restrict);

            // Seed Mock Mechanics (Around Vietnam / Ho Chi Minh City or random)
            // Or random coordinates near user's expected location.
            modelBuilder.Entity<Mechanic>().HasData(
                new Mechanic { Id = 1, Name = "Nguyen Van A", ShopName = "A Motor Repair", Phone = "0901234567", Address = "123 Le Loi, Q1, HCMC", Latitude = 10.7769, Longitude = 106.7009, Rating = 4.8, IsAvailable = true, SpecialSkills = "Engine, Tires" },
                new Mechanic { Id = 2, Name = "Tran Van B", ShopName = "B Quick Fix", Phone = "0987654321", Address = "456 Nguyen Hue, Q1, HCMC", Latitude = 10.7745, Longitude = 106.7032, Rating = 4.5, IsAvailable = true, SpecialSkills = "Battery, Start" },
                new Mechanic { Id = 3, Name = "Le Thi C", ShopName = "C Motor Service", Phone = "0912223334", Address = "789 Tran Hung Dao, Q5, HCMC", Latitude = 10.7554, Longitude = 106.6668, Rating = 4.9, IsAvailable = true, SpecialSkills = "All" }
            );
        }
    }
}
