import { ReactNode } from 'react';
import AppHeader from './AppHeader';
import { getExternalWebsiteConfig } from '../config/externalWebsite';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const externalWebsite = getExternalWebsiteConfig();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
      <footer className="border-t border-border py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <p>
              © {new Date().getFullYear()} Earn. Built with love using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'earn-app'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline"
              >
                caffeine.ai
              </a>
            </p>
            {externalWebsite && (
              <>
                <span className="hidden sm:inline">•</span>
                <a
                  href={externalWebsite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:underline"
                >
                  {externalWebsite.label}
                </a>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
