using System.ComponentModel.DataAnnotations;

namespace WeirdDreamLogs.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string PasswordHash { get; set; }
        [Required]
        public string Role { get; set; } // "User" or "Admin"
        public string? Bio { get; set; }
        public string? AvatarUrl { get; set; }
    }
} 