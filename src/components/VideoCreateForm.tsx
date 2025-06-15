
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Youtube, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VideoCreateFormProps {
  categories: any[];
  loadingCategories: boolean;
  onCreated?: () => void;
}

const initialState = { 
  title: '', 
  description: '', 
  price: '', 
  url: '', 
  categoryId: '', 
  videoType: 'promo', 
};

export default function VideoCreateForm({ categories, loadingCategories, onCreated }: VideoCreateFormProps) {
  const [newVideo, setNewVideo] = useState(initialState);
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);

  const handleCreateVideo = async () => {
    setIsCreatingVideo(true);
    try {
      if (!newVideo.title || !newVideo.url || !newVideo.categoryId || !newVideo.videoType) {
        toast({
          title: "Champs manquants",
          description: "Veuillez remplir tous les champs obligatoires.",
          variant: "destructive"
        });
        setIsCreatingVideo(false);
        return;
      }
      const videoType =
        newVideo.videoType === "promo"
          ? "promo"
          : newVideo.videoType === "educational"
            ? "educational"
            : "testimonial";
      const { error } = await supabase
        .from('videos')
        .insert([
          {
            title: newVideo.title,
            description: newVideo.description || null,
            video_url: newVideo.url,
            video_type: videoType,
            category_id: newVideo.categoryId,
            is_active: true,
          }
        ]);
      if (error) {
        toast({
          title: "Erreur lors de la création",
          description: error.message || "Impossible de créer la vidéo.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Vidéo créée",
          description: "La vidéo a bien été ajoutée.",
        });
        setNewVideo(initialState);
        onCreated && onCreated();
      }
    } catch (e: any) {
      toast({
        title: "Erreur",
        description: e.message || "Une erreur s'est produite.",
        variant: "destructive"
      });
    }
    setIsCreatingVideo(false);
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Titre de la vidéo"
        value={newVideo.title}
        onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
        disabled={isCreatingVideo}
      />
      <Textarea
        placeholder="Description"
        value={newVideo.description}
        onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
        disabled={isCreatingVideo}
      />
      <Select
        value={newVideo.videoType}
        onValueChange={(v) => setNewVideo({ ...newVideo, videoType: v })}
        disabled={isCreatingVideo}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Type de vidéo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="promo">Promotion</SelectItem>
          <SelectItem value="educational">Éducative</SelectItem>
          <SelectItem value="testimonial">Témoignage</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={newVideo.categoryId}
        onValueChange={(v) => setNewVideo({ ...newVideo, categoryId: v })}
        disabled={isCreatingVideo || loadingCategories}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Catégorie" />
        </SelectTrigger>
        <SelectContent>
          {loadingCategories && (
            <SelectItem value="" disabled>Chargement...</SelectItem>
          )}
          {categories && categories.map((cat: any) => (
            <SelectItem value={cat.id} key={cat.id}>
              {cat.label ?? cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url">Lien Externe</TabsTrigger>
          <TabsTrigger value="upload">Télécharger</TabsTrigger>
        </TabsList>
        <TabsContent value="url" className="pt-4">
          <div className="relative flex items-center">
            <span className="absolute left-3 z-10">
              <Youtube className="h-5 w-5 text-muted-foreground" />
            </span>
            <Input
              placeholder="URL de la vidéo (YouTube, Vimeo...)"
              value={newVideo.url}
              onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
              disabled={isCreatingVideo}
              className="pl-10"
            />
          </div>
        </TabsContent>
        <TabsContent value="upload" className="pt-4">
          <Button variant="outline" className="w-full justify-center" disabled>
            <Upload className="w-4 h-4 mr-2" />
            Choisir un fichier vidéo
          </Button>
          <span className="text-xs text-muted-foreground block mt-1">
            (Fonctionnalité à venir)
          </span>
        </TabsContent>
      </Tabs>
      <Button className="w-full" onClick={handleCreateVideo} disabled={isCreatingVideo}>
        {isCreatingVideo ? "Création..." : "Publier"}
      </Button>
    </div>
  );
}
