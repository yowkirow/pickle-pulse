-- 5. Participants (Registration)
CREATE TABLE participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime for participants
ALTER PUBLICATION supabase_realtime ADD TABLE participants;

-- Enable RLS
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- Permissive policy for registration (Public can insert)
CREATE POLICY "Anyone can register" ON participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view participants" ON participants FOR SELECT USING (true);
CREATE POLICY "Organizers can update status" ON participants FOR UPDATE USING (true);
