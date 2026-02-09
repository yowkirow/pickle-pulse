import { supabase } from '../lib/supabase';
import type { MatchNode } from '../types/tournament';

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
        // 1. Mark current match as completed
        const { data: match, error: fetchError } = await supabase
            .from('matches')
            .update({ status: 'completed', winner_id: winnerId })
            .eq('id', matchId)
            .select()
            .single();

        if (fetchError) throw fetchError;

        // 2. If there's a next match, promote the winner
        if ((match as MatchNode).next_match_id) {
            const winnerName = winnerId === 'p1' ? (match as MatchNode).p1_name : (match as MatchNode).p2_name;

            // We need to know if we are p1 or p2 in the next match.
            // A simple way is to check if p1_name is 'TBD' in the next match.
            // But better logic: find the siblings to determine position.
            // For now, let's use a simpler heuristic: try to fill p1, then p2.
            const { data: nextMatch } = await supabase
                .from('matches')
                .select('*')
                .eq('id', (match as MatchNode).next_match_id)
                .single();

            if (nextMatch) {
                const fieldToUpdate = (nextMatch as MatchNode).p1_name === 'TBD' ? 'p1_name' : 'p2_name';
                await supabase
                    .from('matches')
                    .update({ [fieldToUpdate]: winnerName })
                    .eq('id', (match as MatchNode).next_match_id);
            }
        }
    }
};
