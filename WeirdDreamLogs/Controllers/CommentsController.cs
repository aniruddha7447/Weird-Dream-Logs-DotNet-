using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WeirdDreamLogs.Data;
using WeirdDreamLogs.Models;
using System.Security.Claims;

namespace WeirdDreamLogs.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CommentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("dream/{dreamId}")]
        public async Task<IActionResult> GetCommentsForDream(int dreamId)
        {
            Console.WriteLine($"Getting comments for dream {dreamId}");
            
            var comments = await _context.Comments
                .Include(c => c.User)
                .Where(c => c.DreamId == dreamId)
                .OrderBy(c => c.CreatedAt)
                .Select(c => new
                {
                    Id = c.Id,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    UserId = c.UserId,
                    Username = c.User.Username
                })
                .ToListAsync();

            Console.WriteLine($"Found {comments.Count} comments for dream {dreamId}");
            return Ok(comments);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CreateCommentDto dto)
        {
            Console.WriteLine($"Creating comment: {dto.Content} for dream {dto.DreamId}");
            
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var comment = new Comment
            {
                Content = dto.Content,
                DreamId = dto.DreamId,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
            
            Console.WriteLine($"Comment created with ID: {comment.Id}");
            return Ok(comment);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            Console.WriteLine($"Deleting comment {id}");
            
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var userRole = User.FindFirstValue(ClaimTypes.Role);
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) return NotFound();
            if (userRole != "Admin" && comment.UserId != userId) return Forbid();
            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
            
            Console.WriteLine($"Comment {id} deleted successfully");
            return Ok();
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetCommentsByUser(int userId)
        {
            var comments = await _context.Comments
                .Include(c => c.Dream)
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new {
                    Id = c.Id,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    DreamId = c.DreamId,
                    DreamTitle = c.Dream.Title
                })
                .ToListAsync();

            return Ok(comments);
        }
    }
} 