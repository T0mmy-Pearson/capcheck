 export default function fixImgUrl(url: string | null | undefined) {
    if (!url) return undefined;

    const match = url.match(/(\d{4})(\d{2})([A-Za-z0-9\-\.]+)$/);
    if (!match) return url;

    const year = match[1];
    const month = match[2];
    const filename = match[3];

    return `https://www.wildfooduk.com/wp-content/uploads/${year}/${month}/${filename}`;
  }