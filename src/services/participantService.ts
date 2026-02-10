import { supabase } from '../lib/supabase';

export interface Participant {
    id: string;
    tournament_id: string;
    name: string;
    email?: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

export const ParticipantService = {
    async register(tournamentId: string, name: string, email?: string) {
        const { data, error } = await supabase
            .from('participants')
            .insert([{ tournament_id: tournamentId, name, email }])
            .select()
            .single();

        if (error) throw error;
        return data as Participant;
    },

    async getByTournament(tournamentId: string) {
        const { data, error } = await supabase
            .from('participants')
            .select('*')
            .eq('tournament_id', tournamentId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data as Participant[];
    },

    async updateStatus(id: string, status: Participant['status']) {
        const { error } = await supabase
            .from('participants')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
    }
};
