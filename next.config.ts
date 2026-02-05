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
  "frame-ancestors 'self' https://*.office.com https://*.office365.com https://*.office.net https://*.officeapps.live.com https://*.officeapps.live.com:443 https://*.outlook.office.com https://*.outlook.office365.com https://*.msocdn.com https://*.sharepoint.com https://*.officeservices.live.com",
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
      // Default : exclure /addin pour éviter frame-ancestors 'none' sur l'add-in
      { source: '/((?!addin).*)', headers: defaultHeaders },
      // Add-in : frame-ancestors permissif pour Office (iframe)
      { source: '/addin/:path*', headers: addinHeaders },
      { source: '/addin', headers: addinHeaders },
    ];
  },
};

export default nextConfig;
