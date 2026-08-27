import { useCallback, useEffect, useRef, useState } from "react";

const getSpeechRecognition = () =>
  window.SpeechRecognition || window.webkitSpeechRecognition;

const pickIndianVoice = () => {
  const voices = speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === "en-IN") ||
    voices.find((v) => v.lang.startsWith("en-IN")) ||
    voices.find((v) => /india|neerja|ravi/i.test(v.name)) ||
    voices.find((v) => v.lang.startsWith("en-GB")) ||
    voices.find((v) => v.lang.startsWith("en"))
  );
};

export function useSpeech(options = {}) {
  const { speed = 0.92, language = "en-IN" } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");

  const recognitionRef = useRef(null);
  const lastFinalIndexRef = useRef(-1);
  const speakQueueRef = useRef([]);
  const isSpeakingRef = useRef(false);

  useEffect(() => {
    const loadVoices = () => pickIndianVoice();
    loadVoices();
    speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      speechSynthesis.cancel();
      recognitionRef.current?.abort();
    };
  }, []);

  const processSpeakQueue = useCallback(() => {
    if (isSpeakingRef.current || speakQueueRef.current.length === 0) return;

    const text = speakQueueRef.current.shift();
    if (!text?.trim()) {
      processSpeakQueue();
      return;
    }

    speechSynthesis.cancel();
    isSpeakingRef.current = true;
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = speed;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voice = pickIndianVoice();
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      isSpeakingRef.current = false;
      setIsSpeaking(false);
      processSpeakQueue();
    };

    utterance.onerror = () => {
      isSpeakingRef.current = false;
      setIsSpeaking(false);
      processSpeakQueue();
    };

    speechSynthesis.speak(utterance);
  }, []);

  const speak = useCallback(
    (text) => {
      if (!text?.trim()) return;
      speakQueueRef.current.push(text);
      processSpeakQueue();
    },
    [processSpeakQueue]
  );

  const stopSpeaking = useCallback(() => {
    speakQueueRef.current = [];
    speechSynthesis.cancel();
    isSpeakingRef.current = false;
    setIsSpeaking(false);
  }, []);

  const startListening = useCallback((onFinalText) => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    lastFinalIndexRef.current = -1;

    recognition.onstart = () => {
      setIsListening(true);
      setInterimText("");
    };

    recognition.onresult = (event) => {
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript.trim();

        if (result.isFinal) {
          if (i > lastFinalIndexRef.current && transcript) {
            lastFinalIndexRef.current = i;
            onFinalText(transcript);
          }
        } else {
          interim += `${transcript} `;
        }
      }

      setInterimText(interim.trim());
    };

    recognition.onerror = (event) => {
      if (event.error !== "aborted" && event.error !== "no-speech") {
        console.error("Speech recognition error:", event.error);
      }
      setIsListening(false);
      setInterimText("");
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText("");
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (error) {
      console.error("Failed to start recognition:", error);
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimText("");
  }, []);

  return {
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    isSpeaking,
    isListening,
    interimText,
  };
}
