# Portfolio Application

A full-stack personal portfolio application built with **React (Vite), .NET 9 API, and Supabase**. It features an automated GitHub repository synchronization system and a robust Dapper-backed API.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Framer Motion
- **Backend**: ASP.NET Core 9 (Minimal APIs), Dapper
- **Database**: Supabase (PostgreSQL)
- **Data Synchronization**: C# Worker Service with HtmlAgilityPack and GitHub API

## Quick Setup (local)

1.  **Environment Settings**:
    Ensure you have a `.env` file in the root directory (where the `.sln` file is) containing your authenticated Supabase connection string and GitHub token:
    ```env
    SUPABASE_CONNECTION_STRING="Host=aws-1-ca-central-1.pooler.supabase.com;Port=5432;Database=postgres..."
    GITHUB__TOKEN="github_pat_..."
    ```

2.  **Run the Stack**:
    Open two separate terminals and launch the backend and frontend simultaneously:

    **Terminal 1 (Backend)**:
    ```powershell
    cd src/Portfolio.Api; dotnet run
    ```

    **Terminal 2 (Frontend)**:
    ```powershell
    cd src/Portfolio.Web; npm install; npx vite
    ```

3.  **View Portfolio**:
    The interactive interface will start on `http://localhost:5173`. Open this URL in your browser to view your live portfolio.

---

## How to Shut Off Local Host

If you encounter port conflicts or want to stop the local servers completely:
1.  **API**: Focus the API terminal and press `Ctrl+C`.
2.  **Frontend**: Focus the Vite terminal and press `Ctrl+C`.
3.  **Kill Lingering Processes (Windows)**:
    If the ports remain active, run this command in PowerShell to clear them:
    ```powershell
    Get-Process -Id (Get-NetTCPConnection -LocalPort 5173, 5129).OwningProcess | Stop-Process -Force
    ```

---

## Synching GitHub Projects (The Scraper)

To reflect new code I push to github on my portfolio website, I run:

```powershell
# Open a new terminal:
cd src/Portfolio.Scraper
dotnet run
```
