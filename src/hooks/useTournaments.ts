import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Tournament } from '../types/tournament';

export const useTournaments = () => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTournaments = async () => {
        const { data, error } = await supabase
            .from('tournaments')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tournaments:', error);
            return;
        }

        setTournaments(data as Tournament[]);
        setLoading(false);
    };

    useEffect(() => {
        fetchTournaments();

        const subscription = supabase
            .channel('tournament-list')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tournaments' }, fetchTournaments)
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return { tournaments, loading };
};
