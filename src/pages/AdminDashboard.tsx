import React from 'react';
import { Activity, LayoutGrid, Clock } from 'lucide-react';
import { BracketView } from '../components/brackets/BracketView';
import type { Round } from '../types/tournament';
import { useBracketData } from '../hooks/useBracketData';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useLiveTicker } from '../hooks/useLiveTicker';
import { useSearchParams } from 'react-router-dom';
import { useAutopilot } from '../hooks/useAutopilot';

interface DashboardStatProps {
    label: string;
    value: string | number;
    status?: 'active';
    muted?: boolean;
}

const DashboardStat = ({ label, value, status, muted }: DashboardStatProps) => (
    <div className={`text-right ${muted ? 'opacity-30' : ''}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-muted leading-tight mb-1">
            {status === 'active' && <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mr-1 animate-pulse" />}
            {label}
        </p>
        <p className="text-4xl font-black italic tracking-tighter leading-none">{typeof value === 'number' && value < 10 && value !== 0 ? `0${value}` : value}</p>
    </div>
);

const CourtCard = ({ number, status }: { number: number; status: string }) => {
    const isOccupied = status === 'MATCH IN PROGRESS';
    return (
        <div className={`sport-card border-l-4 transition-all duration-300 ${isOccupied ? 'border-l-primary' : 'border-l-border opacity-70 hover:opacity-100'}`}>
            <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                    <span className="font-black text-4xl italic text-border leading-none">
                        {number < 10 ? `0${number}` : number}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${isOccupied ? 'bg-primary text-background' : 'bg-border text-accent-muted'}`}>
                        {status}
                    </span>
                </div>

                {isOccupied ? (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-background/50 p-2 rounded-sm mb-1">
                            <span className="font-black text-xs uppercase truncate pr-2">Lee / Wang</span>
                            <span className="font-black text-primary text-xl leading-none">11</span>
                        </div>
                        <div className="flex justify-between items-center bg-background/50 p-2 rounded-sm">
                            <span className="font-black text-xs uppercase truncate pr-2">Smith / Jones</span>
                            <span className="font-black text-white text-lg leading-none">08</span>
                        </div>
                    </div>
                ) : (
                    <div className="py-8 flex flex-col items-center justify-center border-2 border-border border-dashed rounded-sm opacity-20">
                        <Activity size={24} />
                    </div>
                )}
            </div>

            <div className="bg-background/80 py-2 px-4 flex justify-between items-center border-t border-border">
                <span className="text-[10px] font-bold text-accent-muted uppercase">Court {number} Hub</span>
                <button className="text-[10px] font-black uppercase text-primary tracking-widest hover:underline">Details »</button>
            </div>
        </div>
    );
};

// Mock data typed correctly
const MOCK_ROUNDS: Round[] = [
    {
        name: 'Quarter-Finals',
        matches: [
            { id: '1', p1_name: 'Anderson/Baker', p2_name: 'Carter/Davis', score1: 11, score2: 8, status: 'completed', winner_id: 'p1' },
            { id: '2', p1_name: 'Evans/Ford', p2_name: 'Garcia/Hill', score1: 5, score2: 11, status: 'completed', winner_id: 'p2' },
            { id: '3', p1_name: 'Irwin/Jones', p2_name: 'Kelly/Lee', score1: 11, score2: 13, status: 'completed', winner_id: 'p2' },
            { id: '4', p1_name: 'Miller/Nash', p2_name: 'Owen/Perez', score1: 11, score2: 4, status: 'completed', winner_id: 'p1' },
        ]
    },
    {
        name: 'Semi-Finals',
        matches: [
            { id: '5', p1_name: 'Anderson/Baker', p2_name: 'Garcia/Hill', status: 'in_progress', score1: 8, score2: 7 },
            { id: '6', p1_name: 'Kelly/Lee', p2_name: 'Miller/Nash', status: 'scheduled' },
        ]
    },
    {
        name: 'Finals',
        matches: [
            { id: '7', p1_name: 'TBD', p2_name: 'TBD', status: 'scheduled' },
        ]
    }
];

export const AdminDashboard: React.FC = () => {
    const [searchParams] = useSearchParams();
    const tournamentId = searchParams.get('tid') || undefined;
    const { rounds, loading } = useBracketData(tournamentId);
    const stats = useDashboardStats(tournamentId);
    const tickerMatches = useLiveTicker(tournamentId);

    // Live Heartbeat: Auto-manage match flow
    useAutopilot(tournamentId, true);

    return (
        <div className="space-y-10">
            {/* Real-time Ticker / Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-border pb-6 gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-primary text-background px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter rounded-sm">LIVE FEED</span>
                        <div className="h-1 flex-1 bg-border rounded-full min-w-[100px]" />
                    </div>
                    <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
                        Pulse Board
                    </h2>
                </div>

                <div className="flex gap-4">
                    <DashboardStat label="Matches Live" value={stats.liveMatches} status="active" />
                    <DashboardStat label="In Queue" value={stats.inQueue} />
                    <DashboardStat label="Completed" value={stats.completed} muted />
                </div>
            </div>

            {/* Bracket Visualization Engine */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                        <Activity className="text-primary" size={24} />
                        Live Championship Bracket
                    </h3>
                    <div className="text-[10px] font-bold text-accent-muted uppercase tracking-widest flex items-center gap-2">
                        {loading ? 'SYNCING PULSE...' : 'LIVE SYNC ACTIVE'}
                        <div className={`w-2 h-2 rounded-full ${loading ? 'bg-accent-muted' : 'bg-primary animate-pulse'}`} />
                    </div>
                </div>
                <BracketView rounds={rounds.length > 0 ? rounds : MOCK_ROUNDS} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Court Cards */}
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <CourtCard key={i} number={i} status={i % 3 === 0 ? 'MATCH IN PROGRESS' : 'READY'} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Real-Time Match Ticker */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                            <Clock className="text-primary" size={24} />
                            Live Match Ticker
                        </h3>
                        <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                            View Full Archive »
                        </button>
                    </div>

                    <div className="space-y-2">
                        {tickerMatches.length > 0 ? (
                            tickerMatches.map((m) => (
                                <div key={m.id} className="sport-card p-4 flex items-center justify-between group hover:border-primary/50 transition-colors">
                                    <div className="flex items-center gap-6">
                                        <div className="text-2xl font-black italic text-border w-10">
                                            #{m.id.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className={`font-black text-lg uppercase ${m.status === 'completed' ? 'text-accent-muted' : ''}`}>
                                                    {m.p1_name}
                                                </span>
                                                <span className="text-accent-muted text-xs">VS</span>
                                                <span className={`font-black text-lg uppercase ${m.status === 'completed' ? 'text-accent-muted' : ''}`}>
                                                    {m.p2_name}
                                                </span>
                                            </div>
                                            <p className="text-[10px] font-bold text-accent-muted uppercase tracking-widest">
                                                {m.round_name || 'Tournament Play'} • {m.status.replace('_', ' ')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[10px] font-bold text-accent-muted uppercase">Pulse Status</p>
                                            <p className={`font-black text-xs uppercase ${m.status === 'in_progress' ? 'text-primary' : ''}`}>
                                                {m.status}
                                            </p>
                                        </div>
                                        {m.status === 'scheduled' && (
                                            <button className="sport-button-outline text-[10px] px-3 py-1 opacity-0 group-hover:opacity-100">
                                                Assign Court
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center border-2 border-dashed border-border rounded-sport opacity-50">
                                <p className="font-black uppercase tracking-widest text-xs">No Recent Match Activity</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="sport-card p-6 bg-primary text-background border-none shadow-broadcast">
                        <h4 className="font-black uppercase tracking-tighter text-sm mb-4 text-background/60">Smart Autopilot</h4>
                        <p className="text-2xl font-black leading-tight mb-4 italic">AUTOPILOT IS ACTIVELY SCANNING FOR VACANT COURTS</p>
                        <div className="h-2 bg-background/20 rounded-full overflow-hidden mb-4">
                            <div className="h-full bg-background w-[65%] animate-[shimmer_2s_infinite]" />
                        </div>
                        <button className="w-full bg-background text-primary font-black uppercase py-2 text-[10px] tracking-widest hover:scale-[1.02] transition-transform">
                            Pause Stream
                        </button>
                    </div>

                    <div className="sport-card p-6 border-2 border-border">
                        <h4 className="font-black uppercase text-sm mb-4 flex items-center gap-2">
                            <LayoutGrid size={18} />
                            Active Divisions
                        </h4>
                        <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase">
                            <button className="bg-white/10 px-3 py-1.5 rounded-sm hover:bg-primary hover:text-background tracking-widest">Men's Open</button>
                            <button className="bg-white/10 px-3 py-1.5 rounded-sm hover:bg-primary hover:text-background tracking-widest">Women's 4.0</button>
                            <button className="border border-border px-3 py-1.5 rounded-sm text-accent-muted">Senior Mix</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
