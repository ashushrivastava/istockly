// frontend/src/pages/ProfilePage.jsx
// User profile page

import React from 'react';
import { UserProfile } from '@clerk/clerk-react';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>
        <UserProfile
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'bg-zinc-900 border border-zinc-800 shadow-none',
            },
          }}
        />
      </div>
    </div>
  );
};

export default ProfilePage;