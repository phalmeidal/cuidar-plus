import { useEffect, useState } from 'react';
import AppShell from './components/AppShell.jsx';
import PhoneFrame from './components/PhoneFrame.jsx';
import SplashScreen from './components/SplashScreen.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Analytics from './pages/Analytics.jsx';
import Details from './pages/Details.jsx';

const routes = {
  dashboard: Dashboard,
  analytics: Analytics,
  details: Details,
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
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

  return (
    <PhoneFrame>
      <AppShell activePage={activePage} onNavigate={setActivePage}>
        <ActivePage onNavigate={setActivePage} />
      </AppShell>
    </PhoneFrame>
  );
}
