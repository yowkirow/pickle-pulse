import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Round, MatchNode } from '../types/tournament';

export const useBracketData = (tournamentId: string | undefined) => {
    const [rounds, setRounds] = useState<Round[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!tournamentId) {
            setLoading(false);
            return;
        }

        const fetchBracket = async () => {
            const { data: matches, error } = await supabase
                .from('matches')
                .select(`
                    *,
                    match_sets (
                        p1_score,
                        p2_score
                    )
                `)
                .eq('tournament_id', tournamentId)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching bracket:', error);
                return;
            }

            // Group matches into rounds
            const groupedRounds: { [key: string]: MatchNode[] } = {};

            matches.forEach((m: any) => {
                const roundName = m.round_name || 'Round 1';
                if (!groupedRounds[roundName]) groupedRounds[roundName] = [];

                // Aggregate scores from sets (taking latest/highest for now)
                const score1 = m.match_sets?.[0]?.p1_score || 0;
                const score2 = m.match_sets?.[0]?.p2_score || 0;

                groupedRounds[roundName].push({
                    id: m.id,
                    p1_name: m.p1_name,
                    p2_name: m.p2_name,
                    score1,
                    score2,
                    winner_id: m.winner_id,
                    status: m.status,
                    round_name: roundName
                });
            });

            // Convert to ordered array
            const orderedRounds = Object.entries(groupedRounds).map(([name, matches]) => ({
                name,
                matches
            }));

            setRounds(orderedRounds);
            setLoading(false);
        };

        fetchBracket();

        // Subscribe to changes
        const subscription = supabase
            .channel('bracket-updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, fetchBracket)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'match_sets' }, fetchBracket)
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [tournamentId]);

    return { rounds, loading };
};
