import { supabase } from '../lib/supabase';
import type { Tournament, MatchNode } from '../types/tournament';

export const BracketEngine = {
    /**
     * Initializes a single elimination bracket for a tournament.
     * For now, assumes a power of 2 number of participants or uses placeholders.
     */
    async generateInitialBracket(tournamentId: string, participants: string[]) {
        const numParticipants = participants.length;
        const numRounds = Math.ceil(Math.log2(numParticipants));
        const totalMatches = Math.pow(2, numRounds) - 1;

        // Create rounds and matches
        let matchesToCreate = [];
        let currentRoundMatches = Math.pow(2, numRounds - 1);

        // This is a simplified version. A real engine handles seeds and byes.
        // For Phase 11, we focus on the structure.

        for (let round = 1; round <= numRounds; round++) {
            const roundName = this.getRoundName(round, numRounds);
            for (let i = 0; i < currentRoundMatches; i++) {
                matchesToCreate.push({
                    tournament_id: tournamentId,
                    round_name: roundName,
                    p1_name: round === 1 ? (participants[i * 2] || 'TBD') : 'TBD',
                    p2_name: round === 1 ? (participants[i * 2 + 1] || 'TBD') : 'TBD',
                    status: 'scheduled'
                });
            }
            currentRoundMatches /= 2;
        }

        const { data, error } = await supabase
            .from('matches')
            .insert(matchesToCreate)
            .select();

        if (error) throw error;
        return data;
    },

    getRoundName(round: number, totalRounds: number) {
        if (round === totalRounds) return 'Finals';
        if (round === totalRounds - 1) return 'Semi-Finals';
        if (round === totalRounds - 2) return 'Quarter-Finals';
        return `Round of ${Math.pow(2, totalRounds - round + 1)}`;
    }
};
