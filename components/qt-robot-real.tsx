"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface QTRobotProps {
  isCorrect?: boolean | null
  isAnswerChecked?: boolean
  operation?: string
  explanation?: string
  isHomepage?: boolean
}

export default function QTRobotReal({
  isCorrect = null,
  isAnswerChecked = false,
  operation = "addition",
  explanation = "",
  isHomepage = false,
}: QTRobotProps) {
  const [speaking, setSpeaking] = useState(false)
  const [message, setMessage] = useState("")
  const [hover, setHover] = useState(false)
  const [expression, setExpression] = useState("initial")

  // Gérer les expressions faciales en fonction de l'état
  useEffect(() => {
    if (isHomepage) {
      setExpression(hover ? "happy" : "initial")
    } else {
      if (isCorrect === true) {
        setExpression("happy")
      } else if (isCorrect === false) {
        setExpression("sad")
      } else {
        setExpression("initial")
      }
    }
  }, [isCorrect, hover, isHomepage])

  // Gérer les messages du robot
  useEffect(() => {
    if (isHomepage) {
      if (Math.random() > 0.7 || hover) {
        const messages = hover
          ? ["Salut! Tu veux apprendre les maths avec moi?", "Clique sur moi pour commencer!"]
          : ["Bonjour! Je suis QT Robot!", "Je peux t'aider à apprendre les maths!"]
        setMessage(messages[Math.floor(Math.random() * messages.length)])
        setSpeaking(true)
        const timer = setTimeout(() => setSpeaking(false), 3000)
        return () => clearTimeout(timer)
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
        setMessage(randomMessage)
        setSpeaking(true)
        const timer = setTimeout(() => setSpeaking(false), 3000)
        return () => clearTimeout(timer)
      }
    } else if (isCorrect === true) {
      setMessage("Bravo! C'est la bonne réponse!")
      setSpeaking(true)
    } else if (isCorrect === false) {
      setMessage("Ce n'est pas correct. Voyons pourquoi...")
      setSpeaking(true)
    }
  }, [isCorrect, isAnswerChecked, operation, hover, isHomepage])

  // Afficher l'explication
  useEffect(() => {
    if (explanation && isAnswerChecked) {
      const timer = setTimeout(() => {
        setSpeaking(true)
        setMessage(explanation)
        const hideTimer = setTimeout(() => setSpeaking(false), 5000)
        return () => clearTimeout(hideTimer)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [explanation, isAnswerChecked])

  // Fonction pour obtenir l'image d'expression faciale
  // const getFaceImage = () => {
  //   if (speaking) {
  //     return "/qt-faces/initial.png" // Utiliser l'expression initiale pendant que le robot parle
  //   }
  //   return `/qt-faces/${expression}.png`
  // }

  return (
    <div
      className={`relative ${isHomepage ? "w-full h-full flex justify-end" : "w-full max-w-[400px]"}`}
      onMouseEnter={() => isHomepage && setHover(true)}
      onMouseLeave={() => isHomepage && setHover(false)}
    >
      <motion.div
        className="relative"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
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
        {speaking && (
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

