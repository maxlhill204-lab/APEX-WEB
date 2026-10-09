export type Design = {
  id: string; slug: string; tier: string; title: string; summary: string;
  audience: string; palette: string[]; typography: string; signature: string;
  chapters: string[]; demoUrl: string | null; previewImage: string | null;
};
export type DesignTier = { slug: string; number: number; name: string; price: number; description: string; scope: string; };
