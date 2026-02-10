-- Pickle-Pulse Initial Schema

-- Cleanup existing tables to ensure a clean slate
DROP TABLE IF EXISTS match_sets CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS courts CASCADE;
DROP TABLE IF EXISTS tournaments CASCADE;

-- 1. Tournaments
CREATE TABLE tournaments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    format TEXT NOT NULL CHECK (format IN ('single_elim', 'double_elim', 'round_robin')),
    status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Courts
CREATE TABLE courts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
    court_number INTEGER NOT NULL,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Matches
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
    court_id UUID REFERENCES courts(id) ON DELETE SET NULL,
    p1_name TEXT NOT NULL,
    p2_name TEXT NOT NULL,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed')),
    round_name TEXT, -- E.G. 'Quarter-Finals'
    winner_id TEXT, -- 'p1' or 'p2'
    scheduled_time TIMESTAMPTZ,
    next_match_id UUID REFERENCES matches(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Match Sets (Score tracking)
CREATE TABLE match_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    set_number INTEGER NOT NULL,
    p1_score INTEGER DEFAULT 0,
    p2_score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(match_id, set_number)
);

-- Enable Realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
ALTER PUBLICATION supabase_realtime ADD TABLE match_sets;
ALTER PUBLICATION supabase_realtime ADD TABLE courts;
ALTER PUBLICATION supabase_realtime ADD TABLE tournaments;

-- Enable RLS
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_sets ENABLE ROW LEVEL SECURITY;

-- Simple "Permissive" policies for local development/MVP
-- In production, these would be restricted by auth.uid()
CREATE POLICY "Allow all public access" ON tournaments FOR ALL USING (true);
CREATE POLICY "Allow all public access" ON courts FOR ALL USING (true);
CREATE POLICY "Allow all public access" ON matches FOR ALL USING (true);
CREATE POLICY "Allow all public access" ON match_sets FOR ALL USING (true);
