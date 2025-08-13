using Microsoft.EntityFrameworkCore;
using WeirdDreamLogs.Models;

namespace WeirdDreamLogs.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Dream> Dreams { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Follower> Followers { get; set; }
        public DbSet<FollowRequest> FollowRequests { get; set; }
    }
} 