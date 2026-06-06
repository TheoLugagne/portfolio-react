import { useEffect, useState } from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import LoginSkeleton from '../components/ui/LoginSkeleton';
import { useAuth } from '../hooks/useAuth';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

export default function LoginPage() {
  useDocumentTitle('Admin Login');
  const navigate = useNavigate();
  const { state, loginWithGoogle } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (state.status === 'authenticated') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [state.status, navigate]);

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      setErrorMessage('Google did not return a valid credential.');
      return;
    }

    setErrorMessage(null);

    try {
      await loginWithGoogle(response.credential);
      navigate('/admin/dashboard', { replace: true });
    } catch {
      setErrorMessage(
        'Sign-in failed. Your Google account may not be authorized for admin access.'
      );
    }
  };

  const handleGoogleError = () => {
    setErrorMessage('Google sign-in was cancelled or failed. Please try again.');
  };

  const isLoading = state.status === 'loading';

  return (
    <div className="rounded-card bg-white p-8 shadow-card">
      <h1 className="font-serif text-3xl text-dark">Admin Login</h1>
      <p className="mt-4 font-sans text-base text-muted">
        Sign in with Google to access the admin dashboard.
      </p>

      <div className="mt-8 flex justify-center">
        {!googleClientId ? (
          <p className="text-center font-sans text-sm text-red-600">
            Google sign-in is not configured. Set VITE_GOOGLE_CLIENT_ID in
            your environment.
          </p>
        ) : (
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            text="signin_with"
            shape="rectangular"
            width="280"
          />
        )}
      </div>

      {isLoading && <LoginSkeleton />}

      {errorMessage && (
        <p
          role="alert"
          className="mt-4 text-center font-sans text-sm text-red-600"
        >
          {errorMessage}
        </p>
      )}

      <p className="mt-6 text-center font-sans text-sm text-muted">
        <Link to="/" className="text-dark underline hover:text-primary">
          Back to home
        </Link>
      </p>
    </div>
  );
}
