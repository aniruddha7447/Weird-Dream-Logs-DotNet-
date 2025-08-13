using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WeirdDreamLogs.Data;
using WeirdDreamLogs.Models;
using System.Linq;
using System.Threading.Tasks;

namespace WeirdDreamLogs.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FollowersController : ControllerBase
    {
        private readonly AppDbContext _context;
        public FollowersController(AppDbContext context)
        {
            _context = context;
        }

        // POST: /Followers/request
        [HttpPost("request")]
        public async Task<IActionResult> SendFollowRequest([FromBody] FollowRequestDto dto)
        {
            if (!ModelState.IsValid)
            {
                // Log model state errors
                var errors = string.Join("; ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));
                Console.WriteLine($"ModelState errors: {errors}");
                return BadRequest(ModelState);
            }
            // Prevent following admin or self
            var target = await _context.Users.FindAsync(dto.TargetId);
            if (target == null || target.Role == "Admin" || dto.RequesterId == dto.TargetId)
                return BadRequest("Invalid follow target.");
            // Prevent follow requests if the target has blocked the requester
            if (await _context.Followers.AnyAsync(f => f.FollowerId == dto.TargetId && f.FollowedId == dto.RequesterId && f.IsBlocked))
                return BadRequest("Cannot follow: this user has blocked you.");
            // Check if already following or pending
            if (await _context.Followers.AnyAsync(f => f.FollowerId == dto.RequesterId && f.FollowedId == dto.TargetId && !f.IsBlocked))
                return BadRequest("Already following.");
            if (await _context.FollowRequests.AnyAsync(fr => fr.RequesterId == dto.RequesterId && fr.TargetId == dto.TargetId && fr.Status == "Pending"))
                return BadRequest("Request already pending.");
            var req = new FollowRequest
            {
                RequesterId = dto.RequesterId,
                TargetId = dto.TargetId,
                Status = "Pending"
            };
            _context.FollowRequests.Add(req);
            await _context.SaveChangesAsync();
            return Ok(req);
        }

        // POST: /Followers/accept
        [HttpPost("accept")]
        public async Task<IActionResult> AcceptFollowRequest([FromBody] RequestIdDto dto)
        {
            var req = await _context.FollowRequests.FindAsync(dto.RequestId);
            if (req == null || req.Status != "Pending") return NotFound();
            req.Status = "Accepted";
            _context.Followers.Add(new Follower { FollowerId = req.RequesterId, FollowedId = req.TargetId });
            await _context.SaveChangesAsync();
            return Ok();
        }

        // POST: /Followers/reject
        [HttpPost("reject")]
        public async Task<IActionResult> RejectFollowRequest([FromBody] RequestIdDto dto)
        {
            var req = await _context.FollowRequests.FindAsync(dto.RequestId);
            if (req == null || req.Status != "Pending") return NotFound();
            req.Status = "Rejected";
            await _context.SaveChangesAsync();
            return Ok();
        }

        // POST: /Followers/unfollow
        [HttpPost("unfollow")]
        public async Task<IActionResult> Unfollow([FromBody] UserPairDto dto)
        {
            var rel = await _context.Followers.FirstOrDefaultAsync(f => f.FollowerId == dto.FollowerId && f.FollowedId == dto.FollowedId && !f.IsBlocked);
            if (rel == null) return NotFound();
            _context.Followers.Remove(rel);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // POST: /Followers/block
        [HttpPost("block")]
        public async Task<IActionResult> Block([FromBody] UserPairDto dto)
        {
            // Create or update the block relationship (A blocks B)
            var rel = await _context.Followers.FirstOrDefaultAsync(f => f.FollowerId == dto.FollowerId && f.FollowedId == dto.FollowedId);
            if (rel != null)
            {
                rel.IsBlocked = true;
            }
            else
            {
                rel = new Follower { FollowerId = dto.FollowerId, FollowedId = dto.FollowedId, IsBlocked = true };
                _context.Followers.Add(rel);
            }
            
            // Remove any follow requests from B to A (blocked user cannot send requests to blocker)
            var reqs = await _context.FollowRequests.Where(fr =>
                fr.RequesterId == dto.FollowedId && fr.TargetId == dto.FollowerId).ToListAsync();
            _context.FollowRequests.RemoveRange(reqs);
            
            // Remove the follow relationship from B to A (blocked user cannot follow blocker)
            var follow = await _context.Followers.FirstOrDefaultAsync(f => 
                f.FollowerId == dto.FollowedId && f.FollowedId == dto.FollowerId && !f.IsBlocked);
            if (follow != null)
            {
                _context.Followers.Remove(follow);
            }
            
            await _context.SaveChangesAsync();
            return Ok();
        }

        // POST: /Followers/unblock
        [HttpPost("unblock")]
        public async Task<IActionResult> Unblock([FromBody] UserPairDto dto)
        {
            var rel = await _context.Followers.FirstOrDefaultAsync(f => f.FollowerId == dto.FollowerId && f.FollowedId == dto.FollowedId && f.IsBlocked);
            if (rel == null) return NotFound();
            _context.Followers.Remove(rel);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // GET: /Followers/followers/{userId}
        [HttpGet("followers/{userId}")]
        public async Task<IActionResult> GetFollowers(int userId)
        {
            var followers = await _context.Followers
                .Where(f => f.FollowedId == userId && !f.IsBlocked)
                .Select(f => f.FollowerUser)
                .ToListAsync();
            return Ok(followers);
        }

        // GET: /Followers/following/{userId}
        [HttpGet("following/{userId}")]
        public async Task<IActionResult> GetFollowing(int userId)
        {
            var following = await _context.Followers
                .Where(f => f.FollowerId == userId && !f.IsBlocked)
                .Select(f => f.FollowedUser)
                .ToListAsync();
            return Ok(following);
        }

        // GET: /Followers/pending/{userId}
        [HttpGet("pending/{userId}")]
        public async Task<IActionResult> GetPendingRequests(int userId)
        {
            var pending = await _context.FollowRequests
                .Where(fr => fr.TargetId == userId && fr.Status == "Pending")
                .Include(fr => fr.Requester)
                .ToListAsync();
            return Ok(pending);
        }

        // GET: /Followers/blocked/{userId}
        [HttpGet("blocked/{userId}")]
        public async Task<IActionResult> GetBlockedUsers(int userId)
        {
            // Return users that the current user has blocked
            var blocked = await _context.Followers
                .Where(f => f.FollowerId == userId && f.IsBlocked)
                .Select(f => f.FollowedUser)
                .ToListAsync();
            return Ok(blocked);
        }

        // GET: /Followers/blocked-by/{userId}
        [HttpGet("blocked-by/{userId}")]
        public async Task<IActionResult> GetUsersWhoBlockedMe(int userId)
        {
            var blockedBy = await _context.Followers
                .Where(f => f.FollowedId == userId && f.IsBlocked)
                .Select(f => f.FollowerUser)
                .ToListAsync();
            return Ok(blockedBy);
        }
    }
} 