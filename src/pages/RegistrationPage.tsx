import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ParticipantService } from '../services/participantService';
import { TournamentService } from '../services/tournamentService';
import type { Tournament } from '../types/tournament';
import { Activity, Trophy, UserPlus, CheckCircle2 } from 'lucide-react';

export const RegistrationPage: React.FC = () => {
    const { tournamentId } = useParams<{ tournamentId: string }>();
    const [searchParams] = useSearchParams();
    const tid = tournamentId || searchParams.get('tid');

    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (tid) {
            TournamentService.getAll().then(ts => {
                const found = ts.find(t => t.id === tid);
                if (found) setTournament(found);
            });
        }
    }, [tid]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tid) return;

        setLoading(true);
        try {
            await ParticipantService.register(tid, name, email);
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            alert("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6 bg-gradient-to-br from-[#0f172a] to-[#1e1b4b]">
                <div className="sport-card p-10 max-w-md w-full text-center space-y-6">
                    <div className="bg-primary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="text-primary" size={48} />
                    </div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Entry Locked In!</h2>
                    <p className="text-accent-muted font-bold">Your registration for <span className="text-primary">{tournament?.name}</span> has been received. The pulse is waiting for you.</p>
                </div>
            </div>
        );
    }

    if (!tid) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <p className="text-white font-black uppercase tracking-widest">Invalid Tournament Link</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 bg-gradient-to-br from-[#0f172a] to-[#1e1b4b]">
            <div className="sport-card p-10 max-w-xl w-full space-y-8">
                <div className="space-y-2 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-primary p-3 text-background rounded-sport shadow-lg">
                            <Activity size={32} strokeWidth={3} />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black italic tracking-tighter leading-none text-white uppercase">Pickle-Pulse</h1>
                    <p className="text-primary font-bold uppercase tracking-[0.3em] text-xs">Official Registration Portal</p>
                </div>

                <div className="bg-secondary/50 border border-primary/20 p-6 rounded-sport space-y-2">
                    <p className="text-xs font-bold text-accent-muted uppercase tracking-widest">Event Registry</p>
                    <h2 className="text-2xl font-black italic uppercase text-white">{tournament?.name || 'Loading Event...'}</h2>
                    <div className="flex items-center gap-2 text-primary">
                        <Trophy size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{tournament?.format.replace('_', ' ')} format</span>
                    </div>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-accent-muted ml-1">Player / Team Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="NAME AS IT SHOULD APPEAR ON BRACKET"
                            className="w-full bg-background border-2 border-border rounded-sport px-4 py-4 focus:outline-none focus:border-primary font-black uppercase tracking-widest text-white placeholder:text-accent-muted/30"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-accent-muted ml-1">Email Address (Optional)</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="FOR UPDATES & ASSIGNMENTS"
                            className="w-full bg-background border-2 border-border rounded-sport px-4 py-4 focus:outline-none focus:border-primary font-black uppercase tracking-widest text-white placeholder:text-accent-muted/30"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !tournament}
                        className="w-full sport-button py-5 text-xl flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <Activity className="animate-spin" size={24} />
                        ) : (
                            <>
                                <UserPlus size={24} />
                                CONFIRM REGISTRATION
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-[8px] text-accent-muted uppercase font-bold tracking-[0.2em] pt-4">
                    By registering, you agree to the tournament pulse terms. Fast play. No delays.
                </p>
            </div>
        </div>
    );
};
