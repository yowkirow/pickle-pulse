import React, { useState } from 'react';
import { Shield, ChevronLeft, RotateCcw, CheckCircle2, Trophy } from 'lucide-react';

export const RefereeMode: React.FC = () => {
    const [p1Score, setP1Score] = useState(0);
    const [p2Score, setP2Score] = useState(0);

    const increment = (player: 1 | 2) => {
        if (player === 1) setP1Score(s => s + 1);
        else setP2Score(s => s + 1);
    };

    const undo = (player: 1 | 2) => {
        if (player === 1) setP1Score(s => Math.max(0, s - 1));
        else setP2Score(s => Math.max(0, s - 1));
    };

    return (
        <div className="max-w-2xl mx-auto h-full flex flex-col space-y-4 lg:space-y-8">
            {/* Match Status Bar */}
            <div className="bg-secondary p-4 flex justify-between items-center border-b-4 border-primary shadow-xl">
                <div className="flex items-center gap-4">
                    <button className="bg-background p-2 rounded-sport hover:text-primary transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Live Broadcast</p>
                        </div>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter">Court 04 • Championship Court</h3>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-right">
                    <div className="px-3 border-r border-border">
                        <p className="text-[10px] font-bold text-accent-muted uppercase tracking-widest">Division</p>
                        <p className="font-black text-xs uppercase">Men's Open</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-accent-muted uppercase tracking-widest">Set</p>
                        <p className="font-black text-xs uppercase">1 / 3</p>
                    </div>
                </div>
            </div>

            {/* Scoreboard Layout */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <RefereeScoreCard
                    name="Team Anderson"
                    score={p1Score}
                    onAdd={() => increment(1)}
                    onUndo={() => undo(1)}
                    isActive={p1Score >= p2Score}
                />
                <RefereeScoreCard
                    name="Team Baker"
                    score={p2Score}
                    onAdd={() => increment(2)}
                    onUndo={() => undo(2)}
                    isActive={p2Score > p1Score}
                    isSecondary
                />
            </div>

            {/* Tactical Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-20 lg:pb-0">
                <button className="bg-secondary border-2 border-border p-4 rounded-sport font-black uppercase tracking-widest text-accent-muted hover:text-white hover:border-white transition-all flex items-center justify-center gap-2">
                    <RotateCcw size={18} />
                    Time-Out
                </button>
                <button className="bg-secondary border-2 border-border p-4 rounded-sport font-black uppercase tracking-widest text-accent-muted hover:text-white hover:border-white transition-all flex items-center justify-center gap-2">
                    <Shield size={18} />
                    Review Point
                </button>
                <button className=" sport-button p-4 text-sm flex items-center justify-center gap-2">
                    <CheckCircle2 size={18} />
                    End of Set
                </button>
            </div>
        </div>
    );
};

interface RefereeScoreCardProps {
    name: string;
    score: number;
    onAdd: () => void;
    onUndo: () => void;
    isActive: boolean;
    isSecondary?: boolean;
}

const RefereeScoreCard = ({ name, score, onAdd, onUndo, isActive, isSecondary }: RefereeScoreCardProps) => (
    <div className={`sport-card relative flex flex-col pt-0 transition-all duration-300 ${isActive ? 'ring-4 ring-primary ring-inset' : 'opacity-80'}`}>
        <div className={`p-3 font-black uppercase text-[10px] tracking-widest flex items-center justify-between ${isSecondary ? 'bg-background text-white' : 'bg-primary text-background'}`}>
            <span>TEAM IDENTIFIER</span>
            {isActive && <Trophy size={14} />}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
            <button
                onClick={onUndo}
                className="absolute top-4 right-4 p-4 text-accent-muted hover:text-white transition-colors"
            >
                <RotateCcw size={24} />
            </button>

            <span className="text-sm font-black uppercase tracking-[0.4em] text-accent-muted mb-4">{name}</span>

            <div className="relative group cursor-pointer" onClick={onAdd}>
                <h4 className="text-[12rem] lg:text-[15rem] font-black italic tracking-tighter leading-none font-display">
                    {score < 10 ? `0${score}` : score}
                </h4>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-10 transition-opacity">
                    <Trophy size={120} />
                </div>
            </div>

            <button
                onClick={onAdd}
                className="sport-button w-full mt-6 py-4 text-lg"
            >
                POINT +1
            </button>
        </div>
    </div>
);
