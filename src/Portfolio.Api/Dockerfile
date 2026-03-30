# Use the official .NET 9 SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy the solution and project files
COPY Portfolio.sln .
COPY src/Portfolio.Api/Portfolio.Api.csproj src/Portfolio.Api/
COPY src/Portfolio.ServiceDefaults/Portfolio.ServiceDefaults.csproj src/Portfolio.ServiceDefaults/
COPY src/Portfolio.Scraper/Portfolio.Scraper.csproj src/Portfolio.Scraper/
COPY src/Portfolio.AppHost/Portfolio.AppHost.csproj src/Portfolio.AppHost/

# Restore dependencies
RUN dotnet restore src/Portfolio.Api/Portfolio.Api.csproj

# Copy the remaining source code
COPY . .

# Build and publish the API
WORKDIR /app/src/Portfolio.Api
RUN dotnet publish -c Release -o /out

# Use the official .NET 9 runtime image for the final stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /out .
EXPOSE 8080
ENTRYPOINT ["dotnet", "Portfolio.Api.dll"]
