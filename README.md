# Portfolio Application

A full-stack architecture utilizing a React frontend and a headless .NET 9 Minimal API. The system implements a secure data pipeline to sync GitHub metadata into a Supabase instance, served via a high-performance Dapper data layer.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Framer Motion
- **Backend**: ASP.NET Core 9 (Minimal APIs), Dapper (ORM)
- **Database**: Supabase (PostgreSQL)
- **Cloud & DevOps**: Azure Static Web Apps (Frontend), Azure App Service (API), Environment-based Secret Management
- **Data Pipeline**: C# Worker Service utilizing HtmlAgilityPack for targeted scraping and the GitHub API for repository metadata.
