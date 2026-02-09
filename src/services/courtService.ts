import { supabase } from '../lib/supabase';

export type Court = {
    id: string;
    tournament_id: string;
    name: string;
    is_available: boolean;
};

export const CourtService = {
    async getByTournament(tournamentId: string) {
        const { data, error } = await supabase
            .from('courts')
            .select('*')
            .eq('tournament_id', tournamentId)
            .order('name', { ascending: true });

        if (error) throw error;
        return data as Court[];
    },

    async updateAvailability(id: string, is_available: boolean) {
        const { error } = await supabase
            .from('courts')
            .update({ is_available })
            .eq('id', id);

        if (error) throw error;
    }
};
