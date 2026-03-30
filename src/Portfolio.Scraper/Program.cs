using System.IO;
using Portfolio.Scraper;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

// Find and load .env from root or project dir
var envPath = File.Exists(".env") ? ".env" : 
             File.Exists("../../.env") ? "../../.env" : 
             File.Exists("../../../.env") ? "../../../.env" : null;

if (envPath != null) 
{
    DotNetEnv.Env.Load(envPath);
    // Forcefully set the environment variable from the loaded .env
    var envValue = DotNetEnv.Env.GetString("SUPABASE_CONNECTION_STRING");
    if (!string.IsNullOrEmpty(envValue))
    {
        Environment.SetEnvironmentVariable("SUPABASE_CONNECTION_STRING", envValue);
    }
    
    var githubToken = DotNetEnv.Env.GetString("GITHUB__TOKEN");
    if (!string.IsNullOrEmpty(githubToken))
    {
        Environment.SetEnvironmentVariable("GITHUB__TOKEN", githubToken);
    }
}

var builder = Host.CreateApplicationBuilder(args);

// Ensure the connection string is available in configuration
var connectionString = Environment.GetEnvironmentVariable("SUPABASE_CONNECTION_STRING");
if (!string.IsNullOrEmpty(connectionString))
{
    builder.Configuration["ConnectionStrings:portfolio-db"] = connectionString;
}

builder.AddServiceDefaults();
builder.Services.AddHostedService<ScraperWorker>();

var host = builder.Build();
host.Run();
