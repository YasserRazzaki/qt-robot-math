"use client"

import { useState, useEffect, useCallback } from "react"

// Définir le type pour l'API SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResult {
  transcript: string
  confidence: number
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [recognition, setRecognition] = useState<any>(null)

  useEffect(() => {
    // Vérifier si l'API est disponible dans le navigateur
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = false
        recognitionInstance.interimResults = false
        recognitionInstance.lang = "fr-FR"

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          const result = event.results[0][0] as SpeechRecognitionResult
          const transcriptText = result.transcript.trim()
          console.log("Transcription brute:", transcriptText) // Pour le débogage
          setTranscript(transcriptText)
        }

        recognitionInstance.onerror = (event: any) => {
          setError(`Erreur de reconnaissance vocale: ${event.error}`)
          setIsListening(false)
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
        }

        setRecognition(recognitionInstance)
      } else {
        setError("La reconnaissance vocale n'est pas prise en charge par votre navigateur.")
      }
    }

    return () => {
      if (recognition) {
        recognition.abort()
      }
    }
  }, [])

  const startListening = useCallback(() => {
    if (recognition) {
      setTranscript("")
      setError(null)
      setIsListening(true)
      recognition.start()
    }
  }, [recognition])

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)
    }
  }, [recognition])

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    isSupported: !!recognition,
  }
}

