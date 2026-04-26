import { useState, useRef, useEffect } from 'react';

const PREFERRED_MIME_TYPES = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg'];

const isSafariBrowser = (): boolean =>
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export interface UseAudioRecorderReturn {
  /** URL de l'enregistrement prêt à lire (null si pas encore enregistré) */
  audioUrl: string | null;
  /** Vrai pendant l'enregistrement actif */
  isRecording: boolean;
  /** Vrai pendant l'initialisation du microphone */
  isInitializingMic: boolean;
  /** Démarre un nouvel enregistrement */
  startRecording: () => Promise<void>;
  /** Arrête l'enregistrement et produit l'audioUrl */
  stopRecording: () => void;
  /** Annule l'enregistrement en cours ET efface l'audioUrl existant */
  discardAudio: () => void;
  /** Efface l'audioUrl et libère le stream (ex: validation de phrase) */
  resetAudio: () => void;
}

export const useAudioRecorder = (): UseAudioRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [isInitializingMic, setIsInitializingMic] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainedStreamRef = useRef<MediaStream | null>(null);

  // ─── Libération complète des ressources audio ────────────────────────────
  const releaseStream = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    gainedStreamRef.current = null;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
  };

  // ─── Revoke URL + release ────────────────────────────────────────────────
  const revokeUrl = () => {
    setAudioUrl(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  };

  // ─── Arrêt silencieux du MediaRecorder (sans déclencher onstop) ──────────
  const silentStop = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // ─── Init microphone (toujours un nouveau stream — destroy-and-reinit) ───
  const initMicrophoneStream = async (): Promise<boolean> => {
    setIsInitializingMic(true);
    // Sur Safari/iOS, autoGainControl peut réduire le signal en amont de notre GainNode
    // → on le désactive pour laisser le contrôle du gain à notre chaîne Web Audio
    const safari = isSafariBrowser();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: !safari,
        },
      });
      streamRef.current = stream;
      return true;
    } catch (err) {
      console.error("Erreur d'accès au microphone:", err);
      alert("Impossible d'accéder au microphone. Veuillez vérifier vos autorisations.");
      return false;
    } finally {
      setIsInitializingMic(false);
    }
  };

  // ─── Chaîne Web Audio : micro → GainNode → MediaRecorder ────────────────
  const buildGainedStream = (rawStream: MediaStream): MediaStream => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return rawStream;

      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(rawStream);
      const gainNode = ctx.createGain();
      // Boost uniquement sur Safari/iOS (micro faible) ; Chrome/Firefox ont déjà un bon niveau
      gainNode.gain.value = isSafariBrowser() ? 4.0 : 1.0;

      const destination = ctx.createMediaStreamDestination();
      source.connect(gainNode);
      gainNode.connect(destination);

      gainedStreamRef.current = destination.stream;
      return destination.stream;
    } catch (e) {
      console.warn('Web Audio non disponible, enregistrement sans boost:', e);
      return rawStream;
    }
  };

  // ─── API publique ────────────────────────────────────────────────────────

  const startRecording = async () => {
    const ok = await initMicrophoneStream();
    if (!ok || !streamRef.current) return;

    audioChunksRef.current = [];

    const recordingStream = buildGainedStream(streamRef.current);

    const mimeType = PREFERRED_MIME_TYPES.find(t => MediaRecorder.isTypeSupported(t)) || '';
    try {
      mediaRecorderRef.current = new MediaRecorder(
        recordingStream,
        mimeType ? { mimeType, audioBitsPerSecond: 128000 } : { audioBitsPerSecond: 128000 }
      );
    } catch {
      mediaRecorderRef.current = new MediaRecorder(recordingStream);
    }

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const recordedMime = mediaRecorderRef.current?.mimeType || mimeType || 'audio/mp4';
      const blob = new Blob(audioChunksRef.current, { type: recordedMime });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
    setAudioUrl(null);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const discardAudio = () => {
    silentStop();
    revokeUrl();
    releaseStream();
  };

  const resetAudio = () => {
    silentStop();
    revokeUrl();
    releaseStream();
  };

  // ─── Cleanup au démontage ────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      silentStop();
      releaseStream();
      setAudioUrl(prev => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    audioUrl,
    isRecording,
    isInitializingMic,
    startRecording,
    stopRecording,
    discardAudio,
    resetAudio,
  };
};
