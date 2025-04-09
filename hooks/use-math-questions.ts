"use client"

import { useState, useCallback } from "react"

interface MathQuestion {
  question: string
  correctAnswer: boolean
  operation: string
}

export function useMathQuestions() {
  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion | null>(null)

  // Générer une question vrai/faux basée sur l'opération actuelle
  const generateQuestion = useCallback((operation: string, difficulty = 1) => {
    // Générer des nombres aléatoires en fonction de la difficulté
    const max = difficulty === 1 ? 10 : difficulty === 2 ? 20 : 100
    const num1 = Math.floor(Math.random() * max) + 1
    const num2 = Math.floor(Math.random() * max) + 1

    // Calculer la réponse correcte
    let correctResult: number
    let operationSymbol: string

    switch (operation) {
      case "addition":
        correctResult = num1 + num2
        operationSymbol = "+"
        break
      case "soustraction":
        correctResult = num1 - num2
        operationSymbol = "-"
        break
      case "multiplication":
        correctResult = num1 * num2
        operationSymbol = "×"
        break
      case "division":
        // Éviter les divisions avec reste pour les enfants
        correctResult = num1
        operationSymbol = "÷"
        // Ajuster num2 pour que la division soit exacte
        const temp = num1
        const num1_mutable = temp * num2
        num1 = num1_mutable
        break
      default:
        correctResult = num1 + num2
        operationSymbol = "+"
    }

    // Décider si la question sera vraie ou fausse (50% de chance)
    const isTrue = Math.random() > 0.5

    // Si la question est fausse, générer un résultat incorrect
    let shownResult: number
    if (isTrue) {
      shownResult = correctResult
    } else {
      // Générer un résultat incorrect qui est proche du résultat correct
      const offset = Math.floor(Math.random() * 5) + 1
      shownResult = Math.random() > 0.5 ? correctResult + offset : correctResult - offset

      // S'assurer que le résultat incorrect n'est pas négatif pour la soustraction
      if (operation === "soustraction" && shownResult < 0) {
        shownResult = correctResult + offset
      }
    }

    // Créer la question
    const question = `${num1} ${operationSymbol} ${num2} = ${shownResult}. Est-ce vrai ou faux ?`

    const newQuestion: MathQuestion = {
      question,
      correctAnswer: isTrue,
      operation,
    }

    setCurrentQuestion(newQuestion)
    return newQuestion
  }, [])

  // Effacer la question actuelle
  const clearQuestion = useCallback(() => {
    setCurrentQuestion(null)
  }, [])

  return {
    currentQuestion,
    generateQuestion,
    clearQuestion,
  }
}

