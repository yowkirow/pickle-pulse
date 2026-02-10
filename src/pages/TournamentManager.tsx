import React, { useState } from 'react';
import { TournamentService } from '../services/tournamentService';
import { useTournaments } from '../hooks/useTournaments';
import type { Tournament } from '../types/tournament';
import { PlusCircle, Trophy, ListOrdered, Share2, Activity, Settings2 } from 'lucide-react';
import { BracketEngine } from '../services/bracketEngine';
import { TournamentCard } from '../components/tournaments/TournamentCard';

export const TournamentManager: React.FC = () => {
    const [name, setName] = useState('');
    const [format, setFormat] = useState<Tournament['format']>('single_elim');
    const [loading, setLoading] = useState(false);
    const { tournaments, loading: listLoading } = useTournaments();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await TournamentService.create({ name, format });
            setName('');
        } catch (err: any) {
            console.error(err);
            alert(`Initialization error: ${err.message || 'Check connection'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSeed = async (tournamentId: string, participantNames?: string[]) => {
        let participants = participantNames;

        if (!participants) {
            const input = prompt("Enter participant names (comma-separated):");
            if (!input) return;
            participants = input.split(',').map(s => s.trim()).filter(Boolean);
        }

        if (participants.length < 2) {
            alert("Need at least 2 participants");
            return;
        }

        setLoading(true);
        try {
            await BracketEngine.generateInitialBracket(tournamentId, participants);
            await TournamentService.updateStatus(tournamentId, 'active');
            alert("Bracket seeded successfully!");
        } catch (err: any) {
            console.error(err);
            alert(`Seeding error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-border pb-6 gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-primary text-background px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter rounded-sm">ADMIN PORTAL</span>
                        <div className="h-1 flex-1 bg-border rounded-full min-w-[100px]" />
                    </div>
                    <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
                        Event Registry
                    </h2>
                </div>
                <button className="sport-button-outline flex items-center gap-2">
                    <Settings2 size={18} />
                    Global Settings
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Creation Form */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="sport-card p-8">
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter border-b border-border pb-4 mb-6 flex items-center gap-3">
                            <PlusCircle className="text-primary" size={28} />
                            Initialize Event
                        </h3>

                        <form onSubmit={handleCreate} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-[0.3em] text-accent-muted">Official Event Title</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="E.G. US OPEN QUALIFIER"
                                    className="w-full bg-background border-2 border-border rounded-sport px-4 py-4 focus:outline-none focus:border-primary font-black uppercase tracking-widest transition-colors text-white text-base"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-[0.3em] text-accent-muted">Competition Logic</label>
                                <div className="grid grid-cols-1 gap-2">
                                    <FormatOption
                                        selected={format === 'single_elim'}
                                        onClick={() => setFormat('single_elim')}
                                        icon={<Trophy size={16} />}
                                        label="Single Elimination"
                                    />
                                    <FormatOption
                                        selected={format === 'double_elim'}
                                        onClick={() => setFormat('double_elim')}
                                        icon={<Share2 size={16} />}
                                        label="Double Elimination"
                                    />
                                    <FormatOption
                                        selected={format === 'round_robin'}
                                        onClick={() => setFormat('round_robin')}
                                        icon={<ListOrdered size={16} />}
                                        label="Round Robin"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sport-button py-5 text-xl flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <Activity className="animate-spin" size={24} />
                                        ACTIVATING...
                                    </>
                                ) : (
                                    'ACTIVATE PULSE'
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Tournament Archive */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                            <Activity className="text-primary" size={24} />
                            Active Database
                        </h3>
                        {tournaments.length > 0 && (
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest animate-pulse">
                                Pulse Detected ({tournaments.length} Events)
                            </span>
                        )}
                    </div>

                    <div className="space-y-3">
                        {listLoading ? (
                            <div className="py-20 text-center sport-card opacity-50">
                                <Activity className="animate-spin mx-auto mb-4" size={40} />
                                <p className="font-black uppercase tracking-widest text-xs">Syncing Registry...</p>
                            </div>
                        ) : tournaments.length > 0 ? (
                            tournaments.map((t) => (
                                <TournamentCard
                                    key={t.id}
                                    tournament={t}
                                />
                            ))
                        ) : (
                            <div className="sport-card p-20 flex flex-col items-center justify-center text-accent-muted bg-white/5 border-dashed border-2">
                                <div className="w-20 h-20 bg-border rounded-full flex items-center justify-center mb-6 opacity-20">
                                    <Trophy size={40} />
                                </div>
                                <p className="font-black uppercase tracking-[0.2em] italic mb-2">No Active Pulse Detected</p>
                                <p className="text-xs text-accent-muted/60 max-w-sm text-center font-bold">The tournament registry is currently empty. Use the form to initiate the heartbeat of your first event.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface FormatOptionProps {
    selected: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}

const FormatOption = ({ selected, onClick, icon, label }: FormatOptionProps) => (
    <div
        onClick={onClick}
        className={`p-4 rounded-sport border-2 cursor-pointer transition-all duration-200 flex gap-4 items-center ${selected
            ? 'bg-primary/10 border-primary border-l-[8px]'
            : 'bg-background border-border hover:border-accent-muted'
            }`}
    >
        <div className={`w-10 h-10 rounded-sport flex items-center justify-center ${selected ? 'bg-primary text-background' : 'bg-secondary text-accent-muted'}`}>
            {icon}
        </div>
        <div>
            <p className={`font-black uppercase tracking-tight text-sm ${selected ? 'text-white italic' : 'text-accent-muted'}`}>{label}</p>
        </div>
    </div>
);
