
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from '@/integrations/supabase/types';

interface ProfileBioProps {
  profile: Tables<'profiles'>;
}

export const ProfileBio = ({ profile }: ProfileBioProps) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Biographie</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{profile?.bio || "Cet utilisateur n'a pas encore de biographie."}</p>
      </CardContent>
    </Card>
  );
};
