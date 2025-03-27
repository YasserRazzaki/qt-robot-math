"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function MathRobot({ isCorrect, isAnswerChecked, operation, explanation }) {
  const [speaking, setSpeaking] = useState(false)
  const [message, setMessage] = useState("")
  const [blinking, setBlinking] = useState(false)

  // Effet de clignotement aléatoire des yeux
  useEffect(() => {
    const blinkInterval = setInterval(
      () => {
        setBlinking(true)
        setTimeout(() => setBlinking(false), 200)
      },
      Math.random() * 3000 + 2000,
    )

    return () => clearInterval(blinkInterval)
  }, [])

  useEffect(() => {
    if (!isAnswerChecked) {
      // Messages d'encouragement aléatoires quand l'utilisateur n'a pas encore répondu
      const encouragements = [
        "Choisis une opération et entre tes nombres!",
        "Je suis prêt à t'aider avec les maths!",
        "Essaie de résoudre le calcul par toi-même d'abord!",
        `Pratiquons les ${operation}s ensemble!`,
        "Les maths sont amusantes avec de la pratique!",
      ]

      const randomMessage = encouragements[Math.floor(Math.random() * encouragements.length)]
      setMessage(randomMessage)
      setSpeaking(true)

      const timer = setTimeout(() => {
        setSpeaking(false)
      }, 4000)

      return () => clearTimeout(timer)
    } else if (isCorrect === true) {
      setMessage("Bravo! C'est la bonne réponse!")
      setSpeaking(true)
    } else if (isCorrect === false) {
      setMessage("Ce n'est pas correct. Voyons pourquoi...")
      setSpeaking(true)
    }
  }, [isCorrect, isAnswerChecked, operation])

  // Fonction pour afficher l'explication en mode "typing"
  const showExplanation = () => {
    if (explanation && isAnswerChecked) {
      setSpeaking(true)
      setMessage(explanation)

      // Garder l'explication affichée plus longtemps
      const timer = setTimeout(() => {
        setSpeaking(false)
      }, 5000) // Réduit de 10000 à 5000 ms

      return () => clearTimeout(timer)
    }
  }

  useEffect(() => {
    if (isAnswerChecked) {
      // Attendre un peu avant d'afficher l'explication
      const timer = setTimeout(showExplanation, 2000)
      return () => clearTimeout(timer)
    }
  }, [explanation, isAnswerChecked])

  // Déterminer quelle opération est affichée sur l'écran du robot
  const getOperationDisplay = () => {
    switch (operation) {
      case "addition":
        return "+ Addition"
      case "soustraction":
        return "- Soustraction"
      case "multiplication":
        return "× Multiplication"
      case "division":
        return "÷ Division"
      default:
        return "+ Addition"
    }
  }

  return (
    <div className="relative w-full max-w-[300px] h-[400px]">
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
        {/* Perruque - Plus haute */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-56 h-32 z-10">
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-52 h-24 bg-yellow-400 rounded-t-[100px]"></div>
          <div className="absolute top-10 left-0 w-12 h-32 bg-yellow-400 rounded-b-[20px] rounded-t-[20px] transform -rotate-12"></div>
          <div className="absolute top-10 right-0 w-12 h-32 bg-yellow-400 rounded-b-[20px] rounded-t-[20px] transform rotate-12"></div>
          <div className="absolute top-14 left-[25%] w-10 h-28 bg-yellow-400 rounded-b-[20px] transform -rotate-6"></div>
          <div className="absolute top-14 right-[25%] w-10 h-28 bg-yellow-400 rounded-b-[20px] transform rotate-6"></div>
        </div>

        {/* Robot head */}
        <motion.div
          className="w-52 h-52 bg-gradient-to-b from-blue-100 to-white dark:from-blue-200 dark:to-blue-50 rounded-t-[120px] rounded-b-[30px] border-4 border-blue-500 relative shadow-lg mx-auto overflow-hidden z-20"
          animate={{
            rotate: speaking ? [0, -2, 2, 0] : 0,
          }}
          transition={{
            duration: 0.5,
            repeat: speaking ? Number.POSITIVE_INFINITY : 0,
          }}
        >
          {/* Face plate */}
          <div className="absolute inset-2 rounded-t-[100px] rounded-b-[20px] bg-gradient-to-b from-white to-blue-50 dark:from-blue-50 dark:to-white"></div>

          {/* Eyes */}
          <div className="absolute top-[45px] left-0 w-full flex justify-center space-x-12">
            {/* Left eye */}
            <div className="relative">
              <motion.div
                className="w-12 h-12 bg-gradient-to-b from-blue-100 to-blue-200 rounded-full flex items-center justify-center overflow-hidden shadow-inner border-2 border-blue-300"
                animate={{
                  scaleY: blinking
                    ? 0.1
                    : isCorrect === true
                      ? [1, 0.8, 1]
                      : isCorrect === false
                        ? [0.7, 1, 0.7]
                        : [1, 0.9, 1],
                }}
                transition={{
                  duration: blinking ? 0.1 : 1.5,
                  repeat: !blinking && Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <motion.div
                  className={`w-6 h-6 rounded-full bg-blue-900`}
                  animate={{
                    scale: isCorrect === true ? [1, 1.3, 1] : 1,
                    x: isCorrect === null ? [0, 1, -1, 0] : 0,
                    y: isCorrect === false ? [0, -1, 0] : 0,
                  }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <div className="w-2 h-2 bg-white rounded-full absolute top-1 right-1"></div>
                </motion.div>
              </motion.div>

              {/* Eyebrow - more curved and friendly */}
              <motion.div
                className="absolute -top-5 left-0 w-12 h-3 bg-blue-600 rounded-full"
                style={{
                  borderRadius: "50%/100% 100% 0 0",
                }}
                animate={{
                  rotateZ: isCorrect === true ? -10 : isCorrect === false ? 15 : 0,
                  y: isCorrect === true ? -2 : isCorrect === false ? 2 : 0,
                }}
              />
            </div>

            {/* Right eye */}
            <div className="relative">
              <motion.div
                className="w-12 h-12 bg-gradient-to-b from-blue-100 to-blue-200 rounded-full flex items-center justify-center overflow-hidden shadow-inner border-2 border-blue-300"
                animate={{
                  scaleY: blinking
                    ? 0.1
                    : isCorrect === true
                      ? [1, 0.8, 1]
                      : isCorrect === false
                        ? [0.7, 1, 0.7]
                        : [1, 0.9, 1],
                }}
                transition={{
                  duration: blinking ? 0.1 : 1.5,
                  repeat: !blinking && Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <motion.div
                  className={`w-6 h-6 rounded-full bg-blue-900`}
                  animate={{
                    scale: isCorrect === true ? [1, 1.3, 1] : 1,
                    x: isCorrect === null ? [0, -1, 1, 0] : 0,
                    y: isCorrect === false ? [0, -1, 0] : 0,
                  }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <div className="w-2 h-2 bg-white rounded-full absolute top-1 right-1"></div>
                </motion.div>
              </motion.div>

              {/* Eyebrow - more curved and friendly */}
              <motion.div
                className="absolute -top-5 left-0 w-12 h-3 bg-blue-600 rounded-full"
                style={{
                  borderRadius: "50%/100% 100% 0 0",
                }}
                animate={{
                  rotateZ: isCorrect === true ? 10 : isCorrect === false ? -15 : 0,
                  y: isCorrect === true ? -2 : isCorrect === false ? 2 : 0,
                }}
              />
            </div>
          </div>

          {/* Nez - Descendu légèrement */}
          <div className="absolute top-[85px] left-1/2 transform -translate-x-1/2 w-8 h-8">
            <div className="w-8 h-8 bg-red-200 rounded-full border-2 border-red-300"></div>
            <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
          </div>

          {/* Mouth - Sourire par défaut, grand sourire pour correct, déception pour incorrect */}
          <motion.div className="absolute bottom-[30px] left-[50%] transform -translate-x-1/2 w-[120px] h-[40px]">
            {speaking ? (
              <motion.div className="w-full h-full flex justify-center items-center">
                <motion.div
                  className="w-[80%] h-[30px] bg-blue-900 rounded-lg"
                  animate={{
                    height: ["10px", "30px", "15px", "25px", "10px"],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
              </motion.div>
            ) : (
              <motion.div className="w-full h-full relative">
                <motion.div className="absolute inset-0">
                  <motion.svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 120 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.path
                      d={
                        isCorrect === false
                          ? "M20 35 Q60 0, 100 35" // Déception plus prononcée
                          : isCorrect === true
                            ? "M20 10 Q60 45, 100 10" // Sourire plus grand
                            : "M30 20 Q60 40, 90 20" // Sourire initial plus visible
                      }
                      stroke="#1e3a8a"
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </motion.svg>
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* Antennas */}
          <motion.div
            className="absolute -top-10 left-[30%] w-4 h-12 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"
            animate={{
              rotate: isCorrect === true ? [0, 10, -10, 0] : isCorrect === false ? [-5, 0, -5] : [0, 5, 0],
              y: isCorrect === true ? [0, -2, 0] : 0,
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-red-600 absolute -top-3 left-1/2 transform -translate-x-1/2 shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-1 opacity-70"></div>
            </div>
          </motion.div>
          <motion.div
            className="absolute -top-8 right-[30%] w-4 h-10 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"
            animate={{
              rotate: isCorrect === true ? [0, -10, 10, 0] : isCorrect === false ? [5, 0, 5] : [0, -5, 0],
              y: isCorrect === true ? [0, -2, 0] : 0,
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 0.5,
            }}
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 absolute -top-3 left-1/2 transform -translate-x-1/2 shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-1 opacity-70"></div>
            </div>
          </motion.div>
        </motion.div>

        {/* Robot body */}
        <div className="w-60 h-44 bg-gradient-to-b from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-b-[30px] relative -mt-2 mx-auto shadow-lg">
          {/* Neck */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-gradient-to-b from-blue-400 to-blue-500 rounded-lg"></div>

          {/* Chest light */}
          <motion.div
            className="absolute top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full"
            animate={{
              backgroundColor:
                isCorrect === true
                  ? ["#22c55e", "#4ade80", "#22c55e"]
                  : isCorrect === false
                    ? ["#ef4444", "#f87171", "#ef4444"]
                    : ["#3b82f6", "#60a5fa", "#3b82f6"],
              boxShadow:
                isCorrect === true
                  ? ["0 0 8px #22c55e", "0 0 12px #4ade80", "0 0 8px #22c55e"]
                  : isCorrect === false
                    ? ["0 0 8px #ef4444", "0 0 12px #f87171", "0 0 8px #ef4444"]
                    : ["0 0 8px #3b82f6", "0 0 12px #60a5fa", "0 0 8px #3b82f6"],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
            }}
          />

          {/* Screen/display */}
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-36 h-28 bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-700 shadow-inner">
            <div className="w-full h-full bg-gradient-to-b from-blue-900 to-blue-950 flex flex-col items-center justify-center p-2">
              <motion.div
                className="text-white text-sm font-mono text-center font-bold"
                animate={{
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                {isCorrect === true ? (
                  <span className="text-green-400 text-lg">✓ Correct!</span>
                ) : isCorrect === false ? (
                  <span className="text-red-400 text-lg">✗ Incorrect</span>
                ) : (
                  <span className="text-blue-300">{getOperationDisplay()}</span>
                )}
              </motion.div>

              {/* Afficher des symboles mathématiques animés */}
              {!isAnswerChecked && (
                <motion.div
                  className="text-white text-lg mt-2"
                  animate={{
                    opacity: [0, 1, 0],
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                >
                  {operation === "addition" && "+ + +"}
                  {operation === "soustraction" && "- - -"}
                  {operation === "multiplication" && "× × ×"}
                  {operation === "division" && "÷ ÷ ÷"}
                </motion.div>
              )}

              {/* Afficher une animation spéciale pour les réponses correctes/incorrectes */}
              {isCorrect === true && (
                <motion.div
                  className="mt-2"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                >
                  <span className="text-2xl">🎉</span>
                </motion.div>
              )}

              {isCorrect === false && (
                <motion.div
                  className="mt-2 text-lg"
                  animate={{
                    rotateZ: [0, -10, 10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                >
                  <span>🤔</span>
                </motion.div>
              )}
            </div>

            {/* Screen reflection */}
            <div className="absolute top-0 right-0 w-full h-6 bg-blue-200 opacity-10 transform -skew-x-45"></div>
          </div>

          {/* Buttons */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
            <motion.div
              className="w-7 h-7 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full shadow-md"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-1 opacity-50"></div>
            </motion.div>
            <motion.div
              className="w-7 h-7 bg-gradient-to-b from-green-400 to-green-500 rounded-full shadow-md"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={isCorrect === true ? { scale: [1, 1.2, 1] } : {}}
              transition={isCorrect === true ? { duration: 1, repeat: Number.POSITIVE_INFINITY } : {}}
            >
              <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-1 opacity-50"></div>
            </motion.div>
            <motion.div
              className="w-7 h-7 bg-gradient-to-b from-red-400 to-red-500 rounded-full shadow-md"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={isCorrect === false ? { scale: [1, 1.2, 1] } : {}}
              transition={isCorrect === false ? { duration: 1, repeat: Number.POSITIVE_INFINITY } : {}}
            >
              <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-1 opacity-50"></div>
            </motion.div>
          </div>
        </div>

        {/* Arms */}
        <motion.div
          className="absolute top-[150px] -left-12 w-10 h-36 bg-gradient-to-b from-blue-400 to-blue-500 rounded-full origin-top"
          animate={{
            rotate: isCorrect === true ? [0, 20, 0] : isCorrect === false ? [0, -10, 0] : [0, 5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <div className="w-12 h-12 bg-gradient-to-b from-blue-300 to-blue-400 rounded-full absolute -bottom-2 left-1/2 transform -translate-x-1/2 shadow-md">
            <div className="absolute inset-2 bg-blue-200 rounded-full opacity-30"></div>
          </div>
        </motion.div>
        <motion.div
          className="absolute top-[150px] -right-12 w-10 h-36 bg-gradient-to-b from-blue-400 to-blue-500 rounded-full origin-top"
          animate={{
            rotate: isCorrect === true ? [0, -20, 0] : isCorrect === false ? [0, 10, 0] : [0, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 0.5,
          }}
        >
          <div className="w-12 h-12 bg-gradient-to-b from-blue-300 to-blue-400 rounded-full absolute -bottom-2 left-1/2 transform -translate-x-1/2 shadow-md">
            <div className="absolute inset-2 bg-blue-200 rounded-full opacity-30"></div>
          </div>
        </motion.div>
      </motion.div>

      {/* Speech bubble */}
      <AnimatePresence>
        {speaking && (
          <motion.div
            className="absolute -top-10 right-0 bg-white dark:bg-slate-700 p-4 rounded-2xl shadow-lg max-w-[280px]"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
          >
            <div className="text-gray-800 dark:text-white font-medium text-sm">{message}</div>
            <div className="absolute -bottom-3 left-10 w-6 h-6 bg-white dark:bg-slate-700 transform rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

