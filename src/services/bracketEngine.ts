export type BracketMatch = {
    id: string;
    stage: number; // 0 for Finals, 1 for Semis, etc.
    position: number;
    matchId?: string;
    nextMatchId?: string;
};

export const BracketEngine = {
    /**
     * Generates a single-elimination bracket structure for N players.
     * Rounds are calculated as powers of 2 (2, 4, 8, 16...).
     */
    generateSingleElimination(playerCount: number) {
        const rounds = Math.ceil(Math.log2(playerCount));
        const matches: BracketMatch[] = [];

        // Working backwards from finals
        let currentId = 1;
        for (let r = 0; r < rounds; r++) {
            const matchCountInRound = Math.pow(2, r);
            for (let p = 0; p < matchCountInRound; p++) {
                matches.push({
                    id: `match-${currentId++}`,
                    stage: r,
                    position: p,
                    // Logical linking for progression would go here
                });
            }
        }

        return matches;
    }
};
