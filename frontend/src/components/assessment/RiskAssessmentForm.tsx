import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, ChevronRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

interface Question {
  id: string;
  text: string;
  weight: number;
  category: string;
}

interface AssessmentResult {
  score: number;
  level: "low" | "medium" | "high";
  recommendations: string[];
}

interface RiskAssessmentFormProps {
  onComplete: (result: AssessmentResult) => void;
}

export function RiskAssessmentForm({ onComplete }: RiskAssessmentFormProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        const response = await axios.get(`${API_URL}/analytics/indicators`);
        // Provide a fallback if response.data is not an array (though it should be)
        const data = Array.isArray(response.data) ? response.data : [];
        if (data.length === 0) {
          console.warn("No indicators received from API");
        }

        const fetchedQuestions = data.map((ind: any) => ({
          id: ind.variableName,
          text: formatQuestionText(ind.variableName),
          weight: ind.importanceWeight,
          category: ind.applicableTo,
        }));
        setQuestions(fetchedQuestions);
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

  const handleAnswer = (value: string) => {
    if (!questions[currentStep]) return;
    setAnswers((prev) => ({
      ...prev,
      [questions[currentStep].id]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    let totalWeight = 0;
    let earnedWeight = 0;
    const recommendations: string[] = [];

    questions.forEach((q) => {
      totalWeight += q.weight;
      if (answers[q.id] === "yes") {
        earnedWeight += q.weight;
      } else {
        recommendations.push(`Improve ${q.text.replace("Do you implement strictly controlled ", "").replace("?", "")} practices.`);
      }
    });

    const score = totalWeight > 0 ? (earnedWeight / totalWeight) * 100 : 0;

    let level: "low" | "medium" | "high" = "high";
    if (score > 80) level = "low";
    else if (score > 50) level = "medium";

    onComplete({
      score: Math.round(score),
      level,
      recommendations: recommendations.slice(0, 5),
    });
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (questions.length === 0) {
    return <div className="text-center p-8">No specific indicators found. Please ensure the database is populated.</div>;
  }

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Question {currentStep + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Completed</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-semibold mb-6">{currentQuestion?.text}</h3>

          <RadioGroup
            value={answers[currentQuestion?.id] || ""}
            onValueChange={handleAnswer}
            className="space-y-4"
          >
            <div className={`flex items-center space-x-3 border p-4 rounded-lg cursor-pointer transition-colors ${answers[currentQuestion?.id] === "yes" ? "bg-primary/5 border-primary" : "hover:bg-muted/50"}`}>
              <RadioGroupItem value="yes" id="yes" />
              <Label htmlFor="yes" className="flex-1 cursor-pointer font-medium">Yes, fully implemented</Label>
              <CheckCircle className={`h-5 w-5 ${answers[currentQuestion?.id] === "yes" ? "text-primary" : "text-muted-foreground/30"}`} />
            </div>

            <div className={`flex items-center space-x-3 border p-4 rounded-lg cursor-pointer transition-colors ${answers[currentQuestion?.id] === "no" ? "bg-destructive/5 border-destructive" : "hover:bg-muted/50"}`}>
              <RadioGroupItem value="no" id="no" />
              <Label htmlFor="no" className="flex-1 cursor-pointer font-medium">No, or partially implemented</Label>
              <AlertCircle className={`h-5 w-5 ${answers[currentQuestion?.id] === "no" ? "text-destructive" : "text-muted-foreground/30"}`} />
            </div>
          </RadioGroup>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end mt-8">
        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion?.id]}
          className="w-full sm:w-auto"
        >
          {currentStep === questions.length - 1 ? "Complete Assessment" : "Next Question"}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
