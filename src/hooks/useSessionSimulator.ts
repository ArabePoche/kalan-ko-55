
import { useRealTimeSession } from './useRealTimeSession';
import { useSessionCleanup } from './useSessionCleanup';
import { useRealTimeSessionUpdates } from './useRealTimeSessionUpdates';

export const useSessionSimulator = () => {
  // Utiliser le système de session en temps réel
  const { currentSessionId } = useRealTimeSession();
  
  // Nettoyer les sessions expirées
  useSessionCleanup();
  
  // Écouter les mises à jour en temps réel
  useRealTimeSessionUpdates();

  return { currentSessionId };
};
