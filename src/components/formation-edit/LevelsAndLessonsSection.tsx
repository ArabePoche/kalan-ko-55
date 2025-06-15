
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormationVideos } from "@/hooks/useFormationVideos";

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
    updated[levelIdx].lessons.push({ title: "", video_url: "", selected_video_id: "" });
    setLevels(updated);
  };

  const removeLesson = (levelIdx: number, lessonIdx: number) => {
    const updated = [...levels];
    updated[levelIdx].lessons = updated[levelIdx].lessons.filter((_, i) => i !== lessonIdx);
    setLevels(updated);
  };

  return (
    <div className="border-t pt-3 mt-4">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-lg">Niveaux</span>
        <Button size="sm" type="button" variant="outline" onClick={addLevel} disabled={loading}>
          + Ajouter un niveau
        </Button>
      </div>
      <div className="space-y-4 mt-2">
        {levels.map((level, li) => (
          <div key={li} className="border rounded-md p-2 space-y-2 bg-muted/50">
            {/* Titre du niveau */}
            <label className="block text-xs font-medium mb-1">Titre du niveau</label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Titre du niveau"
                value={level.title}
                onChange={e => handleLevelChange(li, "title", e.target.value)}
                className="flex-1"
                disabled={loading}
              />
              <Button type="button" variant="destructive" size="icon" onClick={() => removeLevel(li)} disabled={loading}>
                &times;
              </Button>
            </div>
            {/* gestion des leçons */}
            <div className="ml-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">Leçons</span>
                <Button type="button" size="sm" variant="secondary" onClick={() => addLesson(li)} disabled={loading}>
                  + Ajouter une leçon
                </Button>
              </div>
              <div className="space-y-2">
                {level.lessons.map((lesson, lesIdx) => (
                  <div key={lesIdx} className="space-y-2 p-3 border rounded bg-background">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="block text-xs font-medium mb-1">Titre de la leçon</label>
                        <Input
                          placeholder="Titre de la leçon"
                          value={lesson.title}
                          onChange={e => handleLessonChange(li, lesIdx, "title", e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeLesson(li, lesIdx)}
                        disabled={loading}
                      >
                        &times;
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium mb-1">Sélectionner une vidéo</label>
                        <Select
                          value={lesson.selected_video_id || ""}
                          onValueChange={(value) => handleVideoSelection(li, lesIdx, value)}
                          disabled={loading || videosLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={videosLoading ? "Chargement..." : "Choisir une vidéo"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Aucune vidéo</SelectItem>
                            {videos.map((video) => (
                              <SelectItem key={video.id} value={video.id}>
                                {video.title} ({video.video_type})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium mb-1">URL vidéo manuelle</label>
                        <Input
                          placeholder="URL vidéo (optionnel)"
                          value={lesson.video_url}
                          onChange={e => handleLessonChange(li, lesIdx, "video_url", e.target.value)}
                          disabled={loading}
                        />
                      </div>
                    </div>
                    
                    {lesson.selected_video_id && (
                      <div className="text-xs text-muted-foreground">
                        Vidéo sélectionnée : {videos.find(v => v.id === lesson.selected_video_id)?.title}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
