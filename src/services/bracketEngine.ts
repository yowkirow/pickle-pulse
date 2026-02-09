import { supabase } from '../lib/supabase';
import type { MatchNode } from '../types/tournament';

export const BracketEngine = {
    /**
     * Initializes a single elimination bracket bottom-up to link next_match_id.
     */
    async generateInitialBracket(tournamentId: string, participants: string[]) {
        const numParticipants = participants.length;
        const numRounds = Math.ceil(Math.log2(numParticipants));

        // We'll store matches round by round to link them
        let previousRoundMatchIds: string[] = [];

        for (let round = numRounds; round >= 1; round--) {
            const numMatchesInRound = Math.pow(2, numRounds - round);
            const roundName = this.getRoundName(round, numRounds);
            const matchesToInsert = [];

            for (let i = 0; i < numMatchesInRound; i++) {
                // Determine names for Round 1
                let p1 = 'TBD';
                let p2 = 'TBD';
                if (round === 1) {
                    p1 = participants[i * 2] || 'TBD';
                    p2 = participants[i * 2 + 1] || 'BYE';
                }

                matchesToInsert.push({
                    tournament_id: tournamentId,
                    round_name: roundName,
                    p1_name: p1,
                    p2_name: p2,
                    status: (p2 === 'BYE' && round === 1) ? 'completed' : 'scheduled',
                    winner_id: (p2 === 'BYE' && round === 1) ? 'p1' : null,
                    next_match_id: previousRoundMatchIds[Math.floor(i / 2)] || null
                });
            }

            const { data, error } = await supabase
                .from('matches')
                .insert(matchesToInsert)
                .select();

            if (error) throw error;

            const currentRoundMatches = data as MatchNode[];
            previousRoundMatchIds = currentRoundMatches.map(m => m.id);

            // Handle advancement for BYEs in this round
            for (const match of currentRoundMatches) {
                if (match.status === 'completed' && match.next_match_id && match.winner_id) {
                    const winnerName = match.winner_id === 'p1' ? match.p1_name : match.p2_name;
                    // We need to determine if we are p1 or p2 in the parent. 
                    // This is tricky because the parent isn't in DB yet in a true bottom-up.
                    // WAIT: My loop is round = numRounds down to 1.
                    // So when I am at Round 1, the next_match (Round 2) IS already in the DB.
                    // Let's find the next match and update it.
                    const { data: nextMatch } = await supabase
                        .from('matches')
                        .select('*')
                        .eq('id', match.next_match_id)
                        .single();

                    if (nextMatch) {
                        const fieldToUpdate = (nextMatch as MatchNode).p1_name === 'TBD' ? 'p1_name' : 'p2_name';
                        await supabase
                            .from('matches')
                            .update({ [fieldToUpdate]: winnerName })
                            .eq('id', match.next_match_id);
                    }
                }
            }
        }

        return previousRoundMatchIds; // These will be the Round 1 IDs
    },

    getRoundName(round: number, totalRounds: number) {
        if (round === totalRounds) return 'Finals';
        if (round === totalRounds - 1) return 'Semi-Finals';
        if (round === totalRounds - 2) return 'Quarter-Finals';
        return `Round of ${Math.pow(2, totalRounds - round + 1)}`;
    }
};
```
