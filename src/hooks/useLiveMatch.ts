import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { MatchNode } from '../types/tournament';
import type { MatchSet } from '../services/matchService';

export const useLiveMatch = (matchId: string | undefined) => {
    const [match, setMatch] = useState<MatchNode | null>(null);
    const [sets, setSets] = useState<MatchSet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!matchId) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            // Fetch match
            const { data: matchData, error: matchError } = await supabase
                .from('matches')
                .select('*')
                .eq('id', matchId)
                .single();

            if (matchError) {
                console.error('Error fetching match:', matchError);
                return;
            }
            setMatch(matchData as MatchNode);

            // Fetch sets
            const { data: setData, error: setError } = await supabase
                .from('match_sets')
                .select('*')
                .eq('match_id', matchId)
                .order('set_number', { ascending: true });

            if (setError) {
                console.error('Error fetching sets:', setError);
                return;
            }
            setSets(setData as MatchSet[]);
            setLoading(false);
        };

        fetchData();

        // Subscribe to match changes
        const matchSub = supabase
            .channel(`match-${matchId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'matches', filter: `id=eq.${matchId}` }, fetchData)
            .subscribe();

        // Subscribe to set changes
        const setSub = supabase
            .channel(`sets-${matchId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'match_sets', filter: `match_id=eq.${matchId}` }, fetchData)
            .subscribe();

        return () => {
            matchSub.unsubscribe();
            setSub.unsubscribe();
        };
    }, [matchId]);

    return { match, sets, loading };
};
