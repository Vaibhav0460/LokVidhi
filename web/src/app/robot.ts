import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Keep your admin and visual editor private
    },
    sitemap: 'https://lokvidhi.vercel.app/sitemap.xml',
  }
}