import { useState, useCallback, useRef, useEffect } from 'react';

type SpeechRecognitionStatus = 'ready' | 'listening' | 'processing' | 'not-supported';

interface UseSpeechRecognitionReturn {
  interimText: string;
  status: SpeechRecognitionStatus;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  onFinalResult: (text: string) => void;
}

export function useSpeechRecognition(
  language: string = 'bn-BD',
  onFinalResult: (text: string) => void
): Omit<UseSpeechRecognitionReturn, 'onFinalResult'> {
  const [interimText, setInterimText] = useState('');
  const [status, setStatus] = useState<SpeechRecognitionStatus>('ready');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus('not-supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    let lastFinalTranscript = '';

    recognition.onstart = () => {
      isListeningRef.current = true;
      lastFinalTranscript = '';
      setStatus('listening');
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let currentFinalTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          currentFinalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      if (currentFinalTranscript && currentFinalTranscript !== lastFinalTranscript) {
        let newText = currentFinalTranscript;
        
        // Check if the new transcript builds upon the old one (common in continuous mode)
        if (currentFinalTranscript.toLowerCase().startsWith(lastFinalTranscript.toLowerCase())) {
          newText = currentFinalTranscript.substring(lastFinalTranscript.length);
        }
        
        if (newText.trim()) {
          onFinalResult(newText);
        }
        lastFinalTranscript = currentFinalTranscript;
      }
      
      setInterimText(interimTranscript);
    };

    recognition.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`);
      setStatus('ready');
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      setInterimText('');
      setStatus('ready');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, onFinalResult]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListeningRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Start listening error:', e);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListeningRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  return {
    interimText,
    status,
    error,
    startListening,
    stopListening,
  };
}
