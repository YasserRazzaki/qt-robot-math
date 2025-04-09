"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis"

interface QTRobotProps {
  isCorrect?: boolean | null
  isAnswerChecked?: boolean
  operation?: string
  explanation?: string
  isHomepage?: boolean
  audioEnabled?: boolean
  isAskingQuestion?: boolean
  questionResult?: boolean | null
}

export default function QTRobotReal({
  isCorrect = null,
  isAnswerChecked = false,
  operation = "addition",
  explanation = "",
  isHomepage = false,
  audioEnabled = true,
  isAskingQuestion = false,
  questionResult = null,
}: QTRobotProps) {
  const [showBubble, setShowBubble] = useState(false)
  const [message, setMessage] = useState("")
  const [hover, setHover] = useState(false)
  const [expression, setExpression] = useState("initial")
  const { speak, cancel, speaking, supported, error } = useSpeechSynthesis()
  const bubbleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [lastSpokenText, setLastSpokenText] = useState("")

  // Gérer les expressions faciales en fonction de l'état
  useEffect(() => {
    if (isHomepage) {
      setExpression(hover ? "happy" : "initial")
    } else if (isAskingQuestion) {
      // Expression curieuse quand le robot pose une question
      setExpression(questionResult === null ? "initial" : questionResult ? "happy" : "sad")
    } else {
      if (isCorrect === true) {
        setExpression("happy")
      } else if (isCorrect === false) {
        setExpression("sad")
      } else {
        setExpression("initial")
      }
    }
  }, [isCorrect, hover, isHomepage, isAskingQuestion, questionResult])

  // Fonction pour afficher un message dans la bulle
  const showMessage = (text: string, duration = 4000, shouldSpeak = false) => {
    // Nettoyer tout timer existant
    if (bubbleTimerRef.current) {
      clearTimeout(bubbleTimerRef.current)
      bubbleTimerRef.current = null
    }

    // Afficher le message
    setMessage(text)
    setShowBubble(true)

    // Parler si nécessaire - Nous ne parlons plus ici car la parole est gérée dans la page principale
    if (shouldSpeak && audioEnabled && supported && text !== lastSpokenText && !isAnswerChecked) {
      speak(text)
      setLastSpokenText(text)
    }

    // Masquer la bulle après la durée spécifiée
    bubbleTimerRef.current = setTimeout(() => {
      setShowBubble(false)
    }, duration)
  }

  // Gérer les messages du robot
  useEffect(() => {
    if (isHomepage) {
      if (hover) {
        const messages = ["Salut! Tu veux apprendre les maths avec moi?", "Clique sur moi pour commencer!"]
        const randomMessage = messages[Math.floor(Math.random() * messages.length)]
        showMessage(randomMessage)
      } else if (showBubble) {
        // Si la bulle est affichée mais qu'on n'est plus en hover, la cacher
        setShowBubble(false)
      }
    } else if (!isAnswerChecked) {
      // Messages d'encouragement aléatoires
      const encouragements = [
        "Choisis une opération et entre tes nombres!",
        "Je suis prêt à t'aider avec les maths!",
        "Essaie de résoudre le calcul par toi-même d'abord!",
        `Pratiquons les ${operation}s ensemble!`,
        "Les maths sont amusantes avec de la pratique!",
      ]

      if (Math.random() > 0.7) {
        const randomMessage = encouragements[Math.floor(Math.random() * encouragements.length)]
        showMessage(randomMessage)
      }
    } else if (isCorrect === true) {
      const successMessage = "Bravo! C'est la bonne réponse!"
      showMessage(successMessage, 4000)
    } else if (isCorrect === false) {
      const errorMessage = "Ce n'est pas correct. Voyons pourquoi..."
      showMessage(errorMessage, 4000)
    }

    return () => {
      if (bubbleTimerRef.current) {
        clearTimeout(bubbleTimerRef.current)
      }
    }
  }, [isCorrect, isAnswerChecked, operation, hover, isHomepage, audioEnabled, supported, showBubble])

  // Gérer l'explication
  useEffect(() => {
    if (explanation && isAnswerChecked) {
      // Afficher l'explication dans la bulle
      showMessage(explanation, 8000)
    }
  }, [explanation, isAnswerChecked])

  // Annuler la synthèse vocale si l'audio est désactivé
  useEffect(() => {
    if (!audioEnabled && speaking) {
      cancel()
    }
  }, [audioEnabled, speaking, cancel])

  // Réinitialiser le dernier texte parlé lorsque isAnswerChecked devient false
  useEffect(() => {
    if (!isAnswerChecked) {
      setLastSpokenText("")
    }
  }, [isAnswerChecked])

  return (
    <div
      className={`relative ${isHomepage ? "w-full h-full flex justify-end" : "w-full max-w-[400px]"}`}
      onMouseEnter={() => isHomepage && setHover(true)}
      onMouseLeave={() => isHomepage && setHover(false)}
    >
      <motion.div
        className="relative"
        animate={isHomepage ? {} : { y: [0, -10, 0] }}
        transition={
          isHomepage
            ? {}
            : {
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }
        }
        whileHover={isHomepage ? { scale: 1.05, y: -10 } : {}}
      >
        {/* Robot principal - Image complète sans manipulation */}
        <div className="relative">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mPxPrXC43PxNdzoHPXLsRQp6tskmBv.png"
            alt="QT Robot"
            width={isHomepage ? 450 : 400}
            height={isHomepage ? 800 : 700}
            className="object-contain"
            priority
          />

          {/* Écran facial animé (uniquement sur la page de calcul) */}
          {!isHomepage && (
            <motion.div
              className="absolute top-[11%] left-[56.5%] transform -translate-x-1/2 w-[53%] h-[14%] bg-white rounded-lg overflow-hidden"
              style={{ boxShadow: "0 0 5px rgba(0,0,0,0.1)" }}
            >
              <div className="w-full h-full relative flex items-center justify-center">
                <Image
                  src={`/qt-faces/${expression}.png`}
                  alt={`QT Robot ${expression} expression`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          )}

          {/* Écran de poitrine animé */}
          {!isHomepage && (
            <motion.div
              className="absolute top-[55%] left-[50%] transform -translate-x-1/2 w-[30%] h-[15%] bg-blue-900 rounded-lg overflow-hidden border-2 border-blue-300 flex items-center justify-center"
              animate={{
                borderColor: isCorrect === true ? "#22c55e" : isCorrect === false ? "#ef4444" : "#3b82f6",
              }}
            >
              <div className="w-full h-full flex flex-col items-center justify-center p-1 text-white text-xs font-mono">
                {isCorrect === true ? (
                  <span className="text-green-400">✓ Correct!</span>
                ) : isCorrect === false ? (
                  <span className="text-red-400">✗ Incorrect</span>
                ) : (
                  <span className="bg-blue-700 px-2 py-1 rounded text-center w-full">{operation}</span>
                )}

                {!isAnswerChecked && (
                  <motion.div
                    className="text-white text-xs mt-1"
                    animate={{
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    {operation === "addition" && "+ + +"}
                    {operation === "soustraction" && "- - -"}
                    {operation === "multiplication" && "× × ×"}
                    {operation === "division" && "÷ ÷ ÷"}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Bulle de dialogue */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            className={`absolute ${
              isHomepage ? "top-10 right-10" : "-top-10 right-0"
            } bg-white dark:bg-slate-700 p-4 rounded-2xl shadow-lg max-w-[280px] z-30`}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
          >
            <div className="text-gray-800 dark:text-white font-medium text-sm">{message}</div>
            <div
              className={`absolute -bottom-3 ${
                isHomepage ? "left-5" : "left-10"
              } w-6 h-6 bg-white dark:bg-slate-700 transform rotate-45`}
            ></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

