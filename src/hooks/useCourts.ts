import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Court } from '../services/courtService';

export const useCourts = (tournamentId?: string) => {
    const [courts, setCourts] = useState<Court[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCourts = async () => {
        if (!tournamentId) return;
        const { data, error } = await supabase
            .from('courts')
            .select('*')
            .eq('tournament_id', tournamentId)
            .order('court_number', { ascending: true });

        if (!error && data) {
            setCourts(data as Court[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCourts();

        if (!tournamentId) return;

        const channel = supabase
            .channel(`courts-${tournamentId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'courts',
                filter: `tournament_id=eq.${tournamentId}`
            }, fetchCourts)
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, [tournamentId]);

    return { courts, loading };
};
