import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, Activity } from 'lucide-react';

export const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            {/* Navigation Header */}
            <header className="bg-secondary border-b border-border px-6 py-4 flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="bg-primary p-2 text-background rounded-sport">
                        <Activity size={24} strokeWidth={3} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black italic tracking-tighter leading-none text-white">
                            PICKLE-PULSE
                        </h1>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Live Tournament Engine</p>
                        </div>
                    </div>
                </div>

                <nav className="hidden lg:flex items-center gap-1">
                    <NavBarItem to="/admin" icon={<LayoutDashboard size={18} />} label="Command Center" />
                    <NavBarItem to="/tournaments" icon={<Users size={18} />} label="Tournament Admin" />
                    <NavBarItem to="/referee" icon={<UserCheck size={18} />} label="Referee Portal" />
                </nav>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end">
                        <p className="text-[10px] font-bold text-accent-muted uppercase tracking-widest">Operator</p>
                        <p className="text-xs font-black">CHAMPIONSHIP HUB</p>
                    </div>
                    <button className="sport-button-outline text-xs px-4 py-1.5 hover:bg-primary hover:text-background transition-colors">
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-10">
                <div className="max-w-7xl mx-auto h-full">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-secondary border-t border-border flex justify-around items-center p-3 z-50">
                <MobileNavItem to="/admin" icon={<LayoutDashboard size={20} />} />
                <MobileNavItem to="/tournaments" icon={<Users size={20} />} />
                <MobileNavItem to="/referee" icon={<UserCheck size={20} />} />
            </nav>
        </div>
    );
};

const NavBarItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-6 py-2 transition-all duration-200 uppercase font-black text-xs tracking-widest border-b-4 ${isActive
                ? 'border-primary text-primary bg-secondary'
                : 'border-transparent text-accent-muted hover:text-white hover:bg-white/5'
            }`
        }
    >
        {icon}
        {label}
    </NavLink>
);

const MobileNavItem = ({ to, icon }: { to: string; icon: React.ReactNode }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `p-4 transition-all duration-200 ${isActive
                ? 'text-primary'
                : 'text-accent-muted hover:text-white'
            }`
        }
    >
        {icon}
    </NavLink>
);
