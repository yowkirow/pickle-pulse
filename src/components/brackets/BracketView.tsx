import React from 'react';
import { Round, MatchNode } from '../../types/tournament';

interface BracketProps {
    rounds: Round[];
}

const MatchCard: React.FC<{ match: MatchNode; x: number; y: number }> = ({ match, x, y }) => {
    const isP1Winner = match.winner_id === 'p1'; // Simplified for simulation
    const isP2Winner = match.winner_id === 'p2';

    return (
        <g transform={`translate(${x}, ${y})`}>
            {/* Connection Line Tail */}
            <line x1="-20" y1="30" x2="0" y2="30" stroke="#334155" strokeWidth="2" />

            {/* Match Container */}
            <foreignObject width="180" height="60" x="0" y="0">
                <div className="bg-secondary border border-border rounded-sport overflow-hidden shadow-broadcast h-full flex flex-col">
                    {/* Player 1 Row */}
                    <div className={`flex-1 flex items-center justify-between px-3 border-b border-border/50 ${isP1Winner ? 'bg-primary/10' : ''}`}>
                        <span className={`text-[10px] font-black uppercase truncate ${isP1Winner ? 'text-primary' : 'text-accent-muted'}`}>
                            {match.p1_name}
                        </span>
                        <span className="font-black text-xs">{match.score1 ?? '-'}</span>
                    </div>
                    {/* Player 2 Row */}
                    <div className={`flex-1 flex items-center justify-between px-3 ${isP2Winner ? 'bg-primary/10' : ''}`}>
                        <span className={`text-[10px] font-black uppercase truncate ${isP2Winner ? 'text-primary' : 'text-accent-muted'}`}>
                            {match.p2_name}
                        </span>
                        <span className="font-black text-xs">{match.score2 ?? '-'}</span>
                    </div>
                </div>
            </foreignObject>

            {/* Status Indicator */}
            {match.status === 'in_progress' && (
                <circle cx="180" cy="30" r="4" className="fill-primary animate-pulse" />
            )}
        </g>
    );
};

export const BracketView: React.FC<BracketProps> = ({ rounds }) => {
    const columnWidth = 240;
    const cardHeight = 80;

    return (
        <div className="w-full overflow-x-auto p-10 bg-background/50 rounded-xl border border-border backdrop-blur-sm">
            <svg width={rounds.length * columnWidth} height={800} className="mx-auto">
                {rounds.map((round, rIndex) => (
                    <g key={rIndex} transform={`translate(${rIndex * columnWidth}, 0)`}>
                        {/* Round Header */}
                        <text x="0" y="20" className="fill-accent-muted font-black text-[10px] uppercase tracking-[0.3em]">
                            {round.name}
                        </text>

                        {round.matches.map((match, mIndex) => {
                            const yOffset = (mIndex * (cardHeight * Math.pow(2, rIndex))) + (cardHeight * (Math.pow(2, rIndex) - 1) / 2) + 60;

                            return (
                                <React.Fragment key={match.id}>
                                    <MatchCard match={match} x={0} y={yOffset} />

                                    {/* Connector to Next Round */}
                                    {rIndex < rounds.length - 1 && mIndex % 2 === 0 && (
                                        <path
                                            d={`M 180 ${yOffset + 30} L 210 ${yOffset + 30} L 210 ${yOffset + 30 + (cardHeight * Math.pow(2, rIndex))} L 240 ${yOffset + 30 + (cardHeight * Math.pow(2, rIndex))}`}
                                            fill="none"
                                            stroke="#334155"
                                            strokeWidth="2"
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </g>
                ))}
            </svg>
        </div>
    );
};
