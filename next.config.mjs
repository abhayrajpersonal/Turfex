
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'picsum.photos',
      'images.unsplash.com',
      'randomuser.me',
      'ui-avatars.com',
      'cdn-icons-png.flaticon.com',
      'api.dicebear.com'
    ],
  },
  env: {
    // Expose keys to client-side for the prototype
    // In production, these should be handled more securely
    NEXT_PUBLIC_SUPABASE_URL: process.env.SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  }
};

export default nextConfig;
