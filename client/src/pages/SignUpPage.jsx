import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import AuthLayout from '../components/layout/AuthLayout';

const SignUpPage = () => {
  return (
    <AuthLayout>
      <SignUp 
        routing="path" 
        path="/sign-up" 
        signInUrl="/sign-in" 
        fallbackRedirectUrl="/my-dashboard"
        appearance={{
          elements: {
            rootBox: "mx-auto w-full",
            card: "shadow-none bg-white rounded-2xl w-full",
          }
        }}
      />
    </AuthLayout>
  );
};

export default SignUpPage;
