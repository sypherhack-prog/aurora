import type { NextConfig } from 'next';

const siteOrigin =
  process.env.SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  'https://aurora-omega.vercel.app';

// CSP add-in : autoriser Office.js + API Aurora (URL fixe prod pour fiabilité)
const ADDIN_CSP = [
  'default-src \'self\' https://appsforoffice.microsoft.com https://aurora-omega.vercel.app',
  'script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' https://appsforoffice.microsoft.com https://ajax.aspnetcdn.com',
  'style-src \'self\' \'unsafe-inline\'',
  'img-src \'self\' data: blob: https:',
  'font-src \'self\' data:',
  `connect-src 'self' ${siteOrigin} https://aurora-omega.vercel.app https://*.office.com https://*.office365.com https://*.office.net https://*.officeapps.live.com https://*.sharepoint.com https://*.cdn.office.net https://eu-mobile.events.data.microsoft.com https://common.online.office.com https://api.groq.com`,
  // frame-ancestors : https: = toute origine HTTPS (Word Desktop, WebView, tous domaines Office)
  // Necessaire car Word peut utiliser des domaines non documentes (officeppe.net, etc.)
  `frame-ancestors 'self' https: ${siteOrigin} https://aurora-omega.vercel.app https://*.vercel.app https://office.com https://*.office.com https://office365.com https://*.office365.com https://*.office.net https://*.officeapps.live.com https://*.officeapps.live.com:443 https://outlook.office.com https://*.outlook.office.com https://outlook.office365.com https://*.outlook.office365.com https://outlook.live.com https://*.live.com https://*.msocdn.com https://*.sharepoint.com https://*.sharepointonline.com https://*.officeservices.live.com https://*.microsoft.com https://*.microsoftonline.com https://*.msauth.net`,
  'base-uri \'self\'',
  'form-action \'self\'',
].join('; ');

const DEFAULT_CSP = [
  'default-src \'self\'',
  'script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'',
  'style-src \'self\' \'unsafe-inline\'',
  'img-src \'self\' data: blob:',
  'font-src \'self\' data:',
  'connect-src \'self\' https://generativelanguage.googleapis.com https://api.groq.com',
  'frame-ancestors \'none\'',
  'base-uri \'self\'',
  'form-action \'self\'',
].join('; ');

const addinHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'Content-Security-Policy', value: ADDIN_CSP },
];

const defaultHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Pas de X-Frame-Options : on utilise frame-ancestors dans CSP (X-Frame-Options bloquait l'add-in Word)
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=(), browsing-topics=()' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Content-Security-Policy', value: DEFAULT_CSP },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      // Exception pour la racine : Word peut charger la racine pour le SupportUrl
      // On autorise le framing depuis Office pour éviter les erreurs CSP
      // DOIT être en PREMIER pour être prioritaire sur /:path*
      { 
        source: '/',
        headers: [
          ...defaultHeaders.filter(h => h.key !== 'Content-Security-Policy'),
          { key: 'Content-Security-Policy', value: ADDIN_CSP },
        ],
      },
      // Add-in routes : frame-ancestors permissif pour Office
      // Ces routes doivent être accessibles depuis les iframes Office
      { 
        source: '/addin/:path*', 
        headers: addinHeaders,
      },
      { 
        source: '/addin', 
        headers: addinHeaders,
      },
      // Routes publiques qui peuvent être chargées par Office (manifest, assets, etc.)
      // On applique aussi les headers add-in pour éviter les problèmes CSP
      { 
        source: '/addin/manifest.xml', 
        headers: addinHeaders,
      },
      { 
        source: '/addin/manifest-prod.xml', 
        headers: addinHeaders,
      },
      // Default : pour toutes les autres routes (doit être en DERNIER)
      { 
        source: '/:path*', 
        headers: defaultHeaders,
      },
    ];
  },
};

export default nextConfig;
