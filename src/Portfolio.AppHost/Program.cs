var builder = DistributedApplication.CreateBuilder(args);


var db = builder.AddConnectionString("portfolio-db");

var api = builder.AddProject<Projects.Portfolio_Api>("portfolio-api")
    .WithReference(db)
    .WithExternalHttpEndpoints();

builder.AddProject<Projects.Portfolio_Scraper>("portfolio-scraper")
    .WithReference(db)
    .WithReference(api);

builder.AddExecutable("portfolio-web", "npm", "../Portfolio.Web", ["run", "dev"])
    .WithReference(api)
    .WithHttpEndpoint(env: "VITE_PORT", port: 5173)
    .WithExternalHttpEndpoints();

builder.Build().Run();
