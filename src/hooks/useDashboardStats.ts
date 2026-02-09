import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface DashboardStats {
    liveMatches: number;
    inQueue: number;
    completed: number;
}

export const useDashboardStats = (tournamentId?: string) => {
    const [stats, setStats] = useState<DashboardStats>({
        liveMatches: 0,
        inQueue: 0,
        completed: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            let query = supabase.from('matches').select('status', { count: 'exact' });

            if (tournamentId) {
                query = query.eq('tournament_id', tournamentId);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching stats:', error);
                return;
            }

            const counts = {
                liveMatches: data.filter(m => m.status === 'in_progress').length,
                inQueue: data.filter(m => m.status === 'scheduled').length,
                completed: data.filter(m => m.status === 'completed').length
            };

            setStats(counts);
        };

        fetchStats();

        const subscription = supabase
            .channel('stats-updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, fetchStats)
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [tournamentId]);

    return stats;
};
