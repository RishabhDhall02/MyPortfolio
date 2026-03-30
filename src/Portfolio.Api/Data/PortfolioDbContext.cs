using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Models;

namespace Portfolio.Api.Data;

public class PortfolioDbContext : DbContext
{
    public PortfolioDbContext(DbContextOptions<PortfolioDbContext> options) : base(options)
    {
    }

    public DbSet<Project> Projects => Set<Project>();

    public DbSet<Experience> Experiences => Set<Experience>();

    public DbSet<About> About => Set<About>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Additional configuration if needed
        modelBuilder.Entity<Project>(entity => {
            entity.ToTable("projects");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Url).HasColumnName("url");
            entity.Property(e => e.Language).HasColumnName("language");
            entity.Property(e => e.Stars).HasColumnName("stars");
            entity.Property(e => e.Forks).HasColumnName("forks");
            entity.Property(e => e.Topics).HasColumnName("topics");
            entity.Property(e => e.IsPinned).HasColumnName("is_pinned");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });


        modelBuilder.Entity<Experience>(entity => {
            entity.ToTable("experiences");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Company).HasColumnName("company");
            entity.Property(e => e.Role).HasColumnName("role");
            entity.Property(e => e.Location).HasColumnName("location");
            entity.Property(e => e.StartDate).HasColumnName("start_date");
            entity.Property(e => e.EndDate).HasColumnName("end_date");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Technologies).HasColumnName("technologies");
        });


        modelBuilder.Entity<About>(entity => {
            entity.ToTable("about");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Headline).HasColumnName("headline");
            entity.Property(e => e.Bio).HasColumnName("bio");
            entity.Property(e => e.Location).HasColumnName("location");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.GithubUrl).HasColumnName("github_url");
            entity.Property(e => e.LinkedinUrl).HasColumnName("linkedin_url");
            entity.Property(e => e.AvatarUrl).HasColumnName("avatar_url");
        });
    }
}
