"use client"

import { useState, useEffect, useCallback } from "react"

export function useSpeechSynthesis() {
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  // Vérifier si l'API est disponible et charger les voix
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSupported(true)

      // Fonction pour charger les voix
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        if (availableVoices && availableVoices.length > 0) {
          setVoices(availableVoices)
          console.log(`Voix chargées: ${availableVoices.length}`)

          // Afficher les voix disponibles pour le débogage
          availableVoices.forEach((voice, index) => {
            console.log(`Voix ${index}: ${voice.name} (${voice.lang}) - ${voice.localService ? "Locale" : "Distante"}`)
          })
        }
      }

      // Charger les voix immédiatement
      loadVoices()

      // Et aussi lors de l'événement voiceschanged
      window.speechSynthesis.onvoiceschanged = loadVoices
    } else {
      setSupported(false)
      setError("La synthèse vocale n'est pas prise en charge par ce navigateur")
    }
  }, [])

  // Fonction pour trouver la meilleure voix (préférence pour une voix d'enfant en français)
  const findBestVoice = useCallback(() => {
    if (!voices || voices.length === 0) return null

    // Rechercher une voix d'enfant en français
    const childVoice = voices.find(
      (voice) =>
        voice.lang.includes("fr") &&
        (voice.name.toLowerCase().includes("enfant") ||
          voice.name.toLowerCase().includes("child") ||
          voice.name.toLowerCase().includes("kid")),
    )

    if (childVoice) {
      console.log(`Voix d'enfant trouvée: ${childVoice.name}`)
      return childVoice
    }

    // Sinon, chercher une voix française
    const frenchVoice = voices.find((voice) => voice.lang.includes("fr"))
    if (frenchVoice) {
      console.log(`Voix française trouvée: ${frenchVoice.name}`)
      return frenchVoice
    }

    // En dernier recours, utiliser la première voix disponible
    console.log(`Aucune voix française trouvée, utilisation de la première voix: ${voices[0]?.name}`)
    return voices[0]
  }, [voices])

  // Fonction simplifiée pour parler
  const speak = useCallback(
    (text: string) => {
      if (!supported) {
        console.warn("La synthèse vocale n'est pas prise en charge")
        return false
      }

      try {
        // Annuler toute synthèse vocale en cours
        window.speechSynthesis.cancel()

        // Créer un nouvel objet d'énoncé
        const utterance = new SpeechSynthesisUtterance(text)

        // Configurer les événements
        utterance.onstart = () => setSpeaking(true)
        utterance.onend = () => setSpeaking(false)
        utterance.onerror = (event) => {
          console.error("Erreur de synthèse vocale:", event)
          setError("Erreur lors de la synthèse vocale")
          setSpeaking(false)
        }

        // Trouver la meilleure voix
        const selectedVoice = findBestVoice()
        if (selectedVoice) {
          utterance.voice = selectedVoice
        }

        // Configurer la langue et les paramètres
        utterance.lang = "fr-FR"
        utterance.rate = 0.9
        utterance.pitch = 1.2 // Légèrement plus aigu pour simuler une voix d'enfant

        // Lancer la synthèse vocale
        window.speechSynthesis.speak(utterance)
        return true
      } catch (err) {
        console.error("Erreur lors de la synthèse vocale:", err)
        setError(`Erreur: ${err.message || "Erreur inconnue"}`)
        setSpeaking(false)
        return false
      }
    },
    [supported, findBestVoice],
  )

  // Fonction pour annuler la synthèse vocale
  const cancel = useCallback(() => {
    if (!supported) return false

    try {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return true
    } catch (err) {
      console.error("Erreur lors de l'annulation de la synthèse vocale:", err)
      return false
    }
  }, [supported])

  return {
    speak,
    cancel,
    speaking,
    supported,
    error,
    isReady: supported && voices.length > 0,
  }
}

