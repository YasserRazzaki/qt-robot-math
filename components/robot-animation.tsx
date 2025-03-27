"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function RobotAnimation() {
  const [hover, setHover] = useState(false)
  const [speak, setSpeak] = useState(false)
  const [blinking, setBlinking] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    const blinkInterval = setInterval(
      () => {
        setBlinking(true)
        setTimeout(() => setBlinking(false), 200)
      },
      Math.random() * 3000 + 2000,
    )

    intervalRef.current = setInterval(() => {
      if (Math.random() > 0.7) {
        setSpeak(true)
        setTimeout(() => setSpeak(false), 2500)
      }
    }, 4000)

    return () => {
      clearInterval(blinkInterval)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <motion.div
        className="relative flex flex-col items-center transform rotate-2" // Légère inclinaison
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
        <div className="absolute -top-16 w-56 h-32 z-10">
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-52 h-24 bg-yellow-400 rounded-t-[100px]"></div>
          <div className="absolute top-10 left-0 w-12 h-32 bg-yellow-400 rounded-b-[20px] rounded-t-[20px] transform -rotate-12"></div>
          <div className="absolute top-10 right-0 w-12 h-32 bg-yellow-400 rounded-b-[20px] rounded-t-[20px] transform rotate-12"></div>
          <div className="absolute top-14 left-[25%] w-10 h-28 bg-yellow-400 rounded-b-[20px] transform -rotate-6"></div>
          <div className="absolute top-14 right-[25%] w-10 h-28 bg-yellow-400 rounded-b-[20px] transform rotate-6"></div>
        </div>

        {/* Robot head */}
        <motion.div
          className="w-52 h-52 bg-gradient-to-b from-blue-100 to-white dark:from-blue-200 dark:to-blue-50 rounded-t-[120px] rounded-b-[30px] border-4 border-blue-500 relative shadow-lg overflow-hidden z-20"
          animate={{
            rotate: hover ? [0, -3, 3, 0] : 0,
          }}
          transition={{
            duration: 1.5,
            repeat: hover ? Number.POSITIVE_INFINITY : 0,
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
                  scaleY: blinking ? 0.1 : [1, 0.9, 1],
                }}
                transition={{
                  duration: blinking ? 0.1 : 2,
                  repeat: !blinking && Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <motion.div
                  className="w-6 h-6 rounded-full bg-blue-900"
                  animate={{
                    x: hover ? [0, 2, 0] : [0, 1, -1, 0],
                  }}
                  transition={{
                    duration: hover ? 1 : 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <div className="w-2 h-2 bg-white rounded-full absolute top-1 right-1"></div>
                </motion.div>
              </motion.div>

              {/* Eyebrow */}
              <motion.div
                className="absolute -top-5 left-0 w-12 h-3 bg-blue-600 rounded-full"
                style={{
                  borderRadius: "50%/100% 100% 0 0",
                }}
                animate={{
                  rotateZ: hover ? -10 : 0,
                  y: hover ? -1 : 0,
                }}
              />
            </div>

            {/* Right eye */}
            <div className="relative">
              <motion.div
                className="w-12 h-12 bg-gradient-to-b from-blue-100 to-blue-200 rounded-full flex items-center justify-center overflow-hidden shadow-inner border-2 border-blue-300"
                animate={{
                  scaleY: blinking ? 0.1 : [1, 0.9, 1],
                }}
                transition={{
                  duration: blinking ? 0.1 : 2,
                  repeat: !blinking && Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <motion.div
                  className="w-6 h-6 rounded-full bg-blue-900"
                  animate={{
                    x: hover ? [0, -2, 0] : [0, -1, 1, 0],
                  }}
                  transition={{
                    duration: hover ? 1 : 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <div className="w-2 h-2 bg-white rounded-full absolute top-1 right-1"></div>
                </motion.div>
              </motion.div>

              {/* Eyebrow */}
              <motion.div
                className="absolute -top-5 left-0 w-12 h-3 bg-blue-600 rounded-full"
                style={{
                  borderRadius: "50%/100% 100% 0 0",
                }}
                animate={{
                  rotateZ: hover ? 10 : 0,
                  y: hover ? -1 : 0,
                }}
              />
            </div>
          </div>

          {/* Nez */}
          <div className="absolute top-[80px] left-1/2 transform -translate-x-1/2 w-8 h-8">
            <div className="w-8 h-8 bg-red-200 rounded-full border-2 border-red-300"></div>
            <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-70"></div>
          </div>

          {/* Mouth - Petit sourire par défaut, grand sourire au survol */}
          <motion.div className="absolute bottom-[30px] left-[50%] transform -translate-x-1/2 w-[120px] h-[40px]">
            {speak ? (
              <motion.div className="w-full h-full flex justify-center items-center">
                <motion.div
                  className="w-[80%] h-[20px] bg-blue-900 rounded-lg"
                  animate={{
                    height: ["8px", "20px", "12px", "16px", "8px"],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
              </motion.div>
            ) : (
              <motion.div className="w-full h-full relative">
                <motion.svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 120 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path
                    d={hover ? "M20 10 Q60 45, 100 10" : "M30 20 Q60 40, 90 20"}
                    stroke="#1e3a8a"
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </motion.svg>
              </motion.div>
            )}
          </motion.div>

          {/* Antennas */}
          <motion.div
            className="absolute -top-10 left-[30%] w-4 h-12 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"
            animate={{
              rotate: hover ? [0, 10, -10, 0] : [0, 5, 0],
              y: hover ? [0, -2, 0] : 0,
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
              rotate: hover ? [0, -10, 10, 0] : [0, -5, 0],
              y: hover ? [0, -2, 0] : 0,
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
        <div className="w-60 h-44 bg-gradient-to-b from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-b-[30px] relative -mt-2 shadow-lg">
          {/* Neck */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-gradient-to-b from-blue-400 to-blue-500 rounded-lg"></div>

          {/* Chest light */}
          <motion.div
            className="absolute top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full"
            animate={{
              backgroundColor: ["#3b82f6", "#60a5fa", "#3b82f6"],
              boxShadow: ["0 0 8px #3b82f6", "0 0 12px #60a5fa", "0 0 8px #3b82f6"],
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
                {speak ? (
                  <span className="text-blue-300">Bonjour!</span>
                ) : (
                  <span className="text-blue-300">QT Robot</span>
                )}
              </motion.div>

              {/* Animated math symbols */}
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
                {speak ? "Je suis QT!" : "+ × ÷ -"}
              </motion.div>
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
              animate={hover ? { scale: [1, 1.2, 1] } : {}}
              transition={hover ? { duration: 1, repeat: Number.POSITIVE_INFINITY } : {}}
            >
              <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-1 opacity-50"></div>
            </motion.div>
            <motion.div
              className="w-7 h-7 bg-gradient-to-b from-red-400 to-red-500 rounded-full shadow-md"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-1 opacity-50"></div>
            </motion.div>
          </div>
        </div>

        {/* Arms */}
        <motion.div
          className="absolute top-[150px] -left-12 w-10 h-36 bg-gradient-to-b from-blue-400 to-blue-500 rounded-full origin-top"
          animate={{
            rotate: hover ? [0, 15, 0] : [0, 5, 0],
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
            rotate: hover ? [0, -15, 0] : [0, -5, 0],
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
        {speak && (
          <motion.div
            className="absolute top-10 right-10 bg-white dark:bg-slate-700 p-4 rounded-2xl shadow-lg"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <div className="text-gray-800 dark:text-white font-medium">
              {hover ? "Salut! Tu veux apprendre les maths avec moi?" : "Bonjour! Je suis QT Robot!"}
            </div>
            <div className="absolute -bottom-3 left-5 w-6 h-6 bg-white dark:bg-slate-700 transform rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

