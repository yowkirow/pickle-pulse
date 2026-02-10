import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useParticipants } from '../hooks/useParticipants';
import { ParticipantService } from '../services/participantService';
import { BracketEngine } from '../services/bracketEngine';
import { TournamentService } from '../services/tournamentService';
import { Users, UserPlus, Trophy, Trash2, ArrowLeft, GripVertical, CheckCircle, Activity } from 'lucide-react';

export const PlayerManager: React.FC = () => {
    const { tournamentId: pathId } = useParams<{ tournamentId: string }>();
    const [searchParams] = useSearchParams();
    const tid = pathId || searchParams.get('tid');
    const navigate = useNavigate();

    const { participants, loading, refresh } = useParticipants(tid || '');
    const [newPlayer, setNewPlayer] = useState('');
    const [seeding, setSeeding] = useState(false);

    const handleAddManual = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tid || !newPlayer.trim()) return;

        try {
            await ParticipantService.register(tid, newPlayer.trim());
            setNewPlayer('');
            refresh();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this player?")) return;
        // Optimization: Status = rejected instead of actual delete to keep logs
        await ParticipantService.updateStatus(id, 'rejected');
        refresh();
    };

    const handleGenerateBracket = async () => {
        if (!tid) return;
        const activeParticipants = participants.filter(p => p.status !== 'rejected');
        if (activeParticipants.length < 2) {
            alert("Need at least 2 active players to seed.");
            return;
        }

        if (!confirm(`Generate bracket with ${activeParticipants.length} teams? This will transition the tournament to LIVE.`)) return;

        setSeeding(true);
        try {
            const names = activeParticipants.map(p => p.name);
            await BracketEngine.generateInitialBracket(tid, names);
            await TournamentService.updateStatus(tid, 'active');
            navigate(`/admin?tid=${tid}`);
        } catch (err: any) {
            console.error(err);
            alert(`Seeding failed: ${err.message}`);
        } finally {
            setSeeding(false);
        }
    };

    if (!tid) return <div>No Tournament ID found.</div>;

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-border pb-6">
                <div className="flex items-center gap-4">
                    <Link to="/tournaments" className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Entry Management</p>
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
                            Player Registry
                        </h2>
                    </div>
                </div>
                <button
                    onClick={handleGenerateBracket}
                    disabled={seeding || loading || participants.length < 2}
                    className="sport-button flex items-center gap-3 px-8 py-4"
                >
                    {seeding ? (
                        <Activity className="animate-spin" size={20} />
                    ) : (
                        <Trophy size={20} />
                    )}
                    GENERATE & START BRACKET
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Manual Entry */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="sport-card p-6">
                        <h3 className="text-xl font-black italic uppercase tracking-tighter mb-6 flex items-center gap-2">
                            <UserPlus size={20} className="text-primary" />
                            Manual Addition
                        </h3>
                        <form onSubmit={handleAddManual} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-accent-muted uppercase tracking-widest">Player/Team Name</label>
                                <input
                                    type="text"
                                    value={newPlayer}
                                    onChange={(e) => setNewPlayer(e.target.value)}
                                    placeholder="WALK-IN ENTRY NAME"
                                    className="w-full bg-background border-2 border-border rounded-sport px-4 py-3 focus:border-primary focus:outline-none font-black uppercase tracking-widest text-white"
                                />
                            </div>
                            <button type="submit" className="w-full sport-button-outline py-3 text-xs">
                                ADD TO ROSTER
                            </button>
                        </form>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 p-6 rounded-sport space-y-4">
                        <div className="flex items-center gap-3 text-primary">
                            <CheckCircle size={20} />
                            <p className="text-xs font-black uppercase tracking-widest">Entry Instructions</p>
                        </div>
                        <p className="text-xs text-accent-muted font-bold leading-relaxed">
                            Registered players will appear in the list on the right. You can remove no-shows or manually add walk-ins here. Seeding order is currently based on registration time (Top to Bottom).
                        </p>
                    </div>
                </div>

                {/* Participant List */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                            <Users size={24} className="text-primary" />
                            Current Roster
                            <span className="text-xs text-accent-muted ml-2">({participants.filter(p => p.status !== 'rejected').length} Players)</span>
                        </h3>
                    </div>

                    <div className="space-y-2">
                        {loading ? (
                            <div className="py-20 text-center sport-card opacity-50">
                                <Activity className="animate-spin mx-auto mb-4" size={40} />
                                <p className="font-black uppercase tracking-widest text-xs">Syncing Roster...</p>
                            </div>
                        ) : participants.filter(p => p.status !== 'rejected').length > 0 ? (
                            participants.filter(p => p.status !== 'rejected').map((p, idx) => (
                                <div key={p.id} className="sport-card p-4 flex items-center justify-between group bg-white/5 border-l-4 border-l-transparent hover:border-l-primary transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="text-[10px] font-black text-accent-muted w-6">
                                            {String(idx + 1).padStart(2, '0')}
                                        </div>
                                        <div className="p-2 bg-secondary rounded-sm text-accent-muted group-hover:text-primary transition-colors">
                                            <GripVertical size={16} />
                                        </div>
                                        <div>
                                            <p className="font-black text-lg uppercase tracking-tight text-white">{p.name}</p>
                                            <p className="text-[10px] text-accent-muted font-bold tracking-widest uppercase">{p.email || 'NO EMAIL PROVIDED'}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        className="p-2 text-accent-muted hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="sport-card p-20 text-center border-dashed border-2 opacity-50">
                                <Users size={48} className="mx-auto mb-4 text-accent-muted" />
                                <p className="font-black uppercase tracking-widest text-xs">Waiting for registrations...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
