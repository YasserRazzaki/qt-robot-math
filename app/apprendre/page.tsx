"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import QTRobotReal from "@/components/qt-robot-real"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis"
import TrueFalseQuestion from "@/components/true-false-question"
import { useMathQuestions } from "@/hooks/use-math-questions"
import { AnimatePresence } from "framer-motion"

export default function ApprendrePage() {
  const [operation, setOperation] = useState("addition")
  const [firstNumber, setFirstNumber] = useState("")
  const [secondNumber, setSecondNumber] = useState("")
  const [userAnswer, setUserAnswer] = useState("")
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [explanation, setExplanation] = useState("")
  const [audioEnabled, setAudioEnabled] = useState(true)
  const { isListening, transcript, error, startListening, stopListening, isSupported } = useSpeechRecognition()
  const { speak, cancel, error: speechError, supported } = useSpeechSynthesis()
  const processingVoiceRef = useRef(false)

  const [showQuestion, setShowQuestion] = useState(false)
  const [questionResult, setQuestionResult] = useState<boolean | null>(null)
  const { currentQuestion, generateQuestion, clearQuestion } = useMathQuestions()
  const questionTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Traiter la reconnaissance vocale
  useEffect(() => {
    if (transcript && !processingVoiceRef.current) {
      processingVoiceRef.current = true
      console.log("Traitement de la transcription:", transcript)

      try {
        // Essayer de détecter une opération mathématique complète
        const operationRegex =
          /(\d+)\s*([+\-*x×÷/]|plus|moins|fois|divisé par)\s*(\d+)(?:\s*(?:égale?|fait|donne|est|vaut)\s*(\d+))?/i
        const match = transcript.match(operationRegex)

        if (match) {
          console.log("Match trouvé:", match)
          const num1 = match[1]
          const operatorSymbol = match[2]
          const num2 = match[3]
          const answer = match[4]

          console.log(`Opération détectée: ${num1} ${operatorSymbol} ${num2} = ${answer || "non spécifié"}`)

          // Déterminer l'opération
          let detectedOperation = "addition"
          if (operatorSymbol === "+" || operatorSymbol.toLowerCase().includes("plus")) {
            detectedOperation = "addition"
          } else if (operatorSymbol === "-" || operatorSymbol.toLowerCase().includes("moins")) {
            detectedOperation = "soustraction"
          } else if (
            operatorSymbol === "*" ||
            operatorSymbol === "x" ||
            operatorSymbol === "×" ||
            operatorSymbol.toLowerCase().includes("fois")
          ) {
            detectedOperation = "multiplication"
          } else if (
            operatorSymbol === "/" ||
            operatorSymbol === "÷" ||
            operatorSymbol.toLowerCase().includes("divisé")
          ) {
            detectedOperation = "division"
          }

          // Mettre à jour l'interface
          setOperation(detectedOperation)
          setFirstNumber(num1)
          setSecondNumber(num2)

          // Si une réponse a été donnée, la mettre à jour et vérifier
          if (answer) {
            setUserAnswer(answer)
            // Attendre que les états soient mis à jour avant de vérifier
            setTimeout(() => {
              handleCheckAnswer()
            }, 500)
          }
        } else {
          // Essayer de détecter juste un nombre (pour la réponse)
          const numberRegex =
            /(?:(?:la réponse|le résultat|ça fait|égale?|est|vaut)\s+)?(\d+)(?:\s*(?:la réponse|le résultat|ça fait|égale?|est|vaut))?/i
          const numberMatch = transcript.match(numberRegex)

          if (numberMatch && numberMatch[1]) {
            console.log("Nombre détecté:", numberMatch[1])
            setUserAnswer(numberMatch[1])
          }

          // Essayer de détecter des commandes simples
          const lowerTranscript = transcript.toLowerCase()

          if (
            lowerTranscript.includes("vérifie") ||
            lowerTranscript.includes("vérifier") ||
            lowerTranscript.includes("valider") ||
            lowerTranscript.includes("valide")
          ) {
            handleCheckAnswer()
          } else if (
            lowerTranscript.includes("nouveau") ||
            lowerTranscript.includes("recommencer") ||
            lowerTranscript.includes("reset") ||
            lowerTranscript.includes("effacer")
          ) {
            handleReset()
          } else if (lowerTranscript.includes("activer audio") || lowerTranscript.includes("activer le son")) {
            setAudioEnabled(true)
          } else if (lowerTranscript.includes("désactiver audio") || lowerTranscript.includes("couper le son")) {
            setAudioEnabled(false)
            cancel()
          }
        }
      } catch (error) {
        console.error("Erreur lors du traitement de la reconnaissance vocale:", error)
      } finally {
        processingVoiceRef.current = false
      }
    }
  }, [transcript, cancel])

  const calculateCorrectAnswer = () => {
    const num1 = Number.parseFloat(firstNumber)
    const num2 = Number.parseFloat(secondNumber)

    switch (operation) {
      case "addition":
        return num1 + num2
      case "soustraction":
        return num1 - num2
      case "multiplication":
        return num1 * num2
      case "division":
        return num1 / num2
      default:
        return 0
    }
  }

  const generateExplanation = (isCorrect, correctAnswer) => {
    const num1 = Number.parseFloat(firstNumber)
    const num2 = Number.parseFloat(secondNumber)
    const userAnswerNum = Number.parseFloat(userAnswer)

    if (isCorrect) {
      switch (operation) {
        case "addition":
          return `Super ! ${num1} + ${num2} = ${correctAnswer}. Pour additionner deux nombres, on ajoute les unités, puis les dizaines, puis les centaines. C'est comme si on regroupait tous les objets ensemble.`
        case "soustraction":
          return `Correct ! ${num1} - ${num2} = ${correctAnswer}. Pour soustraire, on enlève ${num2} de ${num1}. C'est comme si on retirait des objets d'un groupe.`
        case "multiplication":
          return `Excellent ! ${num1} × ${num2} = ${correctAnswer}. La multiplication est une addition répétée : ${num1} ajouté ${num2} fois. On peut aussi voir cela comme ${num2} groupes de ${num1} éléments.`
        case "division":
          return `Parfait ! ${num1} ÷ ${num2} = ${correctAnswer}. La division consiste à déterminer combien de fois ${num2} est contenu dans ${num1}. C'est comme si on partageait ${num1} objets en ${num2} groupes égaux.`
      }
    } else {
      let explanation = `La réponse correcte est ${correctAnswer}. `

      switch (operation) {
        case "addition":
          explanation += `Pour additionner ${num1} et ${num2}, on commence par les unités : ${num1 % 10} + ${num2 % 10} = ${(num1 % 10) + (num2 % 10)}, puis on passe aux dizaines et aux centaines si nécessaire.`
          break
        case "soustraction":
          explanation += `Pour soustraire ${num2} de ${num1}, on peut décomposer le calcul : ${num1} - ${num2} = ${correctAnswer}. La soustraction, c'est quand on enlève une quantité d'une autre.`
          break
        case "multiplication":
          explanation += `Pour multiplier ${num1} par ${num2}, on peut voir cela comme ${num1} ajouté ${num2} fois, ce qui donne ${correctAnswer}. Une autre façon de voir est de calculer ${num2} groupes de ${num1}.`
          break
        case "division":
          explanation += `Pour diviser ${num1} par ${num2}, on cherche combien de fois ${num2} est contenu dans ${num1}, ce qui donne ${correctAnswer}. La division, c'est partager équitablement une quantité.`
          break
      }

      return explanation
    }
  }

  const handleCheckAnswer = useCallback(() => {
    if (!firstNumber || !secondNumber || !userAnswer) {
      return
    }

    const correctAnswer = calculateCorrectAnswer()
    const userAnswerNum = Number.parseFloat(userAnswer)
    const correct = Math.abs(userAnswerNum - correctAnswer) < 0.001 // Pour gérer les erreurs d'arrondi

    setIsCorrect(correct)

    // Générer l'explication
    const explanationText = generateExplanation(correct, correctAnswer)
    setExplanation(explanationText)

    // Marquer la réponse comme vérifiée
    setIsAnswerChecked(true)

    // Lire le message complet (résultat + explication) en une seule fois
    if (audioEnabled && supported) {
      const fullMessage = correct
        ? `Bravo! C'est la bonne réponse! ${explanationText}`
        : `Ce n'est pas correct. Voyons pourquoi... ${explanationText}`

      speak(fullMessage)
    }
  }, [firstNumber, secondNumber, userAnswer, audioEnabled, supported, speak])

  const handleReset = useCallback(() => {
    // Annuler toute synthèse vocale en cours
    cancel()

    // Réinitialiser les états
    setUserAnswer("")
    setIsAnswerChecked(false)
    setIsCorrect(null)
    setExplanation("")

    // Petit délai pour s'assurer que tout est réinitialisé
    setTimeout(() => {
      console.log("Réinitialisation complète du calcul")
    }, 100)
  }, [cancel])

  const handleRandomQuestion = useCallback(() => {
    // Annuler toute synthèse vocale en cours
    cancel()

    // Générer une nouvelle question
    const question = generateQuestion(operation)
    setShowQuestion(true)

    // Lire la question à voix haute si l'audio est activé
    if (audioEnabled && supported) {
      speak(question.question)
    }
  }, [operation, generateQuestion, cancel, audioEnabled, speak, supported])

  const handleQuestionAnswer = useCallback(
    (isCorrect: boolean) => {
      setQuestionResult(isCorrect)

      // Lire le feedback à voix haute si l'audio est activé
      if (audioEnabled && supported) {
        const feedback = isCorrect
          ? "Bravo ! C'est la bonne réponse !"
          : `Pas tout à fait. La bonne réponse est "${currentQuestion?.correctAnswer ? "Vrai" : "Faux"}".`

        speak(feedback)
      }
    },
    [currentQuestion, audioEnabled, supported, speak],
  )

  const handleCloseQuestion = useCallback(() => {
    setShowQuestion(false)
    setQuestionResult(null)
    clearQuestion()
  }, [clearQuestion])

  const getOperationSymbol = () => {
    switch (operation) {
      case "addition":
        return "+"
      case "soustraction":
        return "-"
      case "multiplication":
        return "×"
      case "division":
        return "÷"
      default:
        return "+"
    }
  }

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const toggleAudio = () => {
    if (audioEnabled) {
      setAudioEnabled(false)
      cancel()
    } else {
      setAudioEnabled(true)
    }
  }

  useEffect(() => {
    // Poser une question aléatoire toutes les 2-3 minutes si l'utilisateur est actif
    // et qu'aucune question n'est en cours
    if (!showQuestion && !isAnswerChecked) {
      // Nettoyer tout timer existant
      if (questionTimerRef.current) {
        clearTimeout(questionTimerRef.current)
      }

      // Définir un nouveau timer pour poser une question
      const delay = Math.floor(Math.random() * 60000) + 60000 // Entre 1 et 2 minutes
      questionTimerRef.current = setTimeout(() => {
        // 30% de chance de poser une question
        if (Math.random() < 0.3 && firstNumber && secondNumber) {
          handleRandomQuestion()
        }
      }, delay)
    }

    return () => {
      if (questionTimerRef.current) {
        clearTimeout(questionTimerRef.current)
      }
    }
  }, [showQuestion, isAnswerChecked, handleRandomQuestion, firstNumber, secondNumber])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button asChild variant="ghost" className="flex items-center gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
            </Link>
          </Button>

          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={toggleAudio} className="relative">
                    {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{audioEnabled ? "Désactiver l'audio" : "Activer l'audio"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {isSupported && !isAnswerChecked && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isListening ? "destructive" : "outline"}
                      size="icon"
                      onClick={handleVoiceInput}
                      className="relative"
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      {isListening && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isListening
                      ? "Arrêter la reconnaissance vocale"
                      : "Activer la reconnaissance vocale pour dicter les opérations"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        {isListening && !isAnswerChecked && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              <Mic className="h-4 w-4 inline mr-2 animate-pulse" />
              Parlez maintenant... Dites par exemple "5 plus 3 égale 8" ou "Vérifier ma réponse"
            </p>
            {transcript && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">"{transcript}"</p>}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {speechError && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Problème avec la synthèse vocale: {speechError}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1">
            <Card className="p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Pratique des mathématiques avec QT Robot
              </h2>

              {!isAnswerChecked ? (
                <>
                  <div className="mb-6">
                    <Label className="text-base mb-2 block">Choisissez une opération :</Label>
                    <RadioGroup
                      value={operation}
                      onValueChange={setOperation}
                      className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="addition" id="addition" />
                        <Label htmlFor="addition">Addition (+)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="soustraction" id="soustraction" />
                        <Label htmlFor="soustraction">Soustraction (-)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="multiplication" id="multiplication" />
                        <Label htmlFor="multiplication">Multiplication (×)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="division" id="division" />
                        <Label htmlFor="division">Division (÷)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center mb-6">
                    <div className="sm:col-span-2">
                      <Label htmlFor="firstNumber" className="mb-2 block">
                        Premier nombre
                      </Label>
                      <Input
                        id="firstNumber"
                        type="number"
                        value={firstNumber}
                        onChange={(e) => setFirstNumber(e.target.value)}
                        placeholder="Ex: 12"
                        className="text-lg"
                      />
                    </div>
                    <div className="flex justify-center items-center">
                      <span className="text-2xl font-bold">{getOperationSymbol()}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="secondNumber" className="mb-2 block">
                        Deuxième nombre
                      </Label>
                      <Input
                        id="secondNumber"
                        type="number"
                        value={secondNumber}
                        onChange={(e) => setSecondNumber(e.target.value)}
                        placeholder="Ex: 7"
                        className="text-lg"
                      />
                    </div>
                  </div>

                  {/* Ajouter un bouton spécifique pour dicter la réponse */}
                  <div className="mb-6">
                    <Label htmlFor="userAnswer" className="mb-2 block">
                      Votre réponse
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="userAnswer"
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Entrez votre réponse"
                        className="text-lg flex-1"
                      />
                      {isSupported && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            // Fonction spécifique pour dicter uniquement la réponse
                            startListening()
                          }}
                          className="flex-shrink-0"
                          type="button"
                        >
                          <Mic className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={handleCheckAnswer}
                      className="flex-1"
                      disabled={!firstNumber || !secondNumber || !userAnswer}
                    >
                      Vérifier ma réponse
                    </Button>
                    <Button variant="secondary" onClick={handleRandomQuestion} disabled={showQuestion} className="ml-2">
                      Question
                    </Button>

                    {isSupported && (
                      <Button
                        variant="outline"
                        onClick={handleVoiceInput}
                        className={`${isListening ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800" : ""}`}
                      >
                        {isListening ? "Arrêter l'écoute" : "Dicter à voix haute"}
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={`p-6 mb-6 rounded-lg ${isCorrect ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"}`}
                  >
                    <h3
                      className={`text-xl font-bold mb-2 ${isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}
                    >
                      {isCorrect ? "Bravo !" : "Pas tout à fait..."}
                    </h3>
                    <div className="text-lg mb-4">
                      <span className="font-medium">
                        {firstNumber} {getOperationSymbol()} {secondNumber} ={" "}
                      </span>
                      <span
                        className={
                          isCorrect
                            ? "text-green-600 dark:text-green-400 font-bold"
                            : "text-red-600 dark:text-red-400 font-bold line-through mr-2"
                        }
                      >
                        {userAnswer}
                      </span>
                      {!isCorrect && (
                        <span className="text-green-600 dark:text-green-400 font-bold">{calculateCorrectAnswer()}</span>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{explanation}</p>
                  </div>

                  <div className="flex justify-center">
                    <Button onClick={handleReset} className="w-full max-w-xs">
                      Nouveau calcul
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </div>

          <div className="order-1 lg:order-2 flex justify-center">
            <QTRobotReal
              isCorrect={isCorrect}
              isAnswerChecked={isAnswerChecked}
              operation={operation}
              explanation={explanation}
              audioEnabled={audioEnabled}
              isAskingQuestion={showQuestion}
              questionResult={questionResult}
            />
          </div>
        </div>
        {/* Modal pour les questions vrai/faux */}
        <AnimatePresence>
          {showQuestion && currentQuestion && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <TrueFalseQuestion
                question={currentQuestion.question}
                correctAnswer={currentQuestion.correctAnswer}
                onAnswer={handleQuestionAnswer}
                onClose={handleCloseQuestion}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

