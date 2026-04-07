import { ApiError } from '../../services/api/httpClient';

export type FriendlyApiError = {
  message: string;
  tone: 'danger' | 'warning' | 'neutral';
  retryable: boolean;
};

const NETWORK_ERROR_MESSAGE = 'Connexion indisponible. Vérifie ta connexion puis réessaie.';

export function formatFriendlyApiError(error: unknown): FriendlyApiError {
  if (error instanceof ApiError) {
    const rawMessage = error.message.trim();
    const normalized = rawMessage.toLowerCase();

    if (error.status >= 500) {
      return {
        message: 'Erreur serveur, réessayez dans un instant.',
        tone: 'danger',
        retryable: true,
      };
    }

    if (error.status === 404) {
      return {
        message: 'Service momentanément indisponible. Réessaie plus tard.',
        tone: 'warning',
        retryable: true,
      };
    }

    if (normalized.includes('timeout') || normalized.includes('connection') || normalized.includes('réseau')) {
      return {
        message: NETWORK_ERROR_MESSAGE,
        tone: 'neutral',
        retryable: true,
      };
    }

    return {
      message: rawMessage || 'Une erreur est survenue.',
      tone: 'danger',
      retryable: false,
    };
  }

  if (error instanceof Error) {
    const normalized = error.message.toLowerCase();
    if (normalized.includes('fetch') || normalized.includes('network') || normalized.includes('timeout')) {
      return {
        message: NETWORK_ERROR_MESSAGE,
        tone: 'neutral',
        retryable: true,
      };
    }
  }

  return {
    message: 'Une erreur est survenue. Réessaie.',
    tone: 'danger',
    retryable: true,
  };
}
