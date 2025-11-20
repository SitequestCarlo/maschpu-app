import { type RequestHandler } from "@builder.io/qwik-city";
import fs from 'node:fs';
import path from 'node:path';
import { routes } from '@qwik-city-plan';

function getAllDistFiles(dir: string, baseDir: string): string[] {
  const files: string[] = [];
  
  try {
    if (fs.existsSync(dir)) {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        
        if (item.isDirectory()) {
          // Recursively get files from subdirectories
          files.push(...getAllDistFiles(fullPath, baseDir));
        } else if (item.isFile()) {
          // Convert absolute path to relative path starting with /
          const relativePath = '/' + path.relative(baseDir, fullPath).replace(/\\/g, '/');
          
          // Only include files that are cacheable
          // Exclude service worker, map files, and other meta files
          if (!relativePath.includes('sw.js') && 
              !relativePath.endsWith('.map') &&
              !relativePath.includes('cache-map.json')) {
            files.push(relativePath);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error reading dist directory:', error);
  }
  
  return files;
}

export const onGet: RequestHandler = async ({ json, headers }) => {
  try {
    const paths: string[] = [];
    
    // Add route paths from qwik-city-plan (these will be generated as static files)
    try {
      const routePaths = routes.map((route: any) => route[2]); // Third element contains the path
      
      // Add route paths with index.html and q-data.json
      for (const routePath of routePaths) {
        // Add the route path itself (for index.html)
        paths.push(routePath);
        
        // Add q-data.json for each route
        const qDataPath = routePath.endsWith('/') 
          ? `${routePath}q-data.json`
          : `${routePath}/q-data.json`;
        paths.push(qDataPath);
      }
    } catch (err) {
      console.error('Error processing routes:', err);
    }
  
    // In production, also scan the /dist folder for existing files
    const distDir = path.join(process.cwd(), 'dist');
    
    // Get all files from the dist directory (if it exists)
    try {
      const allFiles = getAllDistFiles(distDir, distDir);
      console.log(`[cache-map] Found ${allFiles.length} files in dist directory`);
      console.log(`[cache-map] Sample files:`, allFiles.filter(f => f.includes('/build/')).slice(0, 10));
      paths.push(...allFiles);
    } catch (err) {
      console.error('Error scanning dist directory:', err);
    }
    
    // Add common static assets from public folder
    const publicAssets = [
      '/manifest.json',
      '/robots.txt',
      '/favicon.svg',
      '/maskable-icon.png',
      '/apple-touch-icon-180x180.png',
    ];
    paths.push(...publicAssets);
    
    // Remove duplicates, filter out invalid paths, and sort
    const uniquePaths = [...new Set(paths)]
      .filter(p => {
        // Skip empty or invalid paths
        if (!p || !p.startsWith('/')) return false;
        // Skip service worker files
        if (p.includes('sw.js') || p.includes('service-worker')) return false;
        // Skip map files
        if (p.endsWith('.map')) return false;
        // Skip cache-map itself
        if (p.includes('cache-map.json')) return false;
        return true;
      })
      .sort();
    
    // Set cache headers to prevent stale data
    headers.set('Cache-Control', 'no-cache, must-revalidate');
    headers.set('Content-Type', 'application/json');
    
    console.log(`[cache-map] Returning ${uniquePaths.length} total paths`);
    console.log(`[cache-map] Build files:`, uniquePaths.filter(p => p.includes('/build/')).length);
    
    json(200, uniquePaths);
  } catch (err) {
    console.error('Error generating cache map:', err);
    // Return empty array on error rather than failing
    json(200, []);
  }
};