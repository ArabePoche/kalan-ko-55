
import { ALLOWED_IMAGE_TYPES, ALLOWED_EXTENSIONS, MAX_FILE_SIZE } from '@/constants/avatarConstants';

export const validateImageFile = (file: File): string | null => {
  // Vérifier le type MIME
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `Format non autorisé. Formats acceptés : ${ALLOWED_EXTENSIONS.join(', ').toUpperCase()}`;
  }

  // Vérifier l'extension du fichier
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!fileExtension || !ALLOWED_EXTENSIONS.includes(fileExtension)) {
    return `Extension de fichier non autorisée. Extensions acceptées : ${ALLOWED_EXTENSIONS.join(', ').toUpperCase()}`;
  }

  // Vérifier la taille (max 5MB)
  if (file.size > MAX_FILE_SIZE) {
    return 'La taille du fichier ne doit pas dépasser 5MB.';
  }

  return null; // Pas d'erreur
};
