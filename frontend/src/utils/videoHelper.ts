export const getEmbedUrl = (url: string): string => {
  if (!url) return '';

  const embedBase = ['https://', 'www.youtube.com', '/embed/'].join('');

  if (url.includes('watch?v=')) {
    const afterV = url.split('watch?v=').pop() || '';
    const videoId = afterV.split('&').shift() || '';
    return embedBase + videoId;
  }

  if (url.includes('youtu.be/')) {
    const afterSlash = url.split('youtu.be/').pop() || '';
    const videoId = afterSlash.split('?').shift() || '';
    return embedBase + videoId;
  }

  return url;
};
