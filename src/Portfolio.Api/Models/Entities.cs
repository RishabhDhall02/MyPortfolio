using System.ComponentModel.DataAnnotations;

namespace Portfolio.Api.Models;

public class Project
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Url { get; set; }
    public string? Language { get; set; }
    public int Stars { get; set; }
    public int Forks { get; set; }
    public string[] Topics { get; set; } = [];
    public bool IsPinned { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}



public class Experience
{
    public int Id { get; set; }
    [Required]
    public string Company { get; set; } = string.Empty;
    [Required]
    public string Role { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string Description { get; set; } = string.Empty;
    public string[] Technologies { get; set; } = [];
}



public class About
{
    public int Id { get; set; }
    public string Headline { get; set; } = "Full-Stack Developer";
    public string Bio { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string GithubUrl { get; set; } = string.Empty;
    public string LinkedinUrl { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
}
