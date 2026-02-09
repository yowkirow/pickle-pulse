import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CourtService } from '../services/courtService';
import type { Court } from '../services/courtService';
import { Activity, Plus, Trash2, ChevronLeft, MapPin } from 'lucide-react';

export const CourtManager: React.FC = () => {
    const [searchParams] = useSearchParams();
    const tournamentId = searchParams.get('tid');
    const [courts, setCourts] = useState<Court[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCourts = async () => {
        if (!tournamentId) return;
        try {
            const data = await CourtService.getCourts(tournamentId);
            setCourts(data);
        } catch (err) {
            console.error('Error fetching courts:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourts();
    }, [tournamentId]);

    const handleAddCourt = async () => {
        if (!tournamentId) return;
        const nextNumber = courts.length > 0 ? Math.max(...courts.map(c => c.court_number)) + 1 : 1;
        try {
            await CourtService.addCourt(tournamentId, nextNumber);
            fetchCourts();
        } catch (err) {
            alert('Error adding court');
        }
    };

    const handleDeleteCourt = async (courtId: string) => {
        if (!confirm('Are you sure you want to remove this court?')) return;
        try {
            await CourtService.deleteCourt(courtId);
            fetchCourts();
        } catch (err) {
            alert('Error deleting court');
        }
    };

    if (!tournamentId) return <div>Tournament ID required</div>;

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-border pb-6 gap-6">
                <div>
                    <Link to={`/admin?tid=${tournamentId}`} className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest mb-4 hover:underline">
                        <ChevronLeft size={14} />
                        Back to Pulse
                    </Link>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-primary text-background px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter rounded-sm">INFRASTRUCTURE</span>
                        <div className="h-1 flex-1 bg-border rounded-full min-w-[100px]" />
                    </div>
                    <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
                        Venue Layout
                    </h2>
                </div>
                <button
                    onClick={handleAddCourt}
                    className="sport-button flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Physical Court
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center sport-card opacity-50">
                        <Activity className="animate-spin mx-auto mb-4" size={40} />
                        <p className="font-black uppercase tracking-widest text-xs">Syncing court layout...</p>
                    </div>
                ) : courts.length > 0 ? (
                    courts.map((court) => (
                        <div key={court.id} className="sport-card p-6 flex flex-col justify-between group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-secondary rounded-sport flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-colors">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-accent-muted">Official Slot</p>
                                        <h4 className="font-black text-2xl italic uppercase tracking-tighter leading-none">
                                            Court {court.court_number}
                                        </h4>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteCourt(court.id)}
                                    className="text-accent-muted hover:text-red-500 transition-colors p-2"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between border-t border-border pt-4">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${court.status === 'available' ? 'bg-primary animate-pulse' : 'bg-red-500'}`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-accent-muted">
                                        {court.status === 'available' ? 'Ready for Play' : 'Occupied'}
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold text-accent-muted/40 uppercase">
                                    ID: {court.id.substring(0, 8)}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center sport-card bg-white/5 border-dashed border-2 opacity-50">
                        <p className="font-black uppercase tracking-widest text-xs">No physical courts assigned yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};
