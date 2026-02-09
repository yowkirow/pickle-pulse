import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MatchNode } from '../types/tournament';

export const useLiveTicker = (tournamentId?: string) => {
    const [matches, setMatches] = useState<MatchNode[]>([]);

    useEffect(() => {
        const fetchTicker = async () => {
            let query = supabase
                .from('matches')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            if (tournamentId) {
                query = query.eq('tournament_id', tournamentId);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching ticker:', error);
                return;
            }

            setMatches(data as MatchNode[]);
        };

        fetchTicker();

        const subscription = supabase
            .channel('ticker-updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, fetchTicker)
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [tournamentId]);

    return matches;
};
