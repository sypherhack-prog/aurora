import type { NextConfig } from 'next';

const ADDIN_CSP = [
  'default-src \'self\'',
  'script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'',
  'style-src \'self\' \'unsafe-inline\'',
  'img-src \'self\' data: blob:',
  'font-src \'self\' data:',
  'connect-src \'self\' https://aurora-omega.vercel.app https://*.office.com https://*.office365.com https://api.groq.com',
  'frame-ancestors https://*.office.com https://*.office365.com https://*.office.net https://*.outlook.office.com https://*.outlook.office365.com',
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
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=(), browsing-topics=()' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Content-Security-Policy', value: DEFAULT_CSP },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: '/addin/:path*', headers: addinHeaders },
      { source: '/:path*', headers: defaultHeaders },
    ];
  },
};

export default nextConfig;
