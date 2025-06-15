
import React, { useRef, useEffect, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";

interface CameraCaptureModalProps {
  open: boolean;
  onClose: () => void;
  onCapture: (imageData: string) => void;
}
const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({ open, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Démarre la webcam au montage et open=true
  useEffect(() => {
    async function startCamera() {
      setError(null);
      setCapturedImage(null);
      if (open && videoRef.current) {
        try {
          streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = streamRef.current;
          videoRef.current.play();
        } catch (err: any) {
          setError("Impossible d'accéder à la caméra.");
        }
      }
    }
    if (open) startCamera();
    return () => {
      // Cleanup: arrêter la caméra
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [open]);

  const handleCapture = useCallback(() => {
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

  const handleUsePhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-80 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg shadow-lg p-6 max-w-sm w-full relative flex flex-col items-center">
        <h2 className="text-white text-lg mb-4">Prendre une photo</h2>
        {error && (
          <div className="text-red-400 mb-2">{error}</div>
        )}
        {!capturedImage ? (
          <video ref={videoRef} autoPlay className="w-full rounded mb-4" />
        ) : (
          <img src={capturedImage} alt="Captured" className="w-full rounded mb-4" />
        )}
        <div className="flex gap-2 w-full">
          {!capturedImage && (
            <Button onClick={handleCapture} className="flex-1 bg-[#25d366]">
              Capturer
            </Button>
          )}
          {capturedImage && (
            <>
              <Button onClick={handleUsePhoto} className="flex-1 bg-[#25d366]">Utiliser la photo</Button>
              <Button onClick={() => setCapturedImage(null)} variant="ghost" className="flex-1">Recommencer</Button>
            </>
          )}
          <Button onClick={onClose} variant="ghost" className="flex-1">Annuler</Button>
        </div>
      </div>
    </div>
  );
};
export default CameraCaptureModal;
