import { supabase } from '../lib/supabase';

export type Tournament = {
    id: string;
    name: string;
    status: 'planning' | 'active' | 'completed';
    format: 'single_elim' | 'double_elim' | 'round_robin';
    created_at: string;
};

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
