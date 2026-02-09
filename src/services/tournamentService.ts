import { supabase } from '../lib/supabase';
import type { Tournament } from '../types/tournament';


export const TournamentService = {
    async getAll() {
        const { data, error } = await supabase
            .from('tournaments')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Tournament[];
    },

    async create(tournament: Omit<Tournament, 'id' | 'created_at' | 'status'>) {
        const { data, error } = await supabase
            .from('tournaments')
            .insert([tournament])
            .select()
            .single();

        if (error) throw error;
        return data as Tournament;
    },

    async updateStatus(id: string, status: Tournament['status']) {
        const { error } = await supabase
            .from('tournaments')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
    }
};
