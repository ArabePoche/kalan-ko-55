
import React, { useRef, useEffect, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";

interface CameraCaptureModalProps {
  open: boolean;
  onClose: () => void;
  onCapture: (imageData: string) => void;
  onVideoCapture: (videoUrl: string) => void;
  mode: "menu" | "photo" | "video";
  setMode: (mode: "menu" | "photo" | "video") => void;
}

const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  open,
  onClose,
  onCapture,
  onVideoCapture,
  mode,
  setMode
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedVideo, setCapturedVideo] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [videoChunks, setVideoChunks] = useState<Blob[]>([]);

  // (Re)démarre la webcam selon mode photo/video
  useEffect(() => {
    async function startCamera(constraints: MediaStreamConstraints) {
      setError(null);
      setCapturedImage(null);
      setCapturedVideo(null);
      setRecording(false);
      setVideoChunks([]);
      if (open && (mode === "photo" || mode === "video") && videoRef.current) {
        try {
          streamRef.current = await navigator.mediaDevices.getUserMedia(constraints);
          videoRef.current.srcObject = streamRef.current;
          videoRef.current.play();
        } catch (err: any) {
          setError("Impossible d'accéder à la caméra.");
        }
      }
    }
    if (open && mode === "photo") {
      startCamera({ video: true, audio: false });
    } else if (open && mode === "video") {
      startCamera({ video: true, audio: true });
    }
    return () => {
      // Cleanup: arrêter la caméra
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
    // Ne dépend pas de setMode !
    // eslint-disable-next-line
  }, [open, mode]);

  // Capture photo
  const handleCapturePhoto = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setCapturedImage(dataUrl);
    }
  }, []);

  // Validation photo
  const handleUsePhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
      setMode("menu");
    }
  };

  // Capture vidéo
  const handleStartRecording = () => {
    if (!streamRef.current) return;
    const rec = new MediaRecorder(streamRef.current, { mimeType: "video/webm" });
    mediaRecorderRef.current = rec;
    setVideoChunks([]);
    setCapturedVideo(null);
    setRecording(true);

    rec.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        setVideoChunks((prev) => [...prev, e.data]);
      }
    };
    rec.onstop = () => {
      const blob = new Blob(videoChunks, { type: "video/webm" });
      const videoURL = URL.createObjectURL(blob);
      setCapturedVideo(videoURL);
      setRecording(false);
    };
    rec.start();
  };

  // Arrête et sauvegarde la vidéo
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
    }
  };

  // Utiliser la vidéo prise
  const handleUseVideo = () => {
    if (capturedVideo) {
      onVideoCapture(capturedVideo);
      onClose();
      setMode("menu");
    }
  };

  if (!open) return null;

  // MENU d’options : photo ou vidéo
  if (mode === "menu") {
    return (
      <div className="fixed z-50 inset-0 bg-black bg-opacity-80 flex items-center justify-center">
        <div className="bg-gray-900 rounded-lg shadow-lg p-6 max-w-xs w-full relative flex flex-col items-center">
          <h2 className="text-white text-lg mb-4">Choisir une action caméra</h2>
          <div className="flex flex-col gap-4 w-full mb-4">
            <Button className="w-full bg-[#25d366]" onClick={() => setMode("photo")}>
              Prendre une photo
            </Button>
            <Button className="w-full bg-[#25d366]" onClick={() => setMode("video")}>
              Enregistrer une vidéo
            </Button>
          </div>
          <Button variant="ghost" className="w-full" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-80 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg shadow-lg p-6 max-w-sm w-full relative flex flex-col items-center">
        <h2 className="text-white text-lg mb-4">
          {mode === "photo" ? "Prendre une photo" : "Enregistrer une vidéo"}
        </h2>
        {error && (
          <div className="text-red-400 mb-2">{error}</div>
        )}
        {/* Affichage video stream */}
        {!capturedImage && !capturedVideo && (
          <video ref={videoRef} autoPlay className="w-full rounded mb-4" muted={mode==="video"} />
        )}
        {/* Preview photo */}
        {capturedImage && (
          <img src={capturedImage} alt="Captured" className="w-full rounded mb-4" />
        )}
        {/* Preview vidéo */}
        {capturedVideo && (
          <video src={capturedVideo} controls className="w-full rounded mb-4" />
        )}
        <div className="flex gap-2 w-full">
          {mode === "photo" && !capturedImage && (
            <Button onClick={handleCapturePhoto} className="flex-1 bg-[#25d366]">
              Capturer
            </Button>
          )}
          {mode === "video" && !capturedVideo && (
            !recording ?
              <Button onClick={handleStartRecording} className="flex-1 bg-[#25d366]">
                Démarrer l’enregistrement
              </Button>
              :
              <Button onClick={handleStopRecording} variant="destructive" className="flex-1">
                Arrêter
              </Button>
          )}
          {/* Valider ou recommencer */}
          {mode === "photo" && capturedImage && (
            <>
              <Button onClick={handleUsePhoto} className="flex-1 bg-[#25d366]">
                Utiliser la photo
              </Button>
              <Button onClick={() => setCapturedImage(null)} variant="ghost" className="flex-1">
                Recommencer
              </Button>
            </>
          )}
          {mode === "video" && capturedVideo && (
            <>
              <Button onClick={handleUseVideo} className="flex-1 bg-[#25d366]">
                Utiliser la vidéo
              </Button>
              <Button onClick={() => { setCapturedVideo(null); setVideoChunks([]); }} variant="ghost" className="flex-1">
                Recommencer
              </Button>
            </>
          )}
          <Button onClick={() => { setMode("menu"); }} variant="ghost" className="flex-1">
            Retour
          </Button>
          <Button onClick={() => { onClose(); setMode("menu"); }} variant="ghost" className="flex-1">
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CameraCaptureModal;

