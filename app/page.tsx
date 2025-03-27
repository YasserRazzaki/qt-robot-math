import Link from "next/link"
import { ArrowRight, Brain, Calculator, Lightbulb, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import QTRobotReal from "@/components/qt-robot-real"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-blue-600 dark:text-blue-400">
                Apprendre les maths avec QT Robot
              </h1>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-[600px]">
                Découvrez comment QT Robot rend l'apprentissage des mathématiques amusant et interactif pour les enfants
                de 8 à 10 ans.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full">
                  <Link href="/apprendre" className="flex items-center gap-2">
                    Tester le Robot <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-slate-800 rounded-full"
                >
                  <a href="#pourquoi-choisir" className="flex items-center gap-2">
                    En savoir plus
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative h-[600px] flex items-center justify-end">
              <QTRobotReal isHomepage={true} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="pourquoi-choisir" className="py-16 md:py-24 bg-white dark:bg-slate-900 scroll-mt-20">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Pourquoi choisir QT Robot ?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-[800px] mx-auto">
              QT Robot est spécialement conçu pour rendre l'apprentissage des mathématiques engageant et accessible.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="h-10 w-10 text-blue-600 dark:text-blue-400" />}
              title="Apprentissage adaptatif"
              description="QT Robot s'adapte au niveau de chaque enfant pour offrir un apprentissage personnalisé."
            />
            <FeatureCard
              icon={<Calculator className="h-10 w-10 text-blue-600 dark:text-blue-400" />}
              title="Concepts mathématiques simplifiés"
              description="Des explications claires et des exercices interactifs pour maîtriser les bases des mathématiques."
            />
            <FeatureCard
              icon={<Lightbulb className="h-10 w-10 text-blue-600 dark:text-blue-400" />}
              title="Apprentissage ludique"
              description="Des jeux et des défis qui rendent l'apprentissage des mathématiques amusant et motivant."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-blue-600 dark:text-blue-400" />}
              title="Interaction sociale"
              description="QT Robot encourage la collaboration et l'apprentissage en groupe."
            />
            <FeatureCard
              icon={<Calculator className="h-10 w-10 text-blue-600 dark:text-blue-400" />}
              title="Suivi des progrès"
              description="Suivez facilement les progrès de l'enfant et identifiez les domaines à améliorer."
            />
            <FeatureCard
              icon={<Lightbulb className="h-10 w-10 text-blue-600 dark:text-blue-400" />}
              title="Contenu éducatif validé"
              description="Programmes alignés sur les objectifs pédagogiques nationaux pour les enfants de 8 à 10 ans."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-blue-50 dark:bg-slate-800">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-[600px]">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Prêt à découvrir QT Robot ?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Commencez dès maintenant l'aventure mathématique avec QT Robot et voyez comment il peut transformer
                l'apprentissage de votre enfant.
              </p>
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full">
                <Link href="/apprendre" className="flex items-center gap-2">
                  Tester le Robot <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative w-full max-w-[400px] h-[300px] flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-200 dark:bg-blue-900/30 rounded-2xl transform rotate-3"></div>
              <div className="absolute inset-0 bg-blue-300 dark:bg-blue-800/40 rounded-2xl transform -rotate-3"></div>
              <div className="relative bg-white dark:bg-slate-700 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Témoignage</h3>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "QT Robot a complètement changé l'attitude de mon fils envers les mathématiques. Il attend maintenant
                  avec impatience ses sessions d'apprentissage !"
                </p>
                <p className="text-gray-800 dark:text-gray-200 font-medium mt-4">- Parent d'un élève de CE2</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-blue-50 dark:bg-slate-800 p-6 rounded-xl transition-transform duration-300 hover:scale-105">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}

