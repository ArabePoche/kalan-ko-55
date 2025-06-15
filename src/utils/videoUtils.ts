
export const getEmbedUrl = (url: string): string => {
  if (!url) return '';

  let videoId: string | null = null;
  
  // Regex pour extraire l'ID de différentes formes d'URL YouTube
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/;
  const match = url.match(youtubeRegex);

  if (match && match[1]) {
    videoId = match[1];
  }

  if (videoId) {
    const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`);
    // Paramètres essentiels pour que l'API JavaScript puisse contrôler la vidéo
    embedUrl.searchParams.set('enablejsapi', '1');
    embedUrl.searchParams.set('autoplay', '0'); // L'autoplay est géré par la logique de l'app
    embedUrl.searchParams.set('controls', '0'); // Masque les contrôles YouTube
    embedUrl.searchParams.set('showinfo', '0');
    embedUrl.searchParams.set('rel', '0'); // Ne pas montrer de vidéos similaires à la fin
    embedUrl.searchParams.set('modestbranding', '1');
    // Le paramètre 'origin' est crucial pour la sécurité et le fonctionnement de l'API
    embedUrl.searchParams.set('origin', window.location.origin);
    
    return embedUrl.toString();
  }

  // Si l'URL n'est pas reconnue comme un lien YouTube, on la retourne telle quelle
  console.warn("Impossible d'analyser l'URL YouTube, retour de l'URL originale:", url);
  return url;
};
