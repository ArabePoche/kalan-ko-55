
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VideoEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  video: any;
  onUpdated: () => void;
}

const VIDEO_TYPES = [
  { value: 'promo', label: 'Promotionnel' },
  { value: 'educational', label: 'Éducatif' },
  { value: 'testimonial', label: 'Témoignage' }
];

const VideoEditModal = ({ open, onOpenChange, video, onUpdated }: VideoEditModalProps) => {
  const [form, setForm] = useState<{
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
    product_id: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (video) {
      setForm({
        title: video.title || '',
        description: video.description || '',
        video_url: video.video_url || '',
        thumbnail_url: video.thumbnail_url || '',
        video_type: (video.video_type as 'promo' | 'educational' | 'testimonial') || undefined,
        product_id: video.product_id || ''
      });
    }
  }, [video]);

  const handleUpdate = async () => {
    setLoading(true);

    if (!form.title || !form.video_url || !form.video_type) {
      toast({
        title: "Champs requis",
        description: "Le titre, l'URL de la vidéo et le type sont obligatoires.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const payload = {
      title: form.title,
      description: form.description || null,
      video_url: form.video_url,
      thumbnail_url: form.thumbnail_url || null,
      video_type: form.video_type,
      product_id: form.product_id || null
    };

    const { error } = await supabase
      .from("videos")
      .update(payload)
      .eq("id", video.id);

    if (error) {
      toast({
        title: "Erreur lors de la modification",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Vidéo modifiée",
      description: "Les changements ont été enregistrés.",
    });
    setLoading(false);
    onUpdated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier la vidéo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Titre"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            disabled={loading}
          />

          <Textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            disabled={loading}
          />

          <Input
            placeholder="URL de la vidéo"
            value={form.video_url}
            onChange={(e) => setForm({ ...form, video_url: e.target.value })}
            disabled={loading}
          />

          <Input
            placeholder="URL de la miniature"
            value={form.thumbnail_url}
            onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
            disabled={loading}
          />

          <Select
            value={form.video_type}
            onValueChange={(value: 'promo' | 'educational' | 'testimonial') => setForm({ ...form, video_type: value })}
            disabled={loading}
          >
            <SelectTrigger>
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
            placeholder="ID du produit associé"
            value={form.product_id}
            onChange={(e) => setForm({ ...form, product_id: e.target.value })}
            disabled={loading}
          />

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? "Modification..." : "Modifier"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoEditModal;

// As above: only valid values, never an empty string used for value
