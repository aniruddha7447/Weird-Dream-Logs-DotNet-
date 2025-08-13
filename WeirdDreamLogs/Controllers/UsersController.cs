using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WeirdDreamLogs.Data;
using WeirdDreamLogs.Models;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace WeirdDreamLogs.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            return Ok(new { user.Id, user.Username, user.Role, user.Bio, user.AvatarUrl });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();
            return Ok(new { user.Id, user.Username, user.Email, user.Role, user.Bio, user.AvatarUrl });
        }

        public class UpdateProfileDto
        {
            public string? Bio { get; set; }
            public string? AvatarUrl { get; set; }
        }

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateProfileDto update)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();
            user.Bio = update.Bio;
            user.AvatarUrl = update.AvatarUrl;
            await _context.SaveChangesAsync();
            return Ok(new { user.Id, user.Username, user.Email, user.Role, user.Bio, user.AvatarUrl });
        }

        [Authorize]
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Query is required");
            var users = await _context.Users
                .Where(u => u.Username.Contains(query) || u.Email.Contains(query))
                .Select(u => new { u.Id, u.Username, u.Email, u.Bio, u.AvatarUrl })
                .ToListAsync();
            return Ok(users);
        }

        [Authorize]
        [HttpGet("all")]
        public async Task<IActionResult> All()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var users = await _context.Users
                .Where(u => u.Id != userId)
                .Select(u => new { u.Id, u.Username, u.Email, u.Bio, u.AvatarUrl })
                .ToListAsync();
            return Ok(users);
        }

        public class ChangePasswordDto
        {
            public int UserId { get; set; }
            public string OldPassword { get; set; }
            public string NewPassword { get; set; }
        }

        [HttpPut("password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            // Get user from JWT or session (for demo, assume userId is in dto)
            var user = await _context.Users.FindAsync(dto.UserId);
            if (user == null) return NotFound();
            // Check old password
            using var sha256 = SHA256.Create();
            var oldHash = Convert.ToBase64String(sha256.ComputeHash(Encoding.UTF8.GetBytes(dto.OldPassword)));
            if (user.PasswordHash != oldHash)
                return BadRequest("Old password is incorrect.");
            // Set new password
            var newHash = Convert.ToBase64String(sha256.ComputeHash(Encoding.UTF8.GetBytes(dto.NewPassword)));
            user.PasswordHash = newHash;
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
} 