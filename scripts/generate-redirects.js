#!/usr/bin/env node

/**
 * Generate redirect files for various hosting platforms
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read redirects from TypeScript file
const redirectsContent = readFileSync(join(__dirname, '../src/data/redirects.ts'), 'utf-8');
const redirectsMatch = redirectsContent.match(/export const redirects[^=]*=\s*(\[[^;]+\])/s);
const redirectsData = eval(redirectsMatch[1].replace(/permanent:/g, '"permanent":').replace(/source:/g, '"source":').replace(/destination:/g, '"destination":'));

/**
 * Generate Netlify _redirects file
 */
function generateNetlifyRedirects() {
  const lines = redirectsData.map(redirect => {
    const status = redirect.permanent ? '301!' : '302!';
    // Convert :param syntax to Netlify splat syntax
    const source = redirect.source.replace(/:(\w+)/g, ':splat');
    const destination = redirect.destination.replace(/:(\w+)/g, ':splat');
    return `${source} ${destination} ${status}`;
  });
  
  const content = `# Redirects generated from src/data/redirects.ts
# Generated on ${new Date().toISOString()}

${lines.join('\n')}
`;
  
  writeFileSync(join(__dirname, '../public/_redirects'), content);
  console.log('✅ Generated public/_redirects for Netlify');
}

/**
 * Generate Vercel vercel.json redirects
 */
function generateVercelRedirects() {
  const redirects = redirectsData.map(redirect => {
    // Convert :param syntax to Vercel regex syntax
    const source = redirect.source.replace(/:(\w+)/g, '(?<$1>[^/]+)');
    const destination = redirect.destination.replace(/:(\w+)/g, '$$$1');
    
    return {
      source,
      destination,
      permanent: redirect.permanent
    };
  });
  
  const vercelConfig = {
    redirects
  };
  
  const existingConfig = (() => {
    try {
      const config = JSON.parse(readFileSync(join(__dirname, '../vercel.json'), 'utf-8'));
      return config;
    } catch {
      return {};
    }
  })();
  
  const newConfig = {
    ...existingConfig,
    redirects
  };
  
  writeFileSync(
    join(__dirname, '../vercel.json'),
    JSON.stringify(newConfig, null, 2)
  );
  console.log('✅ Generated/updated vercel.json with redirects');
}

/**
 * Generate Apache .htaccess redirects
 */
function generateHtaccessRedirects() {
  const lines = redirectsData.map(redirect => {
    const flag = redirect.permanent ? 'R=301,L' : 'R=302,L';
    // Convert :param syntax to Apache regex
    const source = redirect.source
      .replace(/\//g, '\\/')
      .replace(/:(\w+)/g, '([^/]+)');
    const destination = redirect.destination
      .replace(/:(\w+)/g, '$1');
    
    return `RewriteRule ^${source.substring(2)}$ ${destination} [${flag}]`;
  });
  
  const content = `# Redirects generated from src/data/redirects.ts
# Generated on ${new Date().toISOString()}

RewriteEngine On

# Remove trailing slashes
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.+)/$ /$1 [L,R=301]

# Custom redirects
${lines.join('\n')}
`;
  
  writeFileSync(join(__dirname, '../public/.htaccess'), content);
  console.log('✅ Generated public/.htaccess for Apache');
}

/**
 * Main execution
 */
function main() {
  const platform = process.argv[2] || 'all';
  
  console.log('🚀 Generating redirect files...\n');
  
  switch (platform) {
    case 'netlify':
      generateNetlifyRedirects();
      break;
    case 'vercel':
      generateVercelRedirects();
      break;
    case 'apache':
      generateHtaccessRedirects();
      break;
    case 'all':
    default:
      generateNetlifyRedirects();
      generateVercelRedirects();
      generateHtaccessRedirects();
      break;
  }
  
  console.log('\n✨ Done!');
}

// Run the script
main();