namespace WeirdDreamLogs.Models
{
    public class CreateDreamDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string Category { get; set; }
        public bool IsPublic { get; set; }
    }
} 