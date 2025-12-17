import React, { useEffect } from 'react';
// Remove useHistory, use window.location.replace instead

const ISSUER = process.env.NEXT_PUBLIC_ISSUER || process.env.ISSUER;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || process.env.CLIENT_ID;
const REDIRECT_URI = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '';

async function exchangeCodeForToken(code, codeVerifier) {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: codeVerifier,
  });
  const response = await fetch(`${ISSUER}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  if (!response.ok) throw new Error('Token exchange failed');
  return response.json();
}


export default function Callback() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const storedState = sessionStorage.getItem('pkce_state');
    const codeVerifier = sessionStorage.getItem('pkce_code_verifier');
    if (!code) {
      window.location.replace('/?error=missing_code');
      return;
    }
    if (!state || !storedState || state !== storedState) {
      window.location.replace('/?error=invalid_state');
      return;
    }
    if (!codeVerifier) {
      window.location.replace('/?error=missing_verifier');
      return;
    }
    exchangeCodeForToken(code, codeVerifier)
      .then((tokens) => {
        localStorage.setItem('access_token', tokens.access_token);
        window.location.replace('/');
      })
      .catch(() => {
        window.location.replace('/?error=auth');
      });
  }, []);
  return <div>Processing login...</div>;
}
