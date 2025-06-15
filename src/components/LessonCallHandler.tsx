
import React, { useEffect, useRef, useState } from "react";
import { X, Mic, Video as VideoIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// INFO : Dans la vraie vie, il faudrait ajouter de la gestion de signalisation
// via WebRTC/PeerJS ou serveur maison. Ici on utilise l’API OpenAI Realtime :
// 1 client = élève, l’autre = serveur AI assistant (1 interlocuteur unique).

// Pour une vraie discussion prof-éleve il faudrait une vraie signalisation peer to peer avec identifiant, 
// à connecter à un vrai serveur/room. Cette implémentation donne une base “similaire FaceTime/WhatsApp” simple IA.

type CallType = "voice" | "video";
interface LessonCallHandlerProps {
  open: boolean;
  type: CallType;
  onClose: () => void;
  instructor: { name: string; avatar: string };
}

const WS_URL = "wss://YOUR_SUPABASE_PROJECT_REF.functions.supabase.co/functions/v1/realtime-chat"; // À configurer selon ton projet

const LessonCallHandler: React.FC<LessonCallHandlerProps> = ({
  open,
  type,
  onClose,
  instructor,
}) => {
  const [connecting, setConnecting] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pour la démo, le flux vidéo IA n’est pas disponible, donc on se limite au stream local (user).
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (!open) {
      // On clean tout à la fermeture
      wsRef.current?.close();
      setInCall(false);
      setConnecting(false);
      setError(null);
      setLocalStream(null);
      return;
    }

    if (open) {
      startCall();
    }
    // eslint-disable-next-line
  }, [open, type]);

  const startCall = async () => {
    setError(null);
    setConnecting(true);

    try {
      // 1. Ouvre le flux (audio seul ou audio+vidéo)
      const constraints: MediaStreamConstraints = type === "video"
        ? { audio: true, video: { facingMode: "user", width: 320, height: 240 } }
        : { audio: true, video: false };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);

      // 2. Connexion WebSocket (relay OpenAI Realtime)
      // TODO : délaisser cet url de démo pour un vrai edge function relay produit, c’est une base !
      const ws = new window.WebSocket(WS_URL);

      ws.onopen = () => {
        setConnecting(false);
        setInCall(true);
        // Optionnel: dire à l’IA/instructeur de “démarrer l’appel”, éventuel handshake ici        
        // On peut envoyer un event de type "start_call"
        ws.send(JSON.stringify({
          type: "conversation.item.create",
          item: {
            type: "message",
            role: "user",
            content: [{
              type: "input_text",
              text: "Démarrer l'appel " + (type === "video" ? "vidéo" : "vocal"),
            }]
          }
        }));
      };

      ws.onmessage = async (evt) => {
        // On s’attend à recevoir des chunks audio (delta) à jouer en direct
        try {
          const data = JSON.parse(evt.data);
          if (data.type === "response.audio.delta" && data.delta) {
            // Conversion base64 -> audio PCM/WAV
            const binaryString = atob(data.delta);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            // On joue le son dans le flux audio de la modale
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioCtx.decodeAudioData(bytes.buffer, (buffer) => {
              const src = audioCtx.createBufferSource();
              src.buffer = buffer;
              src.connect(audioCtx.destination);
              src.start(0);
            });
          }
          // On pourrait ajouter d’autres types: transcript, end, etc
        } catch (e) {
          console.error("Erreur message audio: ", e);
        }
      };

      ws.onerror = (e) => {
        setError("Impossible de démarrer l'appel.");
        setConnecting(false);
        setInCall(false);
      };
      ws.onclose = () => {
        setConnecting(false);
        setInCall(false);
      };

      wsRef.current = ws;

      // 3. Capture audio local : on envoie des buffers en temps réel à l’API (push)
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
      });
      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (e) => {
        const float32 = e.inputBuffer.getChannelData(0);
        // Convert to PCM16
        const int16Array = new Int16Array(float32.length);
        for (let i = 0; i < float32.length; i++) {
          const s = Math.max(-1, Math.min(1, float32[i]));
          int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        const uint8Array = new Uint8Array(int16Array.buffer);

        // Base64 encode & send (API OpenAI Realtime attend du PCM16 base64)
        let binary = '';
        const chunkSize = 0x8000;
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
          binary += String.fromCharCode.apply(null, Array.from(chunk));
        }
        const b64 = btoa(binary);

        ws.send(JSON.stringify({
          type: "input_audio_buffer.append",
          audio: b64,
        }));
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);

      // Clean up on hang up
      const stop = () => {
        processor.disconnect();
        source.disconnect();
        audioCtx.close();
        stream.getTracks().forEach((track) => track.stop());
        ws.close();
        setInCall(false);
      };

      // On clean tout à la fermeture
      audioRef.current = {
        // fake ref for cleanup
        current: stop,
      } as any;

    } catch (e) {
      setError("L'accès au micro/caméra a échoué ou le serveur d'appel n'est pas joignable.");
      setConnecting(false);
      setInCall(false);
    }
  };

  const handleHangUp = () => {
    wsRef.current?.close();
    localStream?.getTracks().forEach((track) => track.stop());
    setInCall(false);
    setLocalStream(null);
    setError(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-[#202c33] rounded-xl shadow-lg p-6 min-w-[320px] flex flex-col items-center max-w-[90vw] relative">
        <button className="absolute top-1 right-1 text-white hover:text-red-500" onClick={handleHangUp}>
          <X className="w-6 h-6" />
        </button>
        <div className="mb-3 mt-3">
          <img
            src={instructor.avatar}
            alt={instructor.name}
            className="w-20 h-20 rounded-full border-4 border-[#25d366] mb-2 object-cover"
          />
        </div>
        <div className="text-white text-base font-semibold mb-1">{instructor.name}</div>
        <div className="text-[#8696a0] text-sm mb-4">
          {type === "voice"
            ? connecting
              ? "Connexion à l'appel vocal en cours..."
              : inCall
              ? "Appel vocal en cours"
              : "Appel vocal terminé"
            : connecting
            ? "Connexion à la visio en cours..."
            : inCall
            ? "Appel vidéo en cours"
            : "Appel vidéo terminé"}
        </div>
        <div className="flex space-x-6 mb-2">
          <span className="inline-flex items-center justify-center w-10 h-10 bg-[#2a3942] rounded-full text-[#25d366]">
            {type === "voice" ? <Mic className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
          </span>
          {type === "video" && localStream && (
            <video
              autoPlay
              muted
              playsInline
              className="rounded-lg border-2 border-[#25d366] w-28 h-20 object-cover"
              ref={(ref) => {
                if (ref && localStream) ref.srcObject = localStream;
              }}
            />
          )}
        </div>
        {error && <div className="text-red-400 text-xs mb-2">{error}</div>}
        {connecting && <Loader2 className="animate-spin text-[#25d366] my-2" />}
        <Button
          onClick={handleHangUp}
          className="bg-red-600 hover:bg-red-700 w-14 h-14 p-0 rounded-full mt-3"
        >
          <X className="w-7 h-7" />
        </Button>
      </div>
    </div>
  );
};

export default LessonCallHandler;
