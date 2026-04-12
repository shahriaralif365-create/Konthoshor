import { useState, useCallback, useRef, useEffect } from 'react';

type SpeechRecognitionStatus = 'ready' | 'listening' | 'processing' | 'not-supported';

interface UseSpeechRecognitionReturn {
  text: string;
  interimText: string;
  status: SpeechRecognitionStatus;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetText: () => void;
}

export function useSpeechRecognition(language: string = 'bn-BD'): UseSpeechRecognitionReturn {
  const [text, setText] = useState('');
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

    recognition.onstart = () => {
      isListeningRef.current = true;
      setStatus('listening');
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Update final text
      if (finalTranscript) {
        setText((prev: string) => prev + (prev ? ' ' : '') + finalTranscript);
        setInterimText(''); // Clear interim when final result arrives
      }
      
      // Update interim text for real-time display
      if (interimTranscript) {
        setInterimText(interimTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`);
      setStatus('ready');
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      setInterimText(''); // Clear interim text when recognition ends
      setStatus('ready');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListeningRef.current) {
      recognitionRef.current.start();
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListeningRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const resetText = useCallback(() => {
    setText('');
    setInterimText('');
    setError(null);
  }, []);

  return {
    text,
    interimText,
    status: status === 'not-supported' ? 'not-supported' : status,
    error,
    startListening,
    stopListening,
    resetText,
  };
}
