using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;
using Portfolio.Api.Models;
using Dapper;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);


DefaultTypeMap.MatchNamesWithUnderscores = true;


var envPath = File.Exists(".env") ? ".env" : 
             File.Exists("../../.env") ? "../../.env" : 
             File.Exists("../../../.env") ? "../../../.env" : null;

if (envPath != null) 
{
    DotNetEnv.Env.Load(envPath);

    var envValue = DotNetEnv.Env.GetString("SUPABASE_CONNECTION_STRING");
    if (!string.IsNullOrEmpty(envValue))
    {
        Environment.SetEnvironmentVariable("SUPABASE_CONNECTION_STRING", envValue);
    }
    Console.WriteLine($"Loaded .env from: {Path.GetFullPath(envPath)}");
}


var connectionString = Environment.GetEnvironmentVariable("SUPABASE_CONNECTION_STRING") ?? 
                      builder.Configuration.GetConnectionString("portfolio-db");

if (!string.IsNullOrEmpty(connectionString))
{

    connectionString = connectionString.Trim('"');
    Console.WriteLine($"Using connection string: {connectionString.Substring(0, 10)}...");
    builder.Configuration["ConnectionStrings:portfolio-db"] = connectionString;
}


builder.AddServiceDefaults();


builder.Services.AddDbContext<PortfolioDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.MapDefaultEndpoints();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

var api = app.MapGroup("/api");

api.MapGet("/about", async (IConfiguration config) => {
    try {
        using var conn = new NpgsqlConnection(config.GetConnectionString("portfolio-db"));
        return Results.Ok(await conn.QueryFirstOrDefaultAsync<About>("SELECT * FROM about LIMIT 1") ?? new About());
    } catch (Exception ex) {
        return Results.Problem(ex.ToString());
    }
});


async Task<IResult> GetProjects(IConfiguration config) {
    try {
        using var conn = new NpgsqlConnection(config.GetConnectionString("portfolio-db"));
        var projects = await conn.QueryAsync<Project>("SELECT * FROM projects ORDER BY id ASC");
        return Results.Ok(projects);
    } catch (Exception ex) { return Results.Problem(ex.ToString()); }
}
api.MapGet("/project", GetProjects);
api.MapGet("/projects", GetProjects);

async Task<IResult> GetExperience(IConfiguration config) {
    try {
        using var conn = new NpgsqlConnection(config.GetConnectionString("portfolio-db"));
        var exp = await conn.QueryAsync<Experience>("SELECT * FROM experiences ORDER BY start_date DESC");
        return Results.Ok(exp);
    } catch (Exception ex) { return Results.Problem(ex.ToString()); }
}
api.MapGet("/experience", GetExperience);
api.MapGet("/experiences", GetExperience);



app.Run();
