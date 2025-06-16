
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Video, Link } from "lucide-react";

interface VideoCreateFormProps {
  onCreated: () => void;
}

const VIDEO_TYPES = [
  { value: 'promo', label: 'Promotionnel' },
  { value: 'educational', label: 'Éducatif' },
  { value: 'testimonial', label: 'Témoignage' }
];

export default function VideoCreateForm({ onCreated }: VideoCreateFormProps) {
  const [newVideo, setNewVideo] = useState<{
    title: string;
    description: string;
    video_url: string;
    thumbnail_url: string;
    video_type?: 'promo' | 'educational' | 'testimonial';
    product_id: string;
  }>({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    video_type: undefined,
    product_id: '',
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateVideo = async () => {
    setIsCreating(true);
    try {
      if (!newVideo.title || !newVideo.video_url || !newVideo.video_type) {
        toast({
          title: "Champs manquants",
          description: "Veuillez renseigner au minimum le titre, l'URL de la vidéo et le type.",
          variant: "destructive"
        });
        setIsCreating(false);
        return;
      }

      const videoData = {
        title: newVideo.title,
        description: newVideo.description || null,
        video_url: newVideo.video_url,
        thumbnail_url: newVideo.thumbnail_url || null,
        video_type: newVideo.video_type,
        product_id: newVideo.product_id || null,
        is_active: true,
        likes_count: 0,
        comments_count: 0,
        views_count: 0
      };

      const { error } = await supabase
        .from('videos')
        .insert(videoData);

      if (error) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive"
        });
        setIsCreating(false);
        return;
      }

      toast({
        title: "Vidéo créée",
        description: "La vidéo a été ajoutée avec succès.",
      });

      setNewVideo({
        title: '',
        description: '',
        video_url: '',
        thumbnail_url: '',
        video_type: undefined,
        product_id: '',
      });
      onCreated();
    } catch (e: any) {
      toast({
        title: "Erreur",
        description: e.message || "Une erreur s'est produite.",
        variant: "destructive"
      });
    }
    setIsCreating(false);
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Titre de la vidéo"
        value={newVideo.title}
        onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
        disabled={isCreating}
      />

      <Textarea
        placeholder="Description (optionnel)"
        value={newVideo.description}
        onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
        disabled={isCreating}
      />

      <div className="relative flex items-center">
        <span className="absolute left-3 z-10">
          <Link className="h-5 w-5 text-muted-foreground" />
        </span>
        <Input
          placeholder="URL de la vidéo (YouTube, Vimeo, etc.)"
          value={newVideo.video_url}
          onChange={(e) => setNewVideo({ ...newVideo, video_url: e.target.value })}
          disabled={isCreating}
          className="pl-10"
        />
      </div>

      <Input
        placeholder="URL de la miniature (optionnel)"
        value={newVideo.thumbnail_url}
        onChange={(e) => setNewVideo({ ...newVideo, thumbnail_url: e.target.value })}
        disabled={isCreating}
      />

      <Select
        value={newVideo.video_type || ""}
        onValueChange={(value: 'promo' | 'educational' | 'testimonial') =>
          setNewVideo({ ...newVideo, video_type: value })
        }
        disabled={isCreating}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Type de vidéo" />
        </SelectTrigger>
        <SelectContent>
          {VIDEO_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        placeholder="ID du produit associé (optionnel)"
        value={newVideo.product_id}
        onChange={(e) => setNewVideo({ ...newVideo, product_id: e.target.value })}
        disabled={isCreating}
      />

      <Button
        className="w-full"
        onClick={handleCreateVideo}
        disabled={isCreating}
      >
        <Video className="w-4 h-4 mr-2" />
        {isCreating ? "Création..." : "Créer Vidéo"}
      </Button>
    </div>
  );
}
