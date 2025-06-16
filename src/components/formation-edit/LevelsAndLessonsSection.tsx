
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormationVideos } from "@/hooks/useFormationVideos";
import { AlertTriangle, Check } from "lucide-react";

interface LessonForm {
  title: string;
  video_url: string;
  selected_video_id?: string;
}

interface LevelForm {
  title: string;
  lessons: LessonForm[];
}

interface LevelsAndLessonsSectionProps {
  levels: LevelForm[];
  setLevels: React.Dispatch<React.SetStateAction<LevelForm[]>>;
  loading: boolean;
}

export default function LevelsAndLessonsSection({ levels, setLevels, loading }: LevelsAndLessonsSectionProps) {
  const { data: videos = [], isLoading: videosLoading } = useFormationVideos();

  const handleLevelChange = (idx: number, key: keyof LevelForm, value: any) => {
    const updated = [...levels];
    (updated[idx] as any)[key] = value;
    setLevels(updated);
  };

  const handleLessonChange = (levelIdx: number, lessonIdx: number, key: keyof LessonForm, value: any) => {
    const updated = [...levels];
    updated[levelIdx].lessons[lessonIdx][key] = value;
    setLevels(updated);
  };

  const handleVideoSelection = (levelIdx: number, lessonIdx: number, videoId: string) => {
    if (videoId === "__none") {
      const updated = [...levels];
      updated[levelIdx].lessons[lessonIdx].selected_video_id = undefined;
      updated[levelIdx].lessons[lessonIdx].video_url = "";
      setLevels(updated);
      return;
    }

    const selectedVideo = videos.find(v => v.id === videoId);
    const updated = [...levels];
    
    if (selectedVideo) {
      updated[levelIdx].lessons[lessonIdx].selected_video_id = videoId;
      updated[levelIdx].lessons[lessonIdx].video_url = selectedVideo.video_url || "";
    }
    
    setLevels(updated);
  };

  const addLevel = () => {
    setLevels([...levels, { title: "", lessons: [] }]);
  };

  const removeLevel = (i: number) => {
    setLevels(levels.filter((_, idx) => idx !== i));
  };

  const addLesson = (levelIdx: number) => {
    const updated = [...levels];
    updated[levelIdx].lessons.push({ title: "", video_url: "", selected_video_id: undefined });
    setLevels(updated);
  };

  const removeLesson = (levelIdx: number, lessonIdx: number) => {
    const updated = [...levels];
    updated[levelIdx].lessons = updated[levelIdx].lessons.filter((_, i) => i !== lessonIdx);
    setLevels(updated);
  };

  const validateLevel = (level: LevelForm): boolean => {
    if (!level.title.trim()) return false;
    return level.lessons.every(lesson => lesson.title.trim());
  };

  return (
    <div className="border-t pt-3 mt-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="font-semibold text-lg">Niveaux et Leçons</span>
          <p className="text-sm text-muted-foreground mt-1">
            Organisez votre formation en niveaux et leçons pour une meilleure structure
          </p>
        </div>
        <Button 
          size="sm" 
          type="button" 
          variant="outline" 
          onClick={addLevel} 
          disabled={loading}
        >
          + Ajouter un niveau
        </Button>
      </div>

      {levels.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
          <p className="text-muted-foreground">Aucun niveau créé</p>
          <p className="text-sm text-muted-foreground mt-1">Commencez par ajouter un niveau</p>
        </div>
      )}

      <div className="space-y-4">
        {levels.map((level, li) => {
          const isValidLevel = validateLevel(level);
          
          return (
            <div key={li} className="border rounded-md p-4 space-y-3 bg-muted/50">
              {/* En-tête du niveau */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    Niveau {li + 1}
                  </span>
                  {isValidLevel ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => removeLevel(li)} 
                  disabled={loading}
                >
                  Supprimer le niveau
                </Button>
              </div>

              {/* Titre du niveau */}
              <div>
                <label className="block text-sm font-medium mb-2">Titre du niveau *</label>
                <Input
                  placeholder="Ex: Les bases, Niveau intermédiaire..."
                  value={level.title}
                  onChange={e => handleLevelChange(li, "title", e.target.value)}
                  disabled={loading}
                  className={!level.title.trim() ? "border-amber-300" : ""}
                />
                {!level.title.trim() && (
                  <p className="text-xs text-amber-600 mt-1">Le titre du niveau est requis</p>
                )}
              </div>

              {/* Gestion des leçons */}
              <div className="ml-3 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">
                    Leçons ({level.lessons.length})
                  </span>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="secondary" 
                    onClick={() => addLesson(li)} 
                    disabled={loading}
                  >
                    + Ajouter une leçon
                  </Button>
                </div>

                {level.lessons.length === 0 && (
                  <div className="text-center py-4 border border-dashed border-muted-foreground/20 rounded">
                    <p className="text-sm text-muted-foreground">Aucune leçon dans ce niveau</p>
                  </div>
                )}

                <div className="space-y-3">
                  {level.lessons.map((lesson, lesIdx) => (
                    <div key={lesIdx} className="space-y-3 p-3 border rounded bg-background">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          Leçon {lesIdx + 1}
                        </span>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeLesson(li, lesIdx)}
                          disabled={loading}
                        >
                          Supprimer
                        </Button>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Titre de la leçon *</label>
                        <Input
                          placeholder="Ex: Introduction, Premiers pas..."
                          value={lesson.title}
                          onChange={e => handleLessonChange(li, lesIdx, "title", e.target.value)}
                          disabled={loading}
                          className={!lesson.title.trim() ? "border-amber-300" : ""}
                        />
                        {!lesson.title.trim() && (
                          <p className="text-xs text-amber-600 mt-1">Le titre de la leçon est requis</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Sélectionner une vidéo</label>
                          <Select
                            value={lesson.selected_video_id ?? "__none"}
                            onValueChange={(value) => handleVideoSelection(li, lesIdx, value)}
                            disabled={loading || videosLoading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={videosLoading ? "Chargement..." : "Choisir une vidéo"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="__none">Aucune vidéo</SelectItem>
                              {videos.map((video) => (
                                <SelectItem key={video.id} value={video.id}>
                                  {video.title} ({video.video_type})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">URL vidéo manuelle</label>
                          <Input
                            placeholder="https://..."
                            value={lesson.video_url}
                            onChange={e => handleLessonChange(li, lesIdx, "video_url", e.target.value)}
                            disabled={loading}
                          />
                        </div>
                      </div>
                      
                      {lesson.selected_video_id && lesson.selected_video_id !== "__none" && (
                        <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded">
                          <Check className="w-3 h-3" />
                          Vidéo sélectionnée : {videos.find(v => v.id === lesson.selected_video_id)?.title}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {levels.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            <strong>Conseils :</strong> Assurez-vous que chaque niveau et leçon a un titre descriptif. 
            Les niveaux seront affichés dans l'ordre où vous les créez.
          </p>
        </div>
      )}
    </div>
  );
}
