import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import AppRouter from './router/AppRouter';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

function AppProviders() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </AuthProvider>
  );
}

function App() {
  if (!googleClientId) {
    return <AppProviders />;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AppProviders />
    </GoogleOAuthProvider>
  );
}

export default App;
