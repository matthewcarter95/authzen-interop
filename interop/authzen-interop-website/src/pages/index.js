import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Interop Results
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  const [tokenPayload, setTokenPayload] = React.useState(null);
  React.useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setTokenPayload(payload);
      } catch (e) {
        setTokenPayload({ error: 'Invalid token' });
      }
    }
  }, []);
  return (
    <Layout
      title={`${siteConfig.title}`}
      description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        {tokenPayload && (
          <div style={{marginTop: 32, padding: 16, background: '#f5f5f5', borderRadius: 8}}>
            <h2>Access Token Contents</h2>
            <pre style={{overflowX: 'auto'}}>{JSON.stringify(tokenPayload, null, 2)}</pre>
          </div>
        )}
      </main>
    </Layout>
  );
}
