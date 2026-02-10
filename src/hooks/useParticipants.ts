import { useState, useEffect } from 'react';
import { ParticipantService } from '../services/participantService';
import type { Participant } from '../services/participantService';

export const useParticipants = (tournamentId?: string) => {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchParticipants = async () => {
        if (!tournamentId) return;
        setLoading(true);
        try {
            const data = await ParticipantService.getByTournament(tournamentId);
            setParticipants(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParticipants();
    }, [tournamentId]);

    return { participants, loading, refresh: fetchParticipants };
};
