-- Pickle-Pulse Initial Schema

-- 1. Tournaments
CREATE TABLE tournaments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    format TEXT NOT NULL CHECK (format IN ('single_elim', 'double_elim', 'round_robin')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
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
    winner_id UUID,
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
