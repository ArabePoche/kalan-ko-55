
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Video } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FormationCreateFormProps {
  categories: any[];
  loadingCategories: boolean;
  onCreated: () => void;
}

const initialState = {
  title: '',
  description: '',
  price: '',
  original_price: '',
  promoVideoUrl: '',
  badge: '',
  image_url: '',
  rating: '',
  students_count: '',
  instructor_id: '',
  category_id: '',
  discount_percentage: '',
  duration: ''
};

export default function FormationCreateForm({ categories, loadingCategories, onCreated }: FormationCreateFormProps) {
  const [newFormation, setNewFormation] = useState(initialState);
  const [isCreatingFormation, setIsCreatingFormation] = useState(false);

  const handleCreateFormation = async () => {
    setIsCreatingFormation(true);
    try {
      if (!newFormation.title || !newFormation.description || !newFormation.price) {
        toast({
          title: "Champs manquants",
          description: "Veuillez renseigner tous les champs obligatoires.",
          variant: "destructive"
        });
        setIsCreatingFormation(false);
        return;
      }
      const id = crypto.randomUUID();

      // Step 1: create corresponding product
      const productInsert = {
        id,
        title: newFormation.title,
        description: newFormation.description,
        price: newFormation.price ? parseFloat(newFormation.price) : 0,
        original_price: newFormation.original_price
          ? parseFloat(newFormation.original_price)
          : null,
        badge: newFormation.badge || null,
        image_url: newFormation.image_url || null,
        rating: newFormation.rating ? parseFloat(newFormation.rating) : 0,
        students_count: newFormation.students_count
          ? parseInt(newFormation.students_count)
          : 0,
        instructor_id: newFormation.instructor_id || null,
        category_id: newFormation.category_id || null,
        discount_percentage: newFormation.discount_percentage
          ? parseInt(newFormation.discount_percentage)
          : null,
        promo_video_url: newFormation.promoVideoUrl || null,
        product_type: "formation" as "formation",
        is_active: true,
      };
      const { error: productError } = await supabase
        .from('products')
        .insert([productInsert]);
      if (productError) {
        toast({
          title: "Erreur création produit",
          description: productError.message,
          variant: "destructive"
        });
        setIsCreatingFormation(false);
        return;
      }

      // Step 2: create formation
      const toInsert = {
        id,
        title: newFormation.title,
        description: newFormation.description,
        price: newFormation.price ? parseFloat(newFormation.price) : null,
        author_id: newFormation.instructor_id || null,
        thumbnail_url: newFormation.image_url || null,
        video_promo_id: newFormation.promoVideoUrl || null,
        category: newFormation.category_id || null,
        duration: newFormation.duration ? parseInt(newFormation.duration) : null,
        badge: newFormation.badge || null,
        category_id: newFormation.category_id || null,
        promo_video_url: newFormation.promoVideoUrl || null,
        image_url: newFormation.image_url || null,
        rating: newFormation.rating ? parseFloat(newFormation.rating) : 0,
        students_count: newFormation.students_count ? parseInt(newFormation.students_count) : 0,
        original_price: newFormation.original_price
          ? parseFloat(newFormation.original_price)
          : null,
        discount_percentage: newFormation.discount_percentage
          ? parseInt(newFormation.discount_percentage)
          : null,
        is_active: true
      };
      const { error } = await supabase.from('formations').insert([toInsert]);
      if (error) {
        toast({
          title: "Erreur formation",
          description: error.message,
          variant: "destructive"
        });
        setIsCreatingFormation(false);
        return;
      }
      toast({
        title: "Formation créée",
        description: "La formation a bien été ajoutée.",
      });
      setNewFormation(initialState);
      onCreated();
    } catch (e: any) {
      toast({
        title: "Erreur",
        description: e.message || "Une erreur s'est produite.",
        variant: "destructive"
      });
    }
    setIsCreatingFormation(false);
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Titre de la formation"
        value={newFormation.title}
        onChange={(e) => setNewFormation({ ...newFormation, title: e.target.value })}
        disabled={isCreatingFormation}
      />
      <Textarea
        placeholder="Description"
        value={newFormation.description}
        onChange={(e) => setNewFormation({ ...newFormation, description: e.target.value })}
        disabled={isCreatingFormation}
      />
      <Input
        placeholder="Prix (€)"
        type="number"
        value={newFormation.price}
        onChange={(e) => setNewFormation({ ...newFormation, price: e.target.value })}
        disabled={isCreatingFormation}
      />
      <Input
        placeholder="Prix original (€) (optionnel)"
        type="number"
        value={newFormation.original_price}
        onChange={(e) => setNewFormation({ ...newFormation, original_price: e.target.value })}
        disabled={isCreatingFormation}
      />
      {/* Sélecteur de catégorie */}
      <Select
        value={newFormation.category_id}
        onValueChange={v => setNewFormation({ ...newFormation, category_id: v })}
        disabled={isCreatingFormation || !categories}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Catégorie" />
        </SelectTrigger>
        <SelectContent>
          {categories && categories.map((cat: any) => (
            <SelectItem value={cat.id} key={cat.id}>{cat.label ?? cat.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder="ID formateur (optionnel)"
        value={newFormation.instructor_id}
        onChange={(e) => setNewFormation({ ...newFormation, instructor_id: e.target.value })}
        disabled={isCreatingFormation}
      />
      <Input
        placeholder="URL de l’image de formation (optionnel)"
        value={newFormation.image_url}
        onChange={(e) => setNewFormation({ ...newFormation, image_url: e.target.value })}
        disabled={isCreatingFormation}
      />
      <Input
        placeholder="Badge spécial (ex : Nouveau, Bestseller) (optionnel)"
        value={newFormation.badge}
        onChange={(e) => setNewFormation({ ...newFormation, badge: e.target.value })}
        disabled={isCreatingFormation}
      />
      <Input
        placeholder="Note moyenne (ex : 4.7) (optionnel)"
        type="number"
        step="0.01"
        value={newFormation.rating}
        onChange={(e) => setNewFormation({ ...newFormation, rating: e.target.value })}
        disabled={isCreatingFormation}
      />
      <Input
        placeholder="Nombre d’étudiants (optionnel)"
        type="number"
        value={newFormation.students_count}
        onChange={(e) => setNewFormation({ ...newFormation, students_count: e.target.value })}
        disabled={isCreatingFormation}
      />
      <Input
        placeholder="Pourcentage de réduction (optionnel)"
        type="number"
        value={newFormation.discount_percentage}
        onChange={(e) => setNewFormation({ ...newFormation, discount_percentage: e.target.value })}
        disabled={isCreatingFormation}
      />
      <Input
        placeholder="Durée (en minutes) (optionnel)"
        type="number"
        value={newFormation.duration}
        onChange={(e) => setNewFormation({ ...newFormation, duration: e.target.value })}
        disabled={isCreatingFormation}
      />
      <div className="relative flex items-center">
        <span className="absolute left-3 z-10">
          <Video className="h-5 w-5 text-muted-foreground" />
        </span>
        <Input
          placeholder="URL de la vidéo promotionnelle (optionnel)"
          value={newFormation.promoVideoUrl}
          onChange={(e) => setNewFormation({ ...newFormation, promoVideoUrl: e.target.value })}
          disabled={isCreatingFormation}
          className="pl-10"
        />
      </div>
      <Button
        className="w-full"
        onClick={handleCreateFormation}
        disabled={isCreatingFormation}
      >
        {isCreatingFormation ? "Création..." : "Créer Formation"}
      </Button>
    </div>
  );
}
