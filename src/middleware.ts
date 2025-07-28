import { defineMiddleware } from 'astro:middleware';
// import { findRedirect, applyRedirect } from './data/redirects';

export const onRequest = defineMiddleware(async (_context, next) => {
  // const { pathname } = context.url;
  
  // Temporarily disable redirects to fix infinite reload issue
  // TODO: Re-enable after fixing redirect loop
  /*
  // Check if this path needs a redirect
  const redirect = findRedirect(pathname);
  
  if (redirect) {
    const newUrl = applyRedirect(pathname, redirect);
    
    // Prevent redirect loops
    if (newUrl === pathname) {
      console.warn(`Redirect loop detected for ${pathname} -> ${newUrl}`);
      return next();
    }
    
    const statusCode = redirect.permanent ? 301 : 302;
    
    // Return redirect response
    return new Response(null, {
      status: statusCode,
      headers: {
        'Location': newUrl,
        'Cache-Control': redirect.permanent ? 'public, max-age=31536000' : 'no-cache'
      }
    });
  }
  */
  
  // Continue with normal request handling
  return next();
});