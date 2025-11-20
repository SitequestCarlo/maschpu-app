# Qwik City App ⚡️

- [Qwik Docs](https://qwik.dev/)
- [Discord](https://qwik.dev/chat)
- [Qwik GitHub](https://github.com/QwikDev/qwik)
- [@QwikDev](https://twitter.com/QwikDev)
- [Vite](https://vitejs.dev/)

---

## PWA Features

This application is a fully-featured Progressive Web App (PWA) with:

### 🚀 Full Offline Support
- Works completely offline after the first visit
- Intelligent caching strategies for optimal performance
- Automatic background updates when online

### 📱 Service Worker Features
- **Cache-First Strategy** for static assets (JS, CSS, images)
- **Network-First Strategy** for dynamic content
- **Stale-While-Revalidate** for optimal user experience
- Automatic cleanup of old cache versions

### 🔄 Automatic Updates
- Detects new versions automatically
- User-friendly update notification banner
- One-click update without losing offline data
- Seamless update process

### 📊 Cache Management
- `/cache-map.json` endpoint lists all cacheable resources
- Includes all routes, static files, and assets
- Dynamic scanning of dist folder in production
- Efficient batch caching to prevent browser overload

### 💾 What Gets Cached
- All HTML pages and routes
- JavaScript bundles and CSS files
- Images, fonts, and other static assets
- Q-data JSON files for prefetching
- Manifest and PWA configuration

To increment the service worker version and force an update, edit `CACHE_VERSION` in `src/entry.sw.tsx`.

---

## Project Structure

This project is using Qwik with [QwikCity](https://qwik.dev/qwikcity/overview/). QwikCity is just an extra set of tools on top of Qwik to make it easier to build a full site, including directory-based routing, layouts, and more.

Inside your project, you'll see the following directory structure:

```
├── public/
│   └── ...
└── src/
    ├── components/
    │   └── ...
    └── routes/
        └── ...
```

- `src/routes`: Provides the directory-based routing, which can include a hierarchy of `layout.tsx` layout files, and an `index.tsx` file as the page. Additionally, `index.ts` files are endpoints. Please see the [routing docs](https://qwik.dev/qwikcity/routing/overview/) for more info.

- `src/components`: Recommended directory for components.

- `public`: Any static assets, like images, can be placed in the public directory. Please see the [Vite public directory](https://vitejs.dev/guide/assets.html#the-public-directory) for more info.

## Add Integrations and deployment

Use the `npm run qwik add` command to add additional integrations. Some examples of integrations includes: Cloudflare, Netlify or Express Server, and the [Static Site Generator (SSG)](https://qwik.dev/qwikcity/guides/static-site-generation/).

```shell
npm run qwik add # or `yarn qwik add`
```

## Development

Development mode uses [Vite's development server](https://vitejs.dev/). The `dev` command will server-side render (SSR) the output during development.

```shell
npm start # or `yarn start`
```

> Note: during dev mode, Vite may request a significant number of `.js` files. This does not represent a Qwik production build.

## Preview

The preview command will create a production build of the client modules, a production build of `src/entry.preview.tsx`, and run a local server. The preview server is only for convenience to preview a production build locally and should not be used as a production server.

```shell
npm run preview # or `yarn preview`
```

## Production

The production build will generate client and server modules by running both client and server build commands. The build command will use Typescript to run a type check on the source code.

```shell
npm run build # or `yarn build`
```

## Fastify Server

This app has a minimal [Fastify server](https://fastify.dev/) implementation. After running a full build, you can preview the build using the command:

```
npm run serve
```

Then visit [http://localhost:3000/](http://localhost:3000/)
