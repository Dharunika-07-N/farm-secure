import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, ChevronRight, Loader2, Info, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";

interface Question {
  id: string;
  text: string;
  weight: number;
  category: string;
  applicableTo: string;
}

interface AssessmentResult {
  score: number;
  level: "low" | "medium" | "high";
  recommendations: string[];
  answers: Record<string, string>;
  domainScores: Record<string, number>;
}

interface RiskAssessmentFormProps {
  onComplete: (result: AssessmentResult) => void;
}

export function RiskAssessmentForm({ onComplete }: RiskAssessmentFormProps) {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [formStep, setFormStep] = useState<'species' | 'assessment'>('species');
  const [species, setSpecies] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        const response = await api.get("/analytics/indicators");
        const data = Array.isArray(response.data) ? response.data : [];

        const fetchedQuestions = data.map((ind: any) => ({
          id: ind.variableName,
          text: formatQuestionText(ind.variableName),
          weight: ind.importanceWeight,
          category: ind.category,
          applicableTo: ind.applicableTo,
        }));
        setAllQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching indicators:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIndicators();
  }, []);

  const formatQuestionText = (variableName: string) => {
    if (!variableName) return "";
    const words = variableName.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1));
    return `Do you implement strictly controlled ${words.join(' ')}?`;
  };

  const startAssessment = (selectedSpecies: string) => {
    setSpecies(selectedSpecies);
    const filtered = allQuestions.filter(q =>
      q.applicableTo === 'Both' || q.applicableTo === selectedSpecies
    );
    setFilteredQuestions(filtered);
    setFormStep('assessment');
    setCurrentQuestionIndex(0);
  };

  const handleAnswer = (value: string) => {
    if (!filteredQuestions[currentQuestionIndex]) return;
    setAnswers((prev) => ({
      ...prev,
      [filteredQuestions[currentQuestionIndex].id]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    const domainTotals: Record<string, { earned: number; total: number }> = {};
    const recommendations: string[] = [];

    filteredQuestions.forEach((q) => {
      if (!domainTotals[q.category]) {
        domainTotals[q.category] = { earned: 0, total: 0 };
      }
      domainTotals[q.category].total += q.weight;
      if (answers[q.id] === "yes") {
        domainTotals[q.category].earned += q.weight;
      } else {
        recommendations.push(`${q.category}: Improve ${q.text.replace("Do you implement strictly controlled ", "").replace("?", "")} practices.`);
      }
    });

    let totalWeight = 0;
    let earnedWeight = 0;
    const domainScores: Record<string, number> = {};

    Object.entries(domainTotals).forEach(([category, data]) => {
      const catScore = (data.earned / data.total) * 100;
      domainScores[category] = Math.round(catScore);
      totalWeight += data.total;
      earnedWeight += data.earned;
    });

    const score = totalWeight > 0 ? (earnedWeight / totalWeight) * 100 : 0;

    let level: "low" | "medium" | "high" = "high";
    if (score > 80) level = "low";
    else if (score > 50) level = "medium";

    onComplete({
      score: Math.round(score),
      level,
      recommendations: recommendations.slice(0, 6),
      answers,
      domainScores
    });
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (formStep === 'species') {
    return (
      <Card className="w-full max-w-2xl mx-auto p-8 text-center bg-card shadow-lg border-primary/10">
        <h2 className="text-2xl font-bold mb-2">Select Farm Type</h2>
        <p className="text-muted-foreground mb-8">Choose the species you want to assess to get customized biosecurity questions.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Button
            variant="outline"
            className="h-32 flex-col gap-3 text-lg border-2 hover:border-primary hover:bg-primary/5 transition-all"
            onClick={() => startAssessment('Poultry')}
          >
            <span className="text-4xl">🐔</span>
            <span>Poultry Farm</span>
          </Button>
          <Button
            variant="outline"
            className="h-32 flex-col gap-3 text-lg border-2 hover:border-primary hover:bg-primary/5 transition-all"
            onClick={() => startAssessment('Pig')}
          >
            <span className="text-4xl">🐷</span>
            <span>Pig Farm</span>
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
          <Info className="h-4 w-4" />
          <span>Biosecurity requirements vary significantly between species.</span>
        </div>
      </Card>
    );
  }

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / filteredQuestions.length) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 shadow-xl border-primary/10">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => setFormStep('species')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Change Species
          </Button>
          <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full">
            {species} Assessment
          </span>
        </div>

        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span className="font-medium text-foreground">Category: {currentQuestion?.category}</span>
          <span>{currentQuestionIndex + 1} / {filteredQuestions.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-xl font-bold mb-8 min-h-[3rem] leading-tight">
            {currentQuestion?.text}
          </h3>

          <RadioGroup
            value={answers[currentQuestion?.id] || ""}
            onValueChange={handleAnswer}
            className="space-y-4"
          >
            <div
              className={`flex items-center space-x-3 border-2 p-5 rounded-xl cursor-pointer transition-all ${answers[currentQuestion?.id] === "yes"
                  ? "bg-primary/5 border-primary shadow-sm"
                  : "hover:bg-muted/50 border-input"
                }`}
              onClick={() => handleAnswer("yes")}
            >
              <RadioGroupItem value="yes" id="yes" />
              <div className="flex-1">
                <Label htmlFor="yes" className="cursor-pointer font-bold block mb-1">Fully Implemented</Label>
                <p className="text-sm text-muted-foreground">This protocol is strictly followed on my farm.</p>
              </div>
              <CheckCircle className={`h-6 w-6 ${answers[currentQuestion?.id] === "yes" ? "text-primary" : "text-muted-foreground/20"}`} />
            </div>

            <div
              className={`flex items-center space-x-3 border-2 p-5 rounded-xl cursor-pointer transition-all ${answers[currentQuestion?.id] === "no"
                  ? "bg-destructive/5 border-destructive shadow-sm"
                  : "hover:bg-muted/50 border-input"
                }`}
              onClick={() => handleAnswer("no")}
            >
              <RadioGroupItem value="no" id="no" />
              <div className="flex-1">
                <Label htmlFor="no" className="cursor-pointer font-bold block mb-1">Partially or Not Implemented</Label>
                <p className="text-sm text-muted-foreground">Working on it, or not yet implemented.</p>
              </div>
              <AlertCircle className={`h-6 w-6 ${answers[currentQuestion?.id] === "no" ? "text-destructive" : "text-muted-foreground/20"}`} />
            </div>
          </RadioGroup>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end mt-10">
        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion?.id]}
          className="w-full sm:w-48 h-12 text-md shadow-md"
        >
          {currentQuestionIndex === filteredQuestions.length - 1 ? "Get My Result" : "Next Question"}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
}
