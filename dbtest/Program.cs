using System;
using Npgsql;
using Dapper;

class Program {
    static void Main() {
        string conn = "Host=aws-1-ca-central-1.pooler.supabase.com;Port=5432;Database=postgres;Username=postgres.krhfbyaugwoncpuuzkvj;Password=DOH3Kl8UcnVQHeuO;SSL Mode=Require;Include Error Detail=true;";
        using var c = new NpgsqlConnection(conn);
        c.Open();
        
        // Escape single quotes by doubling them
        string headline = "Building high-performance, scalable web systems with a focus on precision and impact.";
        string bio = "Specializing in building high-performance, scalable web systems. From architecting distributed backends in .NET to crafting fluid frontend experiences with React and TypeScript. I don''t just write code; I ship solutions that solve real-world problems.";
        
        c.Execute($@"UPDATE about SET 
            headline = '{headline}',
            bio = '{bio}'
            WHERE id = 1;");
        
        Console.WriteLine("Finalized bio and headline with escaped quotes.");
    }
}
