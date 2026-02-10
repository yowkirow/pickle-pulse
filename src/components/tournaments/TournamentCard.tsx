import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, ChevronRight, UserPlus, ClipboardList, Users } from 'lucide-react';
import type { Tournament } from '../../types/tournament';
import { useParticipants } from '../../hooks/useParticipants';

interface TournamentCardProps {
    tournament: Tournament;
    onSeed: (tournamentId: string, participantNames?: string[]) => void;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, onSeed }) => {
    const { participants, loading } = useParticipants(tournament.id);

    const registrationUrl = `${window.location.origin}/register/${tournament.id}`;

    const handleCopyLink = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(registrationUrl);
        alert("Registration link copied to clipboard!");
    };

    return (
        <Link
            to={`/admin?tid=${tournament.id}`}
            className="sport-card p-6 flex flex-col sm:flex-row items-center justify-between group hover:border-primary/50 transition-all cursor-pointer bg-white/5 gap-6"
        >
            <div className="flex items-center gap-6 w-full sm:w-auto">
                <div className="w-16 h-16 bg-secondary rounded-sport flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-colors shrink-0">
                    <Trophy size={32} />
                </div>
                <div className="space-y-1 overflow-hidden">
                    <h4 className="font-black text-2xl italic uppercase tracking-tighter leading-none group-hover:text-primary transition-colors truncate">
                        {tournament.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-accent-muted uppercase tracking-widest">
                        <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(tournament.created_at).toLocaleDateString()}
                        </span>
                        <span className="bg-border px-2 py-0.5 rounded-sm text-white">
                            {tournament.format.replace('_', ' ')}
                        </span>
                        <span className="text-primary font-black">
                            {tournament.status}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 w-full sm:w-auto justify-end">
                {tournament.status === 'planning' && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopyLink}
                            className="p-2 bg-secondary text-primary rounded-sport hover:bg-primary hover:text-background transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter"
                            title="Copy Registration Link"
                        >
                            <UserPlus size={14} />
                            Invite
                        </button>
                        <div className="h-8 w-[1px] bg-border mx-2 hidden sm:block" />
                    </div>
                )}

                <div className="text-right">
                    <div className="flex items-center justify-end gap-2 mb-1">
                        <ClipboardList size={12} className="text-accent-muted" />
                        <p className="text-[10px] font-bold text-accent-muted uppercase tracking-widest">
                            {loading ? '...' : participants.length} Registered
                        </p>
                    </div>
                    {tournament.status === 'planning' ? (
                        <div className="flex items-center gap-3">
                            <Link
                                to={`/admin/players?tid=${tournament.id}`}
                                className="font-black text-xs uppercase text-primary hover:underline italic flex items-center gap-2"
                            >
                                <Users size={14} />
                                Manage Players & Seed »
                            </Link>
                        </div>
                    ) : (
                        <p className="font-black text-xs uppercase text-primary">Live Dashboard »</p>
                    )}
                </div>
                <ChevronRight className="text-accent-muted group-hover:text-primary transition-colors hidden sm:block" size={24} />
            </div>
        </Link>
    );
};
