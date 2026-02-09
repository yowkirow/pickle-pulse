import { supabase } from '../lib/supabase';

export interface Court {
    id: string;
    tournament_id: string;
    court_number: number;
    status: 'available' | 'occupied' | 'maintenance';
    created_at: string;
}

export const CourtService = {
    async getCourts(tournamentId: string) {
        const { data, error } = await supabase
            .from('courts')
            .select('*')
            .eq('tournament_id', tournamentId)
            .order('court_number', { ascending: true });

        if (error) throw error;
        return data as Court[];
    },

    async addCourt(tournamentId: string, courtNumber: number) {
        const { data, error } = await supabase
            .from('courts')
            .insert([{ tournament_id: tournamentId, court_number: courtNumber }])
            .select()
            .single();

        if (error) throw error;
        return data as Court;
    },

    async deleteCourt(courtId: string) {
        const { error } = await supabase
            .from('courts')
            .delete()
            .eq('id', courtId);

        if (error) throw error;
    },

    async updateStatus(courtId: string, status: Court['status']) {
        const { error } = await supabase
            .from('courts')
            .update({ status })
            .eq('id', courtId);

        if (error) throw error;
    }
};
