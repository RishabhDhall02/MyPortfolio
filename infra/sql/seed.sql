-- Initial Schema Migration & Seed Data for Rishabh Dhall's Portfolio

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS about (
    id SERIAL PRIMARY KEY,
    headline TEXT NOT NULL,
    bio TEXT NOT NULL,
    location TEXT,
    email TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    avatar_url TEXT
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    url TEXT,
    language TEXT,
    stars INTEGER DEFAULT 0,
    forks INTEGER DEFAULT 0,
    topics TEXT[],
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    proficiency INTEGER CHECK (proficiency >= 0 AND proficiency <= 100)
);

CREATE TABLE IF NOT EXISTS experiences (
    id SERIAL PRIMARY KEY,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    location TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT,
    technologies TEXT[]
);

CREATE TABLE IF NOT EXISTS educations (
    id SERIAL PRIMARY KEY,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field_of_study TEXT,
    start_year INTEGER,
    end_year INTEGER
);

-- 2. Seed Data (Fill this out with your details!)
INSERT INTO about (id, headline, bio, location, email, github_url, linkedin_url)
VALUES (1, 
    'Full-Stack Developer | .NET & React Specialist', 
    'I am a passionate developer with experience in building scalable web applications using C#, TypeScript, and modern cloud technologies.', 
    'Your Location', 
    'your.email@example.com', 
    'https://github.com/RishabhDhall02', 
    'https://linkedin.com/in/yourprofile'
) ON CONFLICT (id) DO NOTHING;

-- Examples for Skills (Add your own!)
INSERT INTO skills (name, category, proficiency) VALUES 
('C#', 'Languages', 90),
('.NET Core', 'Frameworks', 85),
('TypeScript', 'Languages', 80),
('React', 'Frontend', 85),
('PostgreSQL', 'Databases', 75),
('Docker', 'Tools', 70),
('Azure', 'Cloud', 65)
ON CONFLICT DO NOTHING;

-- Examples for Education
INSERT INTO educations (institution, degree, field_of_study, start_year, end_year)
VALUES ('Your University', 'Bachelor of Science', 'Computer Science', 2020, 2024)
ON CONFLICT DO NOTHING;
