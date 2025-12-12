import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const questions = [
  {
    id: "farm-type",
    question: "What type of livestock do you primarily raise?",
    options: [
      { value: "poultry", label: "Poultry (Chickens, Turkeys, Ducks)" },
      { value: "pigs", label: "Pigs / Swine" },
      { value: "mixed", label: "Mixed (Both Poultry and Pigs)" },
    ],
  },
  {
    id: "farm-size",
    question: "What is the approximate size of your operation?",
    options: [
      { value: "small", label: "Small (< 500 animals)" },
      { value: "medium", label: "Medium (500 - 5,000 animals)" },
      { value: "large", label: "Large (> 5,000 animals)" },
    ],
  },
  {
    id: "visitor-policy",
    question: "Do you have a visitor registration and biosecurity protocol?",
    options: [
      { value: "yes", label: "Yes, strictly enforced" },
      { value: "partial", label: "Partially implemented" },
      { value: "no", label: "No formal protocol" },
    ],
  },
  {
    id: "cleaning-protocol",
    question: "How often do you clean and disinfect housing facilities?",
    options: [
      { value: "daily", label: "Daily" },
      { value: "weekly", label: "Weekly" },
      { value: "monthly", label: "Monthly or less" },
    ],
  },
  {
    id: "quarantine",
    question: "Do you have a quarantine area for new or sick animals?",
    options: [
      { value: "yes", label: "Yes, dedicated quarantine facility" },
      { value: "temporary", label: "Temporary/improvised space" },
      { value: "no", label: "No quarantine area" },
    ],
  },
  {
    id: "feed-source",
    question: "How do you source your animal feed?",
    options: [
      { value: "certified", label: "Certified suppliers with quality assurance" },
      { value: "local", label: "Local suppliers" },
      { value: "self", label: "Self-produced on farm" },
    ],
  },
];

interface RiskAssessmentFormProps {
  onComplete: (score: number, answers: Record<string, string>) => void;
}

export function RiskAssessmentForm({ onComplete }: RiskAssessmentFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const progress = ((currentStep + 1) / questions.length) * 100;
  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;
  const canProceed = answers[currentQuestion.id];

  const handleNext = () => {
    if (isLastStep) {
      // Calculate risk score (simple scoring for demo)
      const riskScore = calculateRiskScore(answers);
      onComplete(riskScore, answers);
      toast({
        title: "Assessment Complete!",
        description: `Your farm risk score is ${riskScore}%`,
      });
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const calculateRiskScore = (answers: Record<string, string>): number => {
    let score = 50; // Base score
    
    // Adjust based on answers (simplified scoring)
    if (answers["visitor-policy"] === "yes") score -= 10;
    if (answers["visitor-policy"] === "no") score += 15;
    if (answers["cleaning-protocol"] === "daily") score -= 10;
    if (answers["cleaning-protocol"] === "monthly") score += 15;
    if (answers["quarantine"] === "yes") score -= 10;
    if (answers["quarantine"] === "no") score += 15;
    if (answers["feed-source"] === "certified") score -= 5;
    
    return Math.max(10, Math.min(90, score));
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-muted-foreground">
            Question {currentStep + 1} of {questions.length}
          </span>
          <span className="font-semibold text-primary">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-md md:p-8">
        <h2 className="mb-6 text-xl font-bold text-foreground md:text-2xl">
          {currentQuestion.question}
        </h2>

        <RadioGroup
          value={answers[currentQuestion.id] || ""}
          onValueChange={(value) =>
            setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
          }
          className="space-y-3"
        >
          {currentQuestion.options.map((option) => (
            <Label
              key={option.value}
              htmlFor={option.value}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background p-4 transition-all hover:border-primary/50 hover:bg-accent/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent"
            >
              <RadioGroupItem value={option.value} id={option.value} />
              <span className="text-foreground">{option.label}</span>
            </Label>
          ))}
        </RadioGroup>

        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed}
          >
            {isLastStep ? (
              <>
                Complete
                <CheckCircle className="h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
