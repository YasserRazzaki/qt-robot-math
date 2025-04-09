"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { motion } from "framer-motion"

interface TrueFalseQuestionProps {
  question: string
  correctAnswer: boolean
  onAnswer: (isCorrect: boolean) => void
  onClose: () => void
}

export default function TrueFalseQuestion({ question, correctAnswer, onAnswer, onClose }: TrueFalseQuestionProps) {
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null)

  const handleAnswer = (answer: boolean) => {
    setSelectedAnswer(answer)
    setAnswered(true)
    const isCorrect = answer === correctAnswer
    onAnswer(isCorrect)
  }

  useEffect(() => {
    if (answered) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [answered, onClose])

  return (
    <motion.div
      className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <h3 className="text-lg font-bold mb-4 text-center">{question}</h3>

      {!answered ? (
        <div className="flex justify-center gap-4 mt-4">
          <Button variant="outline" size="lg" onClick={() => handleAnswer(true)} className="w-24">
            <Check className="mr-2 h-4 w-4" />
            Vrai
          </Button>

          <Button variant="outline" size="lg" onClick={() => handleAnswer(false)} className="w-24">
            <X className="mr-2 h-4 w-4" />
            Faux
          </Button>
        </div>
      ) : null}

      {answered && (
        <motion.div
          className={`mt-4 p-3 rounded-lg text-center ${
            selectedAnswer === correctAnswer
              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
              : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {selectedAnswer === correctAnswer
            ? "Bravo ! C'est la bonne réponse !"
            : `Pas tout à fait. La bonne réponse est "${correctAnswer ? "Vrai" : "Faux"}".`}
        </motion.div>
      )}
    </motion.div>
  )
}

