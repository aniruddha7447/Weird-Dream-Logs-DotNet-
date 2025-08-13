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
    public class DreamsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public DreamsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int userId)
        {
            Console.WriteLine($"Getting dreams for user {userId}");

            // Get the user's role
            var user = await _context.Users.FindAsync(userId);
            var isAdmin = user != null && user.Role == "Admin";

            List<Dream> dreams;
            if (isAdmin)
            {
                // Admin sees all dreams
                dreams = await _context.Dreams
                .Include(d => d.User)
                .Include(d => d.Comments).ThenInclude(c => c.User)
                .Include(d => d.Likes).ThenInclude(l => l.User)
                .ToListAsync();
            }
            else
            {
                // Normal user logic
                var followingIds = await _context.Followers
                    .Where(f => f.FollowerId == userId && !f.IsBlocked)
                    .Select(f => f.FollowedId)
                    .ToListAsync();

                var blockedByIds = await _context.Followers
                    .Where(f => f.FollowedId == userId && f.IsBlocked)
                    .Select(f => f.FollowerId)
                    .ToListAsync();

                dreams = await _context.Dreams
                    .Include(d => d.User)
                    .Include(d => d.Comments).ThenInclude(c => c.User)
                    .Include(d => d.Likes).ThenInclude(l => l.User)
                    .Where(d => (d.IsPublic || d.UserId == userId || followingIds.Contains(d.UserId)) && !blockedByIds.Contains(d.UserId))
                    .ToListAsync();
            }

            var result = dreams.Select(d => new DreamDto
            {
                Id = d.Id,
                Title = d.Title,
                Content = d.Content,
                CreatedAt = d.CreatedAt,
                UserId = d.UserId,
                Username = d.User?.Username,
                Category = d.Category,
                IsPublic = d.IsPublic,
                Comments = d.Comments.Select(c => new CommentDto
                {
                    Id = c.Id,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    UserId = c.UserId,
                    Username = c.User?.Username
                }).ToList(),
                Likes = d.Likes.Select(l => new LikeDto
                {
                    Id = l.Id,
                    UserId = l.UserId,
                    Username = l.User?.Username
                }).ToList()
            }).ToList();
            
            Console.WriteLine($"Returning {result.Count} dreams with comments");
            foreach (var dream in result)
            {
                Console.WriteLine($"Dream {dream.Id}: {dream.Comments.Count} comments");
            }
            
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var d = await _context.Dreams
                .Include(d => d.User)
                .Include(d => d.Comments).ThenInclude(c => c.User)
                .Include(d => d.Likes).ThenInclude(l => l.User)
                .FirstOrDefaultAsync(d => d.Id == id);
            if (d == null) return NotFound();
            var dreamDto = new DreamDto
            {
                Id = d.Id,
                Title = d.Title,
                Content = d.Content,
                CreatedAt = d.CreatedAt,
                UserId = d.UserId,
                Username = d.User?.Username,
                Category = d.Category,
                Comments = d.Comments.Select(c => new CommentDto
                {
                    Id = c.Id,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    UserId = c.UserId,
                    Username = c.User?.Username
                }).ToList(),
                Likes = d.Likes.Select(l => new LikeDto
                {
                    Id = l.Id,
                    UserId = l.UserId,
                    Username = l.User?.Username
                }).ToList()
            };
            return Ok(dreamDto);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CreateDreamDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var dream = new Dream
            {
                Title = dto.Title,
                Content = dto.Content,
                Category = dto.Category,
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                IsPublic = dto.IsPublic
            };
            _context.Dreams.Add(dream);
            await _context.SaveChangesAsync();
            return Ok(dream);
        }

        [Authorize]
        [HttpPost("{id}/like")]
        public async Task<IActionResult> Like(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var like = await _context.Likes.FirstOrDefaultAsync(l => l.DreamId == id && l.UserId == userId);
            if (like != null)
            {
                _context.Likes.Remove(like);
                await _context.SaveChangesAsync();
                return Ok(new { liked = false, count = await _context.Likes.CountAsync(l => l.DreamId == id) });
            }
            else
            {
                _context.Likes.Add(new Like { DreamId = id, UserId = userId });
                await _context.SaveChangesAsync();
                return Ok(new { liked = true, count = await _context.Likes.CountAsync(l => l.DreamId == id) });
            }
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var userRole = User.FindFirstValue(ClaimTypes.Role);
            var dream = await _context.Dreams.FindAsync(id);
            if (dream == null) return NotFound();
            if (userRole != "Admin" && dream.UserId != userId) return Forbid();
            _context.Dreams.Remove(dream);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("mine/{userId}")]
        public async Task<IActionResult> GetMyDreams(int userId)
        {
            var dreams = await _context.Dreams
                .Include(d => d.User)
                .Include(d => d.Comments).ThenInclude(c => c.User)
                .Include(d => d.Likes).ThenInclude(l => l.User)
                .Where(d => d.UserId == userId)
                .ToListAsync();

            var result = dreams.Select(d => new DreamDto
            {
                Id = d.Id,
                Title = d.Title,
                Content = d.Content,
                CreatedAt = d.CreatedAt,
                UserId = d.UserId,
                Username = d.User?.Username,
                Category = d.Category,
                Comments = d.Comments.Select(c => new CommentDto
                {
                    Id = c.Id,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    UserId = c.UserId,
                    Username = c.User?.Username
                }).ToList(),
                Likes = d.Likes.Select(l => new LikeDto
                {
                    Id = l.Id,
                    UserId = l.UserId,
                    Username = l.User?.Username
                }).ToList(),
                IsPublic = d.IsPublic
            }).ToList();

            return Ok(result);
        }

        [HttpGet("test-db")]
        public async Task<IActionResult> TestDatabase()
        {
            try
            {
                var userCount = await _context.Users.CountAsync();
                var dreamCount = await _context.Dreams.CountAsync();
                var commentCount = await _context.Comments.CountAsync();
                var likeCount = await _context.Likes.CountAsync();
                var followerCount = await _context.Followers.CountAsync();
                var followRequestCount = await _context.FollowRequests.CountAsync();

                var result = new
                {
                    Users = userCount,
                    Dreams = dreamCount,
                    Comments = commentCount,
                    Likes = likeCount,
                    Followers = followerCount,
                    FollowRequests = followRequestCount,
                    TablesExist = new
                    {
                        Users = _context.Users != null,
                        Dreams = _context.Dreams != null,
                        Comments = _context.Comments != null,
                        Likes = _context.Likes != null,
                        Followers = _context.Followers != null,
                        FollowRequests = _context.FollowRequests != null
                    }
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message, stackTrace = ex.StackTrace });
            }
        }
    }
} 