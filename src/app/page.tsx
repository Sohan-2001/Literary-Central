'use client';

import { Button } from '@/components/ui/button';
import { useAuth, useUser } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LandingPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  if (isUserLoading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight font-headline">
          Welcome to Literary Central
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Your personal library management system.
        </p>
        <Button onClick={handleSignIn} size="lg" className="mt-8">
          <LogIn className="mr-2 h-5 w-5" />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
