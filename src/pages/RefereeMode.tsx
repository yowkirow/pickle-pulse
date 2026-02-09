import React, { useState } from 'react';
import { Shield, ChevronLeft, RotateCcw, CheckCircle2, Trophy, Activity, Search } from 'lucide-react';
import { useLiveTicker } from '../hooks/useLiveTicker';
import { useLiveMatch } from '../hooks/useLiveMatch';
import { MatchService } from '../services/matchService';
import type { MatchNode } from '../types/tournament';

export const RefereeMode: React.FC = () => {
    const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
    const scheduledMatches = useLiveTicker(); // Reusing this to find matches
    const { match, sets, loading } = useLiveMatch(selectedMatchId || undefined);

    const currentSet = sets.length > 0 ? sets[sets.length - 1] : null;

    const handlePoint = async (player: 1 | 2, increment: number) => {
        if (!currentSet) return;
        try {
            await MatchService.updatePoint(currentSet.id, player, increment);
        } catch (err) {
            console.error('Scoring error:', err);
        }
    };

    if (!selectedMatchId) {
        return (
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter">Referee Command</h2>
                    <p className="text-accent-muted font-bold uppercase text-xs tracking-widest">Select an active pulse to begin officiating</p>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-muted" size={20} />
                        <input
                            type="text"
                            placeholder="SEARCH MATCH OR COURT..."
                            className="w-full bg-secondary border-2 border-border rounded-sport py-4 pl-12 pr-4 font-black uppercase tracking-widest focus:border-primary focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {scheduledMatches.filter(m => m.status !== 'completed').map(m => (
                            <button
                                key={m.id}
                                onClick={() => setSelectedMatchId(m.id)}
                                className="sport-card p-6 flex items-center justify-between group hover:border-primary transition-all text-left"
                            >
                                <div>
                                    <p className="text-[10px] font-black text-primary uppercase mb-1">{m.round_name || 'Tournament Play'}</p>
                                    <h4 className="text-xl font-black uppercase italic tracking-tighter">
                                        {m.p1_name} <span className="text-accent-muted not-italic px-2">VS</span> {m.p2_name}
                                    </h4>
                                </div>
                                <ChevronLeft className="rotate-180 text-accent-muted group-hover:text-primary transition-colors" />
                            </button>
                        ))}
                        {scheduledMatches.length === 0 && (
                            <div className="py-20 text-center border-2 border-dashed border-border rounded-sport opacity-40">
                                <Activity className="mx-auto mb-4" size={32} />
                                <p className="font-black uppercase tracking-widest text-xs">No Active Matches Found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (loading || !match) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
                <Activity className="animate-spin" size={48} />
                <p className="font-black uppercase tracking-widest">Syncing Pulse...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto h-full flex flex-col space-y-4 lg:space-y-8">
            {/* Match Status Bar */}
            <div className="bg-secondary p-4 flex justify-between items-center border-b-4 border-primary shadow-xl rounded-sport">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSelectedMatchId(null)}
                        className="bg-background p-2 rounded-sport hover:text-primary transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Live Officiating</p>
                        </div>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter">
                            {match.round_name || 'Match Play'}
                        </h3>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-right">
                    <div className="px-3 border-r border-border">
                        <p className="text-[10px] font-bold text-accent-muted uppercase tracking-widest">Status</p>
                        <p className="font-black text-xs uppercase text-primary">{match.status}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-accent-muted uppercase tracking-widest">Sets</p>
                        <p className="font-black text-xs uppercase">{sets.length} Played</p>
                    </div>
                </div>
            </div>

            {/* Scoreboard Layout */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <RefereeScoreCard
                    name={match.p1_name}
                    score={currentSet?.p1_score || 0}
                    onAdd={() => handlePoint(1, 1)}
                    onUndo={() => handlePoint(1, -1)}
                    isActive={(currentSet?.p1_score || 0) >= (currentSet?.p2_score || 0)}
                />
                <RefereeScoreCard
                    name={match.p2_name}
                    score={currentSet?.p2_score || 0}
                    onAdd={() => handlePoint(2, 1)}
                    onUndo={() => handlePoint(2, -1)}
                    isActive={(currentSet?.p2_score || 0) > (currentSet?.p1_score || 0)}
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
                    Finalize Set
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
            <span>PULSE NODE</span>
            {isActive && <Trophy size={14} />}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
            <button
                onClick={(e) => { e.stopPropagation(); onUndo(); }}
                className="absolute top-4 right-4 p-4 text-accent-muted hover:text-white transition-colors z-10"
            >
                <RotateCcw size={24} />
            </button>

            <span className="text-sm font-black uppercase tracking-[0.4em] text-accent-muted mb-4 px-4 text-center">{name}</span>

            <div className="relative group cursor-pointer" onClick={onAdd}>
                <h4 className="text-[12rem] lg:text-[15rem] font-black italic tracking-tighter leading-none font-display text-white">
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
