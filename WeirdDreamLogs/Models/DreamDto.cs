using System;
using System.Collections.Generic;

namespace WeirdDreamLogs.Models
{
    public class DreamDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; }
        public List<CommentDto> Comments { get; set; }
        public List<LikeDto> Likes { get; set; }
        public string Category { get; set; }
        public bool IsPublic { get; set; }
    }

    public class CommentDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; }
    }

    public class LikeDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; }
    }
} 