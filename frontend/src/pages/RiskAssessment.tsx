import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { RiskAssessmentForm } from "@/components/assessment/RiskAssessmentForm";
import { RiskGauge } from "@/components/dashboard/RiskGauge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, RefreshCw, CheckCircle2, ChevronRight } from "lucide-react";
import api from "@/lib/api";

export default function RiskAssessment() {
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleComplete = async (assessmentResult: any) => {
    setResult(assessmentResult);
    setAssessmentComplete(true);

    try {
      await api.post("/risk-assessment", {
        score: assessmentResult.score,
        level: assessmentResult.level,
        recommendations: JSON.stringify(assessmentResult.recommendations),
        answers: JSON.stringify(assessmentResult.answers)
      });
    } catch (error) {
      console.error("Failed to save assessment:", error);
    }
  };

  const handleRetake = () => {
    setAssessmentComplete(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <a href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
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
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-8 shadow-xl border-primary/10 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${result?.level === 'low' ? 'bg-success/10 text-success' :
                    result?.level === 'medium' ? 'bg-warning/10 text-warning' :
                      'bg-destructive/10 text-destructive'
                  }`}>
                  {result?.level} Risk
                </span>
              </div>

              <div className="grid gap-12 lg:grid-cols-2 items-center">
                <div className="flex flex-col items-center">
                  <h2 className="mb-8 text-2xl font-bold text-foreground">Overall Score</h2>
                  <RiskGauge score={result?.score || 0} label="Biosecurity Implementation" />
                </div>

                <div>
                  <h3 className="mb-6 text-xl font-bold text-foreground">Domain Breakdown</h3>
                  <div className="space-y-6">
                    {Object.entries(result?.domainScores || {}).map(([domain, score]: [string, any]) => (
                      <div key={domain} className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span>{domain}</span>
                          <span className={score > 80 ? "text-success" : score > 50 ? "text-warning" : "text-destructive"}>
                            {score}%
                          </span>
                        </div>
                        <Progress
                          value={score}
                          className="h-2.5"
                          indicatorClassName={
                            score > 80 ? 'bg-success' :
                              score > 50 ? 'bg-warning' :
                                'bg-destructive'
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6 border-primary/5">
                <h3 className="mb-4 text-lg font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Key Recommendations
                </h3>
                <ul className="space-y-3">
                  {result?.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6 border-primary/5 flex flex-col justify-between">
                <div>
                  <h3 className="mb-4 text-lg font-bold">What's Next?</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Based on your results, we recommend updating your staff training modules and reviewing your facility's disinfection protocols.
                  </p>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-between" asChild>
                      <a href="/staff">
                        Assigned Training Modules
                        <ChevronRight className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-between" asChild>
                      <a href="/compliance">
                        Compliance Documentation
                        <ChevronRight className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button onClick={handleRetake} variant="ghost" className="hover:bg-primary/5">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retake Assessment
                  </Button>
                  <Button className="shadow-lg shadow-primary/20">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF Report
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
