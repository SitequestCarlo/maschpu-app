import { type RequestHandler } from "@builder.io/qwik-city";
import fs from 'node:fs';
import path from 'node:path';
import { routes } from '@qwik-city-plan';

export const onGet: RequestHandler = async ({ json }) => {
  // In development, return empty array for simplicity
  if (process.env.NODE_ENV === 'development') {
    json(200, []);
    return;
  }

  const paths: string[] = [];
  
  // Add route paths from qwik-city-plan (these will be generated as static files)
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
  
  // In production, also scan the /dist folder for existing files
  const distDir = path.join(process.cwd(), 'dist');
  
  function getAllDistFiles(dir: string, baseDir: string = distDir): string[] {
    const files: string[] = [];
    
    try {
      if (fs.existsSync(dir)) {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            // Recursively get files from subdirectories
            files.push(...getAllDistFiles(fullPath, baseDir));
          } else {
            // Convert absolute path to relative path starting with /
            const relativePath = '/' + path.relative(baseDir, fullPath).replace(/\\/g, '/');
            files.push(relativePath);
          }
        }
      }
    } catch (error) {
      console.error('Error reading dist directory:', error);
    }
    
    return files;
  }
  
  // Get all files from the dist directory (if it exists)
  const allFiles = getAllDistFiles(distDir);
  paths.push(...allFiles);
  
  // Remove duplicates and sort
  const uniquePaths = [...new Set(paths)].sort();
  
  json(200, uniquePaths);
};