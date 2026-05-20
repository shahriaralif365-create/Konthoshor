import { useState, useCallback, useRef, useEffect } from 'react';

type SpeechRecognitionStatus = 'ready' | 'listening' | 'restarting' | 'processing' | 'not-supported';

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
  const interimTextRef = useRef('');
  const silenceTimeoutRef = useRef<any>(null);

  // Keep stable refs to variables so event handlers always have access to fresh closures
  const onFinalResultRef = useRef(onFinalResult);
  useEffect(() => {
    onFinalResultRef.current = onFinalResult;
  }, [onFinalResult]);

  // 1. One-time initialization of persistent SpeechRecognition instance
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
    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.error('Abort cleanup error:', e);
        }
      }
    };
  }, []);

  // 2. React dynamically to language changes and re-bind event handlers cleanly
  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    // Dynamically update the language without recreating the object!
    recognition.lang = language;

    recognition.onstart = () => {
      isListeningRef.current = true;
      lastProcessedIndexRef.current = -1;
      interimTextRef.current = '';
      setStatus('listening');
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          if (i > lastProcessedIndexRef.current) {
            onFinalResultRef.current(transcript);
            lastProcessedIndexRef.current = i;
          }
        } else {
          interimTranscript += transcript;
        }
      }
      
      interimTextRef.current = interimTranscript;
      setInterimText(interimTranscript);

      // Auto-commit on 1 second of silence
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      if (interimTranscript) {
        silenceTimeoutRef.current = setTimeout(() => {
          if (interimTextRef.current) {
            onFinalResultRef.current(interimTextRef.current);
            interimTextRef.current = '';
            setInterimText('');
          }
        }, 1000);
      }
    };

    recognition.onerror = (event: any) => {
      if (shouldBeListeningRef.current && (event.error === 'no-speech' || event.error === 'aborted')) {
        return; // Ignore these if we're trying to stay active
      }
      setError(`Speech recognition error: ${event.error}`);
      if (!shouldBeListeningRef.current) {
        setStatus('ready');
      }
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      
      // Auto-finalize any remaining interim text on engine stop so it is never lost
      if (interimTextRef.current) {
        onFinalResultRef.current(interimTextRef.current);
        interimTextRef.current = '';
        setInterimText('');
      }

      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      
      // If we are supposed to be active, trigger a clean restart
      if (shouldBeListeningRef.current) {
        try {
          recognition.start();
          isListeningRef.current = true;
          setStatus('listening');
          return;
        } catch (e) {
          console.error('Restart failed:', e);
        }
      }
      
      setInterimText('');
      setStatus('ready');
    };

    // If the language changed while active, cleanly trigger a stop-restart cycle on the SAME instance!
    if (isListeningRef.current) {
      setStatus('restarting');
      try {
        recognition.stop();
      } catch (e) {
        console.error('Stop during language change error:', e);
      }
    }
  }, [language]);

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
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Stop listening error:', e);
      }
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
