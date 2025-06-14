
import { useAuth } from '@/contexts/AuthProvider';
import { useProfile } from '@/hooks/useProfile';
import { ProfileHeader } from './profile/ProfileHeader';
import { ProfileStats } from './profile/ProfileStats';
import { ProfileBio } from './profile/ProfileBio';
import { ProfileSections } from './profile/ProfileSections';
import { LoadingState } from './profile/LoadingState';
import { UnauthenticatedState } from './profile/UnauthenticatedState';

const ProfilePage = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();

  const isLoading = authLoading || profileLoading;

  if (isLoading) {
    return <LoadingState />;
  }

  if (!user) {
    return <UnauthenticatedState />;
  }

  if (!profile) {
    return <LoadingState />;
  }
  
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <ProfileHeader profile={profile} user={user} signOut={signOut} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ProfileStats />
        <ProfileBio profile={profile} />
      </div>
      
      <ProfileSections />
    </div>
  );
};

export default ProfilePage;
