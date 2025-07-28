import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    author: z.string().default('Sober Living App Team'),
    category: z.array(z.string()),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    // SEO metadata fields
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
      ogImage: z.string().optional(),
      ogImageAlt: z.string().optional(),
      twitterCard: z.enum(['summary', 'summary_large_image', 'app', 'player']).default('summary_large_image'),
      canonicalUrl: z.string().optional(),
      noindex: z.boolean().default(false),
    }).optional(),
    // Reading time estimation
    readingTime: z.number().optional(),
    // Related posts
    relatedPosts: z.array(z.string()).optional(),
  }),
});

const features = defineCollection({
  type: 'content',
  schema: z.object({
    // Basic feature information
    name: z.string(),
    description: z.string(),
    iconPath: z.string(),
    altText: z.string(),
    
    // Content sections
    heroTitle: z.string().optional(),
    heroDescription: z.string().optional(),
    keyBenefits: z.array(z.string()).optional(),
    features: z.array(z.object({
      title: z.string(),
      description: z.string(),
      icon: z.string().optional(),
    })).optional(),
    additionalSections: z.array(z.object({
      title: z.string(),
      content: z.string(),
    })).optional(),
    
    // SEO metadata fields
    seo: z.object({
      title: z.string(),
      description: z.string(),
      keywords: z.array(z.string()).optional(),
      ogImage: z.string().optional(),
      ogImageAlt: z.string().optional(),
      twitterCard: z.enum(['summary', 'summary_large_image', 'app', 'player']).default('summary_large_image'),
      canonicalUrl: z.string().optional(),
      noindex: z.boolean().default(false),
    }),
    
    // Meta information
    published: z.boolean().default(true),
    featured: z.boolean().default(false),
    order: z.number().optional(),
  }),
});

export const collections = { blog, features };