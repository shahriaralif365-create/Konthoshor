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
  const shouldBeListeningRef = useRef(false);
  const lastProcessedIndexRef = useRef(-1);

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
      lastProcessedIndexRef.current = -1;
      setStatus('listening');
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      
      // Using resultIndex is generally more reliable across different browsers
      // especially on mobile, as it tells us where the new results start.
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          // Only process this index if we haven't already processed it as final
          if (i > lastProcessedIndexRef.current) {
            onFinalResult(transcript);
            lastProcessedIndexRef.current = i;
          }
        } else {
          interimTranscript += transcript;
        }
      }
      
      setInterimText(interimTranscript);
    };

    recognition.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`);
      setStatus('ready');
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      
      // If it stopped but we intended it to be listening (common on mobile), restart it
      if (shouldBeListeningRef.current) {
        try {
          recognition.start();
          isListeningRef.current = true;
          return; // Don't reset state if we're restarting
        } catch (e) {
          console.error('Restart failed:', e);
        }
      }
      
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
        shouldBeListeningRef.current = true;
        recognitionRef.current.start();
      } catch (e) {
        console.error('Start listening error:', e);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    shouldBeListeningRef.current = false;
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
