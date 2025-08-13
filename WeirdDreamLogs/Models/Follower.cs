using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WeirdDreamLogs.Models
{
    public class Follower
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int FollowerId { get; set; }
        [ForeignKey("FollowerId")]
        public User FollowerUser { get; set; }
        [Required]
        public int FollowedId { get; set; }
        [ForeignKey("FollowedId")]
        public User FollowedUser { get; set; }
        public bool IsBlocked { get; set; } = false;
    }
} 