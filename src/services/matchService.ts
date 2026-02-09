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

        // Fallback or Direct update (Supabase RPC can be complex to setup without DB access)
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
    }
};
