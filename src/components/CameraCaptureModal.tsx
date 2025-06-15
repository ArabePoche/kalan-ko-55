
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
  const chunksRef = useRef<Blob[]>([]);
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("user");
  const [askFacing, setAskFacing] = useState(false);

  // (Re)démarre la webcam selon mode photo/video et front/dos
  useEffect(() => {
    async function startCamera(constraints: MediaStreamConstraints) {
      setError(null);
      setCapturedImage(null);
      setCapturedVideo(null);
      setRecording(false);
      chunksRef.current = [];
      
      if (open && (mode === "photo" || mode === "video") && videoRef.current) {
        try {
          // Stop existing stream if any
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
          }
          // Ajout du facingMode utilisateur/environnement
          const deviceConstraints: MediaStreamConstraints = {
            ...constraints,
            video: {
              ...(typeof constraints.video === "boolean" ? {} : constraints.video),
              facingMode: { exact: cameraFacing }
            }
          };
          // Si facingMode n'est pas supporté, fallback
          try {
            streamRef.current = await navigator.mediaDevices.getUserMedia(deviceConstraints);
          } catch {
            // fallback sans "exact"
            streamRef.current = await navigator.mediaDevices.getUserMedia({
              ...constraints,
              video: { ...(typeof constraints.video === "boolean" ? {} : constraints.video), facingMode: cameraFacing }
            });
          }
          videoRef.current.srcObject = streamRef.current;
          await videoRef.current.play();
        } catch (err: any) {
          console.error('Camera access error:', err);
          setError("Impossible d'accéder à la caméra. Vérifiez les permissions.");
        }
      }
    }
    
    if (open && (mode === "photo" || mode === "video")) {
      startCamera({
        video: true,
        audio: mode === "video"
      });
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
  // Ajout cameraFacing dans les dépendances
  }, [open, mode, cameraFacing]);

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
    
    chunksRef.current = [];
    setCapturedVideo(null);
    setRecording(true);

    try {
      let options: any = { mimeType: "video/webm;codecs=vp9" };
      // Fallback to other formats if vp9 is not supported
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = "video/webm;codecs=vp8";
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options.mimeType = "video/webm";
        }
      }
      const rec = new MediaRecorder(streamRef.current, options);
      mediaRecorderRef.current = rec;

      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      rec.onstop = () => {
        if (chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, { type: rec.mimeType });
          const videoURL = URL.createObjectURL(blob);
          setCapturedVideo(videoURL);
        }
        setRecording(false);
      };
      rec.onerror = (e) => {
        setError("Erreur lors de l'enregistrement");
        setRecording(false);
      };
      
      rec.start(1000); // Collect data every second
    } catch (err) {
      setError("Impossible de démarrer l'enregistrement");
      setRecording(false);
    }
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

  // Ajout: Sélecteur caméra si mode non choisi
  if (mode === "menu" || askFacing) {
    return (
      <div className="fixed z-50 inset-0 bg-black bg-opacity-80 flex items-center justify-center">
        <div className="bg-gray-900 rounded-lg shadow-lg p-6 max-w-xs w-full relative flex flex-col items-center">
          <h2 className="text-white text-lg mb-4">Choisir une action caméra</h2>
          <div className="flex flex-col gap-4 w-full mb-4">
            <Button className="w-full bg-[#25d366]" onClick={() => { setAskFacing(true); setMode("photo"); }}>
              Prendre une photo
            </Button>
            <Button className="w-full bg-[#25d366]" onClick={() => { setAskFacing(true); setMode("video"); }}>
              Enregistrer une vidéo
            </Button>
          </div>
          {((mode === "photo" || mode === "video") && askFacing) && (
            <div className="w-full flex flex-col gap-2 mb-2">
              <div className="text-white text-center text-sm mb-2">Choisissez la caméra</div>
              <Button className={`w-full ${cameraFacing === "user" ? "bg-blue-500" : "bg-[#25d366]"}`}
                onClick={() => { setCameraFacing("user"); setAskFacing(false); }}>
                Caméra frontale
              </Button>
              <Button className={`w-full ${cameraFacing === "environment" ? "bg-blue-500" : "bg-[#25d366]"}`}
                onClick={() => { setCameraFacing("environment"); setAskFacing(false); }}>
                Caméra dorsale
              </Button>
            </div>
          )}
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
          <div className="text-red-400 mb-2 text-sm text-center">{error}</div>
        )}
        
        {/* Affichage video stream */}
        {!capturedImage && !capturedVideo && (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            muted 
            className="w-full rounded mb-4 bg-gray-800" 
            style={{ maxHeight: '300px' }}
          />
        )}
        
        {/* Preview photo */}
        {capturedImage && (
          <img src={capturedImage} alt="Captured" className="w-full rounded mb-4" style={{ maxHeight: '300px' }} />
        )}
        
        {/* Preview vidéo */}
        {capturedVideo && (
          <video 
            src={capturedVideo} 
            controls 
            className="w-full rounded mb-4" 
            style={{ maxHeight: '300px' }}
          />
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
                Démarrer l'enregistrement
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
              <Button onClick={() => { 
                setCapturedVideo(null); 
                chunksRef.current = []; 
              }} variant="ghost" className="flex-1">
                Recommencer
              </Button>
            </>
          )}
          <Button onClick={() => { setMode("menu"); setAskFacing(false); }} variant="ghost" className="flex-1">
            Retour
          </Button>
          <Button onClick={() => { onClose(); setMode("menu"); setAskFacing(false); }} variant="ghost" className="flex-1">
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CameraCaptureModal;
