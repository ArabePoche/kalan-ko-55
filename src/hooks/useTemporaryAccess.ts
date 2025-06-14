
import { useState, useEffect } from 'react';

interface TemporaryAccess {
  formationId: string;
  startTime: number;
  duration: number; // en minutes
  isExpired: boolean;
}

export const useTemporaryAccess = () => {
  const [temporaryAccesses, setTemporaryAccesses] = useState<TemporaryAccess[]>([]);

  // Charger les accès depuis localStorage au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('temporaryAccesses');
    if (saved) {
      const accesses = JSON.parse(saved);
      // Nettoyer les accès expirés
      const now = Date.now();
      const validAccesses = accesses.filter((access: TemporaryAccess) => {
        const elapsed = (now - access.startTime) / (1000 * 60); // en minutes
        return elapsed < access.duration;
      });
      setTemporaryAccesses(validAccesses);
      localStorage.setItem('temporaryAccesses', JSON.stringify(validAccesses));
    }
  }, []);

  const grantTemporaryAccess = (formationId: string, duration: number = 15) => {
    const newAccess: TemporaryAccess = {
      formationId,
      startTime: Date.now(),
      duration,
      isExpired: false
    };

    const updatedAccesses = [...temporaryAccesses.filter(a => a.formationId !== formationId), newAccess];
    setTemporaryAccesses(updatedAccesses);
    localStorage.setItem('temporaryAccesses', JSON.stringify(updatedAccesses));
  };

  const hasTemporaryAccess = (formationId: string): { hasAccess: boolean; timeLeft: number } => {
    const access = temporaryAccesses.find(a => a.formationId === formationId);
    if (!access) return { hasAccess: false, timeLeft: 0 };

    const now = Date.now();
    const elapsed = (now - access.startTime) / (1000 * 60); // en minutes
    const timeLeft = Math.max(0, access.duration - elapsed);
    
    if (timeLeft <= 0) {
      // Supprimer l'accès expiré
      const updatedAccesses = temporaryAccesses.filter(a => a.formationId !== formationId);
      setTemporaryAccesses(updatedAccesses);
      localStorage.setItem('temporaryAccesses', JSON.stringify(updatedAccesses));
      return { hasAccess: false, timeLeft: 0 };
    }

    return { hasAccess: true, timeLeft };
  };

  const getAllTemporaryAccesses = () => {
    return temporaryAccesses.map(access => ({
      ...access,
      timeLeft: Math.max(0, access.duration - (Date.now() - access.startTime) / (1000 * 60))
    }));
  };

  return {
    grantTemporaryAccess,
    hasTemporaryAccess,
    getAllTemporaryAccesses
  };
};
