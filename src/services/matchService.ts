import { supabase } from '../lib/supabase';

export type MatchSet = {
    id: string;
    match_id: string;
    set_number: number;
    p1_score: number;
    p2_score: number;
};

export const MatchService = {
    async getSets(matchId: string) {
        const { data, error } = await supabase
            .from('match_sets')
            .select('*')
            .eq('match_id', matchId)
            .order('set_number', { ascending: true });

        if (error) throw error;
        return data as MatchSet[];
    },

    async updatePoint(setId: string, _player: 1 | 2, increment: number) {
        const field = _player === 1 ? 'p1_score' : 'p2_score';
        const { data: currentSet } = await supabase
            .from('match_sets')
            .select(field)
            .eq('id', setId)
            .single();

        const newScore = ((currentSet as any)?.[field] || 0) + increment;
        await supabase
            .from('match_sets')
            .update({ [field]: Math.max(0, newScore) })
            .eq('id', setId);
    },

    async createSet(matchId: string, setNumber: number) {
        const { data, error } = await supabase
            .from('match_sets')
            .insert([{ match_id: matchId, set_number: setNumber, p1_score: 0, p2_score: 0 }])
            .select()
            .single();

        if (error) throw error;

        // Also ensure match status is in_progress
        await supabase.from('matches').update({ status: 'in_progress' }).eq('id', matchId);

        return data as MatchSet;
    },

    async completeMatch(matchId: string, winnerId: string) {
        const { error } = await supabase
            .from('matches')
            .update({ status: 'completed', winner_id: winnerId })
            .eq('id', matchId);

        if (error) throw error;
    }
};
