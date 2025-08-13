using WeirdDreamLogs.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WeirdDreamLogs.Models;
using System.Security.Cryptography;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "supersecretkey"))
        };
    });

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();

app.UseAuthorization();

// Ensure database is created and migrated
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    // Ensure database is created
    db.Database.EnsureCreated();
    
    // Apply any pending migrations
    if (db.Database.GetPendingMigrations().Any())
    {
        db.Database.Migrate();
    }
    
    // Seed admin user if not exists
    if (!db.Users.Any(u => u.Role == "Admin"))
    {
        using var sha256 = SHA256.Create();
        var passwordHash = Convert.ToBase64String(sha256.ComputeHash(Encoding.UTF8.GetBytes("admin123")));
        db.Users.Add(new User
        {
            Username = "admin",
            Email = "admin@gmail.com",
            PasswordHash = passwordHash,
            Role = "Admin"
        });
        db.SaveChanges();
    }
    
    // Log table information for debugging
    Console.WriteLine("Database tables:");
    Console.WriteLine($"Users: {db.Users.Count()} records");
    Console.WriteLine($"Dreams: {db.Dreams.Count()} records");
    Console.WriteLine($"Comments: {db.Comments.Count()} records");
    Console.WriteLine($"Likes: {db.Likes.Count()} records");
    Console.WriteLine($"Followers: {db.Followers.Count()} records");
    Console.WriteLine($"FollowRequests: {db.FollowRequests.Count()} records");
}

app.MapControllers();

app.Run();
