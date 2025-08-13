using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WeirdDreamLogs.Models
{
    public class FollowRequest
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int RequesterId { get; set; }
        [ForeignKey("RequesterId")]
        public User Requester { get; set; }
        [Required]
        public int TargetId { get; set; }
        [ForeignKey("TargetId")]
        public User Target { get; set; }
        [Required]
        public string Status { get; set; } // "Pending", "Accepted", "Rejected"
    }
} 