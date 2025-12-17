import React from 'react';


// Docusaurus client-side code does not have access to process.env
// Use window.env (if injected at runtime) or fallback to hardcoded values for local dev
const ISSUER = (typeof window !== 'undefined' && window.env && window.env.ISSUER) || '';
const CLIENT_ID = (typeof window !== 'undefined' && window.env && window.env.CLIENT_ID) || '';
const REDIRECT_URI = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '';

function buildAuthUrl() {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    scope: 'openid profile email',
    redirect_uri: REDIRECT_URI,
  });
  return `${ISSUER}/authorize?${params.toString()}`;
}

export default function CustomLoginNavbarItem() {
  const handleLogin = () => {
    window.location.href = buildAuthUrl();
  };
  return (
    <button onClick={handleLogin} style={{marginLeft: 12, padding: '6px 16px', borderRadius: 4, border: '1px solid #ccc', background: '#fff', cursor: 'pointer'}}>
      Login
    </button>
  );
}
