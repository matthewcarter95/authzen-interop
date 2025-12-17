import React from 'react';


// Docusaurus client-side code does not have access to process.env
// Use window.env (if injected at runtime) or fallback to hardcoded values for local dev
const ISSUER = (typeof window !== 'undefined' && window.env && window.env.ISSUER) || '';
const CLIENT_ID = (typeof window !== 'undefined' && window.env && window.env.CLIENT_ID) || '';
const REDIRECT_URI = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '';


// PKCE helpers
function base64UrlEncode(str) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function pkceChallengeFromVerifier(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(digest);
}

function randomString(length = 64) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  const values = window.crypto.getRandomValues(new Uint8Array(length));
  for (let i = 0; i < length; i++) {
    result += charset[values[i] % charset.length];
  }
  return result;
}

async function buildAuthUrl() {
  const codeVerifier = randomString(64);
  const state = randomString(32);
  const codeChallenge = await pkceChallengeFromVerifier(codeVerifier);
  sessionStorage.setItem('pkce_code_verifier', codeVerifier);
  sessionStorage.setItem('pkce_state', state);
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    scope: 'openid profile email',
    redirect_uri: REDIRECT_URI,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state,
  });
  return `${ISSUER}/authorize?${params.toString()}`;
}

  const handleLogin = async () => {
    const url = await buildAuthUrl();
    window.location.href = url;
  };
  return (
    <button onClick={handleLogin} style={{marginLeft: 12, padding: '6px 16px', borderRadius: 4, border: '1px solid #ccc', background: '#fff', cursor: 'pointer'}}>
      Login
    </button>
  );
}
