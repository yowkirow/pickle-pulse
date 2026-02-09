export type MatchStatus = 'scheduled' | 'in_progress' | 'completed';

export interface MatchNode {
    id: string;
    p1_name: string;
    p2_name: string;
    score1?: number;
    score2?: number;
    winner_id?: string;
    status: MatchStatus;
    round_name?: string;
    next_match_id?: string;
}

export interface Round {
    name: string;
    matches: MatchNode[];
}

export interface Tournament {
    id: string;
    name: string;
    status: 'planning' | 'active' | 'completed';
    format: 'single_elim' | 'double_elim' | 'round_robin';
    created_at: string;
}
