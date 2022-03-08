export interface FileContent {
  slug: string;
  frontmatter: Frontmatter;
  content: string;
}

export interface Frontmatter {
  title: string;
  date: string;
  excerpt: string;
  cover_image: string;
}
