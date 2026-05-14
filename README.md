# My Portfolio

A full-stack architecture utilizing a React frontend and a headless .NET 9 Minimal API. The system implements a secure data pipeline to sync GitHub metadata into a Supabase instance, served via a high-performance Dapper data layer.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Framer Motion
- **Backend**: ASP.NET Core 9 (Minimal APIs), Dapper (ORM)
- **Database**: Supabase (PostgreSQL)
- **Cloud & DevOps**: Azure Static Web Apps (Frontend), Azure App Service (API), Environment-based Secret Management
- **Data Pipeline**: C# Worker Service utilizing HtmlAgilityPack for targeted scraping and the GitHub API for repository metadata.

## Features
- **Automated GitHub Synchronization**: A custom worker service periodically scrapes repository metadata and uses the GitHub API to keep projects up to date.
- **Decoupled Architecture**: Features a high-performance separation between a React 18 frontend (built with Vite) and a headless ASP.NET Core 9 backend.
- **Type-Safe Development**: Utilizes TypeScript across the frontend for robust component logic and interface consistency.
- **Optimized Data Access**: Employs Dapper and Npgsql for fast, lightweight server-side mapping to a Supabase (PostgreSQL) database.
- **Production-Grade Security**: Sensitive database credentials and connection strings are managed via Azure Environment Variables, ensuring zero client-side exposure of secrets.
