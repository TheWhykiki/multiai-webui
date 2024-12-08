import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Import UIWrapper with SSR disabled
const UIWrapper = dynamic(() => import('./UIWrapper'), {
  ssr: false
});

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'MultiAI WebUI' }) => {
  const router = useRouter();

  return (
    <UIWrapper>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      
      <div className="uk-scope">
        <nav className="uk-navbar-container uk-navbar-transparent" uk-navbar="true" style={{ 
          backgroundColor: '#1a1a1a',
          borderBottom: '1px solid #333'
        }}>
          <div className="uk-navbar-left">
            <ul className="uk-navbar-nav">
              <li>
                <a onClick={() => router.back()} style={{ color: '#fff', cursor: 'pointer' }}>
                  <span uk-icon="icon: arrow-left" className="uk-margin-small-right"></span>
                  Back
                </a>
              </li>
            </ul>
          </div>

          <div className="uk-navbar-center">
            <ul className="uk-navbar-nav">
              <li>
                <Link href="/">
                  <a style={{ color: '#fff', fontSize: '1.2em' }}>MultiAI WebUI</a>
                </Link>
              </li>
            </ul>
          </div>

          <div className="uk-navbar-right">
            <ul className="uk-navbar-nav">
              <li>
                <a style={{ color: '#fff' }}>
                  <span uk-icon="icon: menu"></span>
                </a>
                <div className="uk-navbar-dropdown uk-navbar-dropdown-bottom-right" style={{ 
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333'
                }}>
                  <ul className="uk-nav uk-navbar-dropdown-nav">
                    <li>
                      <Link href="/">
                        <a style={{ color: '#fff' }}>
                          <span uk-icon="icon: home" className="uk-margin-small-right"></span>
                          Home
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/image">
                        <a style={{ color: '#fff' }}>
                          <span uk-icon="icon: image" className="uk-margin-small-right"></span>
                          Image Generation
                        </a>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </nav>

        <div className="uk-container uk-container-large uk-margin-top">
          {children}
        </div>
      </div>
    </UIWrapper>
  );
};

export default Layout;