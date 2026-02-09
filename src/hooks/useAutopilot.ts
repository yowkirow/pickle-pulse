import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useAutopilot = (tournamentId?: string, active: boolean = false) => {
    useEffect(() => {
        if (!active || !tournamentId) return;

        const runAutopilot = async () => {
            // 1. Get available courts
            const { data: courts } = await supabase
                .from('courts')
                .select('*')
                .eq('tournament_id', tournamentId)
                .order('name', { ascending: true });

            // 2. Get ready matches (scheduled, both players known, not completed)
            const { data: matches } = await supabase
                .from('matches')
                .select('*')
                .eq('tournament_id', tournamentId)
                .eq('status', 'scheduled')
                .not('p1_name', 'eq', 'TBD')
                .not('p2_name', 'eq', 'TBD')
                .not('p1_name', 'eq', 'BYE')
                .not('p2_name', 'eq', 'BYE')
                .order('created_at', { ascending: true });

            if (!courts || !matches) return;

            // 3. Find busy courts (from in-progress matches)
            const { data: activeMatches } = await supabase
                .from('matches')
                .select('court_id')
                .eq('tournament_id', tournamentId)
                .eq('status', 'in_progress')
                .not('court_id', 'is', null);

            const busyCourtIds = new Set(activeMatches?.map(m => m.court_id) || []);
            const freeCourts = courts.filter(c => !busyCourtIds.has(c.id));

            // 4. Perform Assignments
            for (let i = 0; i < Math.min(freeCourts.length, matches.length); i++) {
                const court = freeCourts[i];
                const match = matches[i];

                console.log(`Autopilot: Assigning ${match.id} to ${court.name}`);

                await supabase
                    .from('matches')
                    .update({
                        court_id: court.id,
                        status: 'in_progress'
                    })
                    .eq('id', match.id);
            }
        };

        // Run immediately and then on changes
        runAutopilot();

        const channel = supabase
            .channel('autopilot-triggers')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, runAutopilot)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'courts' }, runAutopilot)
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, [tournamentId, active]);
};
