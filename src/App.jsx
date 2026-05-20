import { useEffect, useState } from 'react';
import AppShell from './components/AppShell.jsx';
import PhoneFrame from './components/PhoneFrame.jsx';
import SplashScreen from './components/SplashScreen.jsx';
import { getCurrentUser, logout } from './services/authService.js';
import Auth from './pages/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Analytics from './pages/Analytics.jsx';
import Details from './pages/Details.jsx';
import Profile from './pages/Profile.jsx';

const routes = {
  dashboard: Dashboard,
  analytics: Analytics,
  details: Details,
  profile: Profile,
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [activePage, setActivePage] = useState('dashboard');

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <PhoneFrame>
        <SplashScreen />
      </PhoneFrame>
    );
  }

  const ActivePage = routes[activePage];

  function handleLogout() {
    logout();
    setCurrentUser(null);
    setActivePage('dashboard');
  }

  if (!currentUser) {
    return (
      <PhoneFrame>
        <Auth onAuthSuccess={setCurrentUser} />
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <AppShell activePage={activePage} onNavigate={setActivePage} currentUser={currentUser}>
        <ActivePage
          onNavigate={setActivePage}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      </AppShell>
    </PhoneFrame>
  );
}
