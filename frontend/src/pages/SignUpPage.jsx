// frontend/src/pages/SignUpPage.jsx
import React, { useEffect, useState } from 'react';
import { SignUp, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import PhoneNumberCollector from '../components/PhoneNumberCollector';
import axios from 'axios';

const SignUpPage = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [showPhoneCollector, setShowPhoneCollector] = useState(false);
  const [phoneChecked, setPhoneChecked] = useState(false);

  useEffect(() => {
    const checkAndSyncUser = async () => {
      if (!isLoaded) return;
      
      if (isSignedIn && user) {
        try {
          const token = await user.getToken();
          
          // Check if user already has phone number in our DB
          try {
            const response = await axios.get(
              `${process.env.REACT_APP_API_URL}/user/check-phone`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );
            
            // If phone number exists and is valid, navigate to home
            if (response.data.hasPhoneNumber && response.data.phoneNumber) {
              // Validate phone number format
              const phoneRegex = /^[6-9]\d{9}$/;
              const cleanedPhone = response.data.phoneNumber.replace(/\D/g, '');
              
              if (phoneRegex.test(cleanedPhone)) {
                // Sync user data
                await axios.post(
                  `${process.env.REACT_APP_API_URL}/user/sync`,
                  {
                    phoneNumber: cleanedPhone,
                    email: user.primaryEmailAddress?.emailAddress,
                    firstName: user.firstName,
                    lastName: user.lastName
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  }
                );
                navigate('/');
              } else {
                // Phone number exists but is invalid, require re-entry
                setShowPhoneCollector(true);
              }
            } else {
              // Show phone number collector - MANDATORY
              setShowPhoneCollector(true);
            }
          } catch (error) {
            // If endpoint doesn't exist or error, show phone collector
            setShowPhoneCollector(true);
          }
        } catch (error) {
          console.error('Error checking user:', error);
          setShowPhoneCollector(true);
        } finally {
          setPhoneChecked(true);
        }
      }
    };

    checkAndSyncUser();
  }, [isSignedIn, user, isLoaded, navigate]);

  const handlePhoneComplete = () => {
    navigate('/');
  };

  // Show phone collector if user is signed in but doesn't have phone number
  if (isSignedIn && user && showPhoneCollector && phoneChecked) {
    return <PhoneNumberCollector user={user} onComplete={handlePhoneComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 flex items-center justify-center pt-16 px-4">
      <SignUp
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-gray-900 border-2 border-yellow-400/30 shadow-2xl shadow-yellow-400/10',
            headerTitle: 'text-white text-2xl font-bold',
            headerSubtitle: 'text-gray-300',
            socialButtonsBlockButton: 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 hover:border-yellow-400/50 transition-all',
            socialButtonsBlockButtonText: 'text-white font-medium',
            socialButtonsBlockButtonArrow: 'text-yellow-400',
            formButtonPrimary: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-300 hover:to-yellow-400 font-bold shadow-lg shadow-yellow-400/30',
            formFieldInput: 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-yellow-400/50',
            formFieldLabel: 'text-gray-300 font-medium',
            footerActionLink: 'text-yellow-400 hover:text-yellow-300 font-semibold',
            identityPreviewText: 'text-gray-300',
            identityPreviewEditButton: 'text-yellow-400 hover:text-yellow-300',
            formResendCodeLink: 'text-yellow-400 hover:text-yellow-300',
            otpCodeFieldInput: 'bg-gray-800 border-gray-700 text-white focus:border-yellow-400 focus:ring-yellow-400/50',
            alertText: 'text-white',
            formFieldErrorText: 'text-red-400',
            footerAction: 'text-gray-400',
          },
        }}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
      />
    </div>
  );
};

export default SignUpPage;