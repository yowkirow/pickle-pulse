import React, { useState } from 'react';
import { TournamentService } from '../services/tournamentService';
import { PlusCircle, Trophy, ListOrdered, Share2, Activity, Settings2 } from 'lucide-react';

export const TournamentManager: React.FC = () => {
    const [name, setName] = useState('');
    const [format, setFormat] = useState<'single_elim' | 'double_elim' | 'round_robin'>('single_elim');
    const [loading, setLoading] = useState(false);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await TournamentService.create({ name, format });
            setName('');
            alert('Tournament Pulse Initialized!');
        } catch (err) {
            console.error(err);
            alert('Initialization error. Check logs.');
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
                <div className="lg:col-span-5 space-y-6">
                    <div className="sport-card p-8">
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter border-b border-border pb-4 mb-6 flex items-center gap-3">
                            <PlusCircle className="text-primary" size={28} />
                            Initialize New Event
                        </h3>

                        <form onSubmit={handleCreate} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-[0.3em] text-accent-muted">Official Event Title</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="E.G. US OPEN QUALIFIER"
                                    className="w-full bg-background border-2 border-border rounded-sport px-4 py-4 focus:outline-none focus:border-primary font-black uppercase tracking-widest transition-colors"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-[0.3em] text-accent-muted">Competition Logic</label>
                                <div className="grid grid-cols-1 gap-3">
                                    <FormatOption
                                        selected={format === 'single_elim'}
                                        onClick={() => setFormat('single_elim')}
                                        icon={<Trophy size={20} />}
                                        label="Single Elimination"
                                        description="Classic Tournament Bracket"
                                    />
                                    <FormatOption
                                        selected={format === 'double_elim'}
                                        onClick={() => setFormat('double_elim')}
                                        icon={<Share2 size={20} />}
                                        label="Double Elimination"
                                        description="Winner & Loser Brackets"
                                    />
                                    <FormatOption
                                        selected={format === 'round_robin'}
                                        onClick={() => setFormat('round_robin')}
                                        icon={<ListOrdered size={20} />}
                                        label="Round Robin"
                                        description="Group Play Format"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sport-button py-5 text-xl"
                            >
                                {loading ? 'PROCESSING...' : 'ACTIVATE TOURNAMENT'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Tournament Archive */}
                <div className="lg:col-span-7 space-y-4">
                    <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                        <Activity className="text-primary" size={24} />
                        Active Database
                    </h3>
                    <div className="sport-card p-12 flex flex-col items-center justify-center text-accent-muted bg-white/5 border-dashed border-2">
                        <div className="w-20 h-20 bg-border rounded-full flex items-center justify-center mb-6 opacity-20">
                            <Trophy size={40} />
                        </div>
                        <p className="font-black uppercase tracking-[0.2em] italic mb-2">No Active Pulse Detected</p>
                        <p className="text-xs text-accent-muted/60 max-w-sm text-center font-bold">The tournament registry is currently empty. Use the sidebar to initiate the heartbeat of your first event.</p>
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
    description: string;
}

const FormatOption = ({ selected, onClick, icon, label, description }: FormatOptionProps) => (
    <div
        onClick={onClick}
        className={`p-5 rounded-sport border-2 cursor-pointer transition-all duration-200 flex gap-5 items-center ${selected
            ? 'bg-primary/10 border-primary border-l-[12px]'
            : 'bg-background border-border hover:border-accent-muted'
            }`}
    >
        <div className={`w-12 h-12 rounded-sport flex items-center justify-center ${selected ? 'bg-primary text-background' : 'bg-secondary text-accent-muted'}`}>
            {icon}
        </div>
        <div>
            <p className={`font-black uppercase tracking-tight ${selected ? 'text-white text-xl italic' : 'text-accent-muted'}`}>{label}</p>
            <p className="text-[10px] font-bold text-accent-muted uppercase tracking-widest">{description}</p>
        </div>
    </div>
);
