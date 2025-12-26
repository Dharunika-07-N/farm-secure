import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { RiskAssessmentForm } from "@/components/assessment/RiskAssessmentForm";
import { RiskGauge } from "@/components/dashboard/RiskGauge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";

export default function RiskAssessment() {
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [riskScore, setRiskScore] = useState(0);

  const handleComplete = (score: number) => {
    setRiskScore(score);
    setAssessmentComplete(true);
  };

  const handleRetake = () => {
    setAssessmentComplete(false);
    setRiskScore(0);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <a href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </a>
          </Button>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Farm Risk Assessment
          </h1>
          <p className="text-muted-foreground">
            Evaluate your farm's biosecurity risk level with our comprehensive assessment tool.
          </p>
        </div>

        {!assessmentComplete ? (
          <RiskAssessmentForm onComplete={handleComplete} />
        ) : (
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-md text-center">
              <h2 className="mb-6 text-2xl font-bold text-foreground">Assessment Results</h2>

              <div className="mb-8 flex justify-center">
                <RiskGauge score={riskScore} label="Your Farm Risk Score" />
              </div>

              <div className="mb-8 rounded-xl bg-muted/50 p-6 text-left">
                <h3 className="mb-3 font-semibold text-foreground">Recommendations</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {riskScore > 50 && (
                    <>
                      <li>• Implement stricter visitor protocols immediately</li>
                      <li>• Establish a dedicated quarantine facility</li>
                      <li>• Increase cleaning frequency to daily</li>
                    </>
                  )}
                  {riskScore <= 50 && riskScore > 30 && (
                    <>
                      <li>• Review and update emergency response plans</li>
                      <li>• Schedule additional staff training sessions</li>
                      <li>• Consider certified feed suppliers</li>
                    </>
                  )}
                  {riskScore <= 30 && (
                    <>
                      <li>• Maintain current biosecurity standards</li>
                      <li>• Continue regular monitoring and inspections</li>
                      <li>• Keep documentation up to date</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button onClick={handleRetake} variant="outline">
                  <RefreshCw className="h-4 w-4" />
                  Retake Assessment
                </Button>
                <Button>
                  <Download className="h-4 w-4" />
                  Download Report
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
