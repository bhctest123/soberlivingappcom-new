import type { CollectionEntry } from 'astro:content';

interface BlogCardProps {
  post: CollectionEntry<'blog'>;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const { data, slug } = post;
  
  // Generate the correct URL structure: /sober-living-app-blog/YYYY/M/D/slug
  const postDate = new Date(data.date);
  const year = postDate.getFullYear();
  const month = postDate.getMonth() + 1; // No padding, just the number
  const day = postDate.getDate(); // No padding, just the number
  const postUrl = `/sober-living-app-blog/${year}/${month}/${day}/${slug}`;
  
  // Format date for display
  const formattedDate = data.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate reading time if not provided
  const readingTime = data.readingTime || Math.ceil(post.body.split(/\s+/).length / 200);

  return (
    <article className={`group ${featured ? 'col-span-2 row-span-2' : ''}`}>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        {/* Featured Image */}
        {data.image && (
          <div className={`relative overflow-hidden ${featured ? 'h-64' : 'h-48'}`}>
            <img
              src={data.image}
              alt={data.imageAlt || data.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {data.featured && (
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Featured
                </span>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-3">
            {data.category.slice(0, 2).map((cat: string) => (
              <span 
                key={cat}
                className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className={`font-semibold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 ${
            featured ? 'text-xl' : 'text-lg'
          }`}>
            <a href={postUrl} className="stretched-link">
              {data.title}
            </a>
          </h3>

          {/* Description */}
          <p className={`text-muted-foreground mb-4 flex-1 ${
            featured ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'
          }`}>
            {data.description}
          </p>

          {/* Meta information */}
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{data.author}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <time dateTime={data.date.toISOString()}>{formattedDate}</time>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{readingTime} min</span>
            </div>
          </div>

          {/* Tags */}
          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {data.tags.slice(0, 3).map((tag: string) => (
                <span 
                  key={tag}
                  className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
                >
                  #{tag}
                </span>
              ))}
              {data.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{data.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}