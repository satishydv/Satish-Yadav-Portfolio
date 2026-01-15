import type { Metadata } from 'next';
import './globals.css';
import { Theme } from '@radix-ui/themes';
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';
import { DarkmodeProvider } from '@/store/DarkmodeProvider';
import '@radix-ui/themes/styles.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://satishydv.dev'),
  title: 'Satish Yadav | Fullstack Engineer',
  icons: {
    icon: '/company/favicon.ico',
  },
  description: 'A Fullstack Engineer who enjoys writing Typescript and Go',
  keywords: [
    'Satish Yadav',
    'Satish Tech',
    'Satish Dev',
    'Satish Technology',
    'Satish Developer',
    'Satish Fullstack Engineer',
    'Software Engineer',
    'Software Developer',
    'Fullstack Engineer',
    'Fullstack Developer',
    'Portfolio Website',
    'Javascript',
    'Typescript',
    'React js',
    'Node js',
    'Next js',
  ],
  authors: {
    url: 'https://github.com/satishydv',
    name: 'Satish Yadav',
  },
  publisher: 'Satish Yadav',

  openGraph: {
    title: 'Satish Yadav Portfolio',
    description: 'Portfolio of Satish Yadav, a Fullstack Engineer',
    url: 'https://satish-yadav-portfolio.vercel.app/',
    siteName: 'Satish Yadav',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    site: '@satish_yadav',
    creator: '@satish_yadav',
    title: 'Satish Yadav',
    description: 'Portfolio of Satish Yadav',
    images: {
      url: '/og-image.png',
      type: 'image/png',
    },
  },

  appLinks: {
    web: {
      url: new URL('https://satish-yadav-portfolio.vercel.app/'),
    },
  },

  category: 'Portfolio Website',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (_) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-neutral-50 dark:bg-neutral-950">
        <DarkmodeProvider>
          <Theme>
            <Navbar />
            {children}
            <Toaster />
          </Theme>
        </DarkmodeProvider>
      </body>
    </html>
  );
}
