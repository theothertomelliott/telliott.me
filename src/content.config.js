// Import the glob loader
import { glob } from "astro/loaders";
// Import utilities from `astro:content`
import { defineCollection } from "astro:content";
// Import Zod
import { z } from "astro/zod";
// Define a `loader` and `schema` for each collection
const blog = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: "./src/blog" }),
    schema: z.object({
      title: z.string(),
      slug: z.string(),
      pubDate: z.date(),
      description: z.string(),
      author: z.string().optional(),
      image: z.object({
        url: z.string(),
        alt: z.string(),
        caption: z.string().optional()
      }).optional(),
    })
});

const podcasts = defineCollection({
    loader: glob({ pattern: '**/*.yaml', base: "./src/podcasts" }),
    schema: z.object({
      title: z.string(),
      date: z.string(),
      description: z.string(),
      video_url: z.string(),
    })
});

const talks = defineCollection({
    loader: glob({ pattern: '**/*.yaml', base: "./src/talks" }),
    schema: z.object({
      title: z.string(),
      event: z.string(),
      date: z.string(),
      description: z.string(),
      slides_url: z.string(),
      video_url: z.string().optional(),
    })
});

// Export a single `collections` object to register your collection(s)
export const collections = { blog, podcasts, talks };