# MotorSafe Backend

This ASP.NET Core Web API serves the Customer Portal of MotorSafe.

## Setup Instructions

1. Update Connection String:
   Configure your MySQL database connection in `appsettings.json` under `ConnectionStrings:DefaultConnection`.
   Current default assumes a localhost MySQL server without a password for `root`. Change this based on your XAMPP or MySQL setup.

2. Run Entity Framework Migrations:
   Make sure you have the EF Core CLI tools installed:
   ```bash
   dotnet tool install --global dotnet-ef
   ```
   Then run the following commands to create the database and tables:
   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```
   *Note: This will also seed mock mechanics into the `Mechanics` table.*

3. Run the Server:
   ```bash
   dotnet run
   ```
   The backend will start and listen on the configured port (usually `http://localhost:5000` or `https://localhost:5001`).

## Endpoints Provided
- `POST /api/auth/register` : Create a customer account.
- `POST /api/auth/login` : Login as an existing customer.
- `GET /api/mechanics/nearby?latitude=...&longitude=...&radius=10` : Get simulated mechanics nearby.
- `POST /api/bookings` : Create a rescue request.
- `GET /api/bookings/{id}` : Get booking details.
- `PUT /api/bookings/{id}/simulate-status` : Dummy endpoint to change booking status for simulation.
