using System.Net.Http.Headers;
using System.Text.Json;
using HtmlAgilityPack;
using Npgsql;
using Portfolio.Scraper.Models;

namespace Portfolio.Scraper;

public class ScraperWorker(ILogger<ScraperWorker> logger, IConfiguration configuration) : BackgroundService
{
    private readonly string _githubUsername = configuration["GITHUB__USERNAME"] ?? "RishabhDhall02";
    private readonly string _githubToken = configuration["GITHUB__TOKEN"] ?? "";
    private readonly string _connectionString = configuration.GetConnectionString("portfolio-db") ?? throw new InvalidOperationException("Connection string 'portfolio-db' not found.");
    private readonly HttpClient _httpClient = new HttpClient();

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("PortfolioScraper/1.0");
        if (!string.IsNullOrEmpty(_githubToken))
        {
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _githubToken);
        }

        while (!stoppingToken.IsCancellationRequested)
        {
            logger.LogInformation("Scraper running at: {time}", DateTimeOffset.Now);

            try
            {
                await ScrapeGitHubAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error during scraping");
            }

    
            await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
        }
    }

    private async Task ScrapeGitHubAsync()
    {
        logger.LogInformation("Scraping GitHub for user: {username}", _githubUsername);


        var repoResponse = await _httpClient.GetAsync($"https://api.github.com/users/{_githubUsername}/repos?sort=updated");
        repoResponse.EnsureSuccessStatusCode();
        var repoJson = await repoResponse.Content.ReadAsStringAsync();
        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower };
        var repos = JsonSerializer.Deserialize<List<GitHubRepo>>(repoJson, options) ?? [];


        var userResponse = await _httpClient.GetAsync($"https://api.github.com/users/{_githubUsername}");
        userResponse.EnsureSuccessStatusCode();
        var userJson = await userResponse.Content.ReadAsStringAsync();
        var user = JsonSerializer.Deserialize<GitHubUser>(userJson, options);


        var pinnedRepos = await GetPinnedReposAsync();


        await using var conn = new NpgsqlConnection(_connectionString);
        await conn.OpenAsync();


        if (user != null)
        {
            await using var cmdAbout = new NpgsqlCommand(@"
                INSERT INTO about (id, headline, bio, location, github_url, avatar_url)
                VALUES (1, @headline, @bio, @location, @github, @avatar)
                ON CONFLICT (id) DO UPDATE SET
                bio = EXCLUDED.bio,
                location = EXCLUDED.location,
                avatar_url = EXCLUDED.avatar_url,
                github_url = EXCLUDED.github_url", conn);
            
            cmdAbout.Parameters.AddWithValue("headline", "Full-Stack Developer");
            cmdAbout.Parameters.AddWithValue("bio", user.Bio ?? "");
            cmdAbout.Parameters.AddWithValue("location", user.Location ?? "");
            cmdAbout.Parameters.AddWithValue("github", $"https://github.com/{_githubUsername}");
            cmdAbout.Parameters.AddWithValue("avatar", user.AvatarUrl);
            await cmdAbout.ExecuteNonQueryAsync();
        }


        foreach (var repo in repos)
        {
            await using var cmdProj = new NpgsqlCommand(@"
                INSERT INTO projects (name, description, url, language, stars, forks, topics, created_at, updated_at, is_pinned)
                VALUES (@name, @desc, @url, @lang, @stars, @forks, @topics, @created, @updated, @pinned)
                ON CONFLICT (name) DO UPDATE SET
                description = EXCLUDED.description,
                stars = EXCLUDED.stars,
                forks = EXCLUDED.forks,
                topics = EXCLUDED.topics,
                updated_at = EXCLUDED.updated_at,
                is_pinned = EXCLUDED.is_pinned", conn);

            cmdProj.Parameters.AddWithValue("name", repo.Name);
            cmdProj.Parameters.AddWithValue("desc", repo.Description ?? "");
            cmdProj.Parameters.AddWithValue("url", repo.HtmlUrl);
            cmdProj.Parameters.AddWithValue("lang", repo.Language ?? "Unknown");
            cmdProj.Parameters.AddWithValue("stars", repo.StargazersCount);
            cmdProj.Parameters.AddWithValue("forks", repo.ForksCount);
            cmdProj.Parameters.AddWithValue("topics", repo.Topics);
            cmdProj.Parameters.AddWithValue("created", repo.CreatedAt.ToUniversalTime());
            cmdProj.Parameters.AddWithValue("updated", repo.UpdatedAt.ToUniversalTime());
            cmdProj.Parameters.AddWithValue("pinned", pinnedRepos.Contains(repo.Name));
            await cmdProj.ExecuteNonQueryAsync();
        }

        logger.LogInformation("Successfully updated {count} projects from GitHub", repos.Count);
    }

    private async Task<HashSet<string>> GetPinnedReposAsync()
    {
        var pinned = new HashSet<string>();
        try
        {
            var html = await _httpClient.GetStringAsync($"https://github.com/{_githubUsername}");
            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            var nodes = doc.DocumentNode.SelectNodes("//span[@class='repo']");
            if (nodes != null)
            {
                foreach (var node in nodes)
                {
                    pinned.Add(node.InnerText.Trim());
                }
            }
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to scrape pinned repos");
        }
        return pinned;
    }
}
