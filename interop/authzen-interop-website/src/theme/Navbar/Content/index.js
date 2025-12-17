import React from 'react';
import {useThemeConfig} from '@docusaurus/theme-common';
import {
  splitNavbarItems,
  useNavbarMobileSidebar,
} from '@docusaurus/theme-common/internal';
import NavbarItem from '@theme/NavbarItem';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import SearchBar from '@theme/SearchBar';
import NavbarMobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle';
import NavbarLogo from '@theme/Navbar/Logo';
import NavbarSearch from '@theme/Navbar/Search';

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

function LoginButton() {
  const handleLogin = async () => {
    const ISSUER = typeof window !== 'undefined' && window.ENV_ISSUER || '';
    const CLIENT_ID = typeof window !== 'undefined' && window.ENV_CLIENT_ID || '';
    const REDIRECT_URI = `${window.location.origin}/auth/callback`;
    
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
    
    window.location.href = `${ISSUER}/authorize?${params.toString()}`;
  };

  return (
    <button 
      onClick={handleLogin} 
      className="button button--secondary button--sm"
      style={{marginLeft: 8}}
    >
      Login
    </button>
  );
}

function useNavbarItems() {
  return useThemeConfig().navbar.items;
}

export default function NavbarContent() {
  const mobileSidebar = useNavbarMobileSidebar();
  const items = useNavbarItems();
  const [leftItems, rightItems] = splitNavbarItems(items);
  const searchBarItem = items.find((item) => item.type === 'search');

  return (
    <div className="navbar__inner">
      <div className="navbar__items">
        {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
        <NavbarLogo />
        {leftItems.map((item, i) => (
          <NavbarItem {...item} key={i} />
        ))}
      </div>
      <div className="navbar__items navbar__items--right">
        {rightItems.map((item, i) => (
          <NavbarItem {...item} key={i} />
        ))}
        <LoginButton />
        <NavbarColorModeToggle />
        {!searchBarItem && (
          <NavbarSearch>
            <SearchBar />
          </NavbarSearch>
        )}
      </div>
    </div>
  );
}