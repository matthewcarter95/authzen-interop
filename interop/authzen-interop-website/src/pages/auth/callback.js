import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';

export default function AuthCallback() {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const storedState = sessionStorage.getItem('pkce_state');
      const codeVerifier = sessionStorage.getItem('pkce_code_verifier');

      if (!code || state !== storedState) {
        setError('Invalid callback parameters');
        return;
      }

      try {
        const ISSUER = window.ENV_ISSUER || '';
        const CLIENT_ID = window.ENV_CLIENT_ID || '';
        const REDIRECT_URI = `${window.location.origin}/auth/callback`;

        const response = await fetch(`${ISSUER}/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            code,
            redirect_uri: REDIRECT_URI,
            code_verifier: codeVerifier,
          }),
        });

        const tokenData = await response.json();
        if (tokenData.access_token) {
          setToken(tokenData.access_token);
          localStorage.setItem('access_token', tokenData.access_token);
          sessionStorage.removeItem('pkce_code_verifier');
          sessionStorage.removeItem('pkce_state');
          setTimeout(() => window.location.href = '/', 2000);
        } else {
          setError('Token exchange failed');
        }
      } catch (err) {
        setError('Network error');
      }
    };

    handleCallback();
  }, []);

  return (
    <Layout title="Auth Callback">
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        {error ? (
          <div>Error: {error}</div>
        ) : token ? (
          <div>
            <h2>Login Successful!</h2>
            <p>Redirecting to home page...</p>
            <details>
              <summary>Access Token</summary>
              <pre style={{ textAlign: 'left', background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
                {JSON.stringify(JSON.parse(atob(token.split('.')[1])), null, 2)}
              </pre>
            </details>
          </div>
        ) : (
          <div>Processing login...</div>
        )}
      </div>
    </Layout>
  );
}