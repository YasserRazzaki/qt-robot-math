"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import QTRobotReal from "@/components/qt-robot-real"

export default function ApprendrePage() {
  const [operation, setOperation] = useState("addition")
  const [firstNumber, setFirstNumber] = useState("")
  const [secondNumber, setSecondNumber] = useState("")
  const [userAnswer, setUserAnswer] = useState("")
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [explanation, setExplanation] = useState("")

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
          return `Bravo ! ${num1} + ${num2} = ${correctAnswer}. Pour additionner deux nombres, on ajoute les unités, puis les dizaines, etc.`
        case "soustraction":
          return `Correct ! ${num1} - ${num2} = ${correctAnswer}. Pour soustraire, on enlève ${num2} de ${num1}.`
        case "multiplication":
          return `Excellent ! ${num1} × ${num2} = ${correctAnswer}. La multiplication est une addition répétée : ${num1} ajouté ${num2} fois.`
        case "division":
          return `Parfait ! ${num1} ÷ ${num2} = ${correctAnswer}. La division consiste à déterminer combien de fois ${num2} est contenu dans ${num1}.`
      }
    } else {
      let explanation = `La réponse correcte est ${correctAnswer}. `

      switch (operation) {
        case "addition":
          explanation += `Pour additionner ${num1} et ${num2}, on commence par les unités : ${num1 % 10} + ${num2 % 10} = ${(num1 % 10) + (num2 % 10)}, puis les dizaines, etc.`
          break
        case "soustraction":
          explanation += `Pour soustraire ${num2} de ${num1}, on peut décomposer le calcul : ${num1} - ${num2} = ${correctAnswer}.`
          break
        case "multiplication":
          explanation += `Pour multiplier ${num1} par ${num2}, on peut voir cela comme ${num1} ajouté ${num2} fois, ce qui donne ${correctAnswer}.`
          break
        case "division":
          explanation += `Pour diviser ${num1} par ${num2}, on cherche combien de fois ${num2} est contenu dans ${num1}, ce qui donne ${correctAnswer}.`
          break
      }

      return explanation
    }
  }

  const handleCheckAnswer = () => {
    if (!firstNumber || !secondNumber || !userAnswer) {
      return
    }

    const correctAnswer = calculateCorrectAnswer()
    const userAnswerNum = Number.parseFloat(userAnswer)
    const correct = Math.abs(userAnswerNum - correctAnswer) < 0.001 // Pour gérer les erreurs d'arrondi

    setIsCorrect(correct)
    setExplanation(generateExplanation(correct, correctAnswer))
    setIsAnswerChecked(true)
  }

  const handleReset = () => {
    setUserAnswer("")
    setIsAnswerChecked(false)
    setIsCorrect(null)
    setExplanation("")
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button asChild variant="ghost" className="flex items-center gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
            </Link>
          </Button>
        </div>

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

                  <div className="mb-6">
                    <Label htmlFor="userAnswer" className="mb-2 block">
                      Votre réponse
                    </Label>
                    <Input
                      id="userAnswer"
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Entrez votre réponse"
                      className="text-lg"
                    />
                  </div>

                  <Button
                    onClick={handleCheckAnswer}
                    className="w-full"
                    disabled={!firstNumber || !secondNumber || !userAnswer}
                  >
                    Vérifier ma réponse
                  </Button>
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

                  <div className="flex gap-4">
                    <Button onClick={handleReset} className="flex-1">
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
            />
          </div>
        </div>
      </div>
    </div>
  )
}

