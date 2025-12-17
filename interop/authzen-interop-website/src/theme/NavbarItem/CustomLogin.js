import React from 'react';

const ISSUER = process.env.NEXT_PUBLIC_ISSUER || process.env.ISSUER;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || process.env.CLIENT_ID;
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

export default function CustomLogin() {
  const handleLogin = () => {
    window.location.href = buildAuthUrl();
  };
  return (
    <button onClick={handleLogin} style={{marginLeft: 12, padding: '6px 16px', borderRadius: 4, border: '1px solid #ccc', background: '#fff', cursor: 'pointer'}}>
      Login
    </button>
  );
}
import React from 'react';

const ISSUER = process.env.NEXT_PUBLIC_ISSUER || process.env.ISSUER;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || process.env.CLIENT_ID;
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

export default function CustomLogin() {
  const handleLogin = () => {
    window.location.href = buildAuthUrl();
  };
  return (
    <button onClick={handleLogin} style={{marginLeft: 12, padding: '6px 16px', borderRadius: 4, border: '1px solid #ccc', background: '#fff', cursor: 'pointer'}}>
      Login
    </button>
  );
}
