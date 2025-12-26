import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft,
    Play,
    CheckCircle,
    Clock,
    BookOpen,
    FileText,
    Video,
    Award,
    ChevronRight,
    ChevronLeft
} from "lucide-react";

const API_URL = "http://localhost:5000/api/v1";

export default function TrainingModule() {
    const { moduleId } = useParams<{ moduleId: string }>();
    const navigate = useNavigate();
    const [module, setModule] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
    const [showQuizResults, setShowQuizResults] = useState(false);

    useEffect(() => {
        const fetchModule = async () => {
            try {
                const response = await fetch(`${API_URL}/training/modules/${moduleId}`);
                if (!response.ok) throw new Error("Module not found");
                const data = await response.json();

                // Transform backend data to frontend structure
                const transformedModule = {
                    id: data.id,
                    title: data.name,
                    category: data.category,
                    duration: `${data.duration} min`,
                    progress: 0, // In a real app, this would come from user progress
                    description: data.description,
                    lessons: data.content.sections.map((section: any, idx: number) => ({
                        id: `${data.id}-${idx}`,
                        title: section.title,
                        type: section.type,
                        duration: `${section.duration} min`,
                        completed: false,
                        content: section.content, // HTML content or text
                        quiz: section.questions ? Array(section.questions).fill(null).map((_, i) => ({
                            question: `Sample Question ${i + 1} for ${section.title}?`,
                            options: ["Option A", "Option B", "Option C", "Option D"],
                            correct: 0
                        })) : undefined
                    }))
                };

                setModule(transformedModule);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching module:", error);
                navigate("/training");
            }
        };

        if (moduleId) {
            fetchModule();
        }
    }, [moduleId, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-xl">Loading module content...</div>
            </div>
        );
    }

    if (!module) return null;

    const currentLesson = module.lessons[currentLessonIndex];
    const isFirstLesson = currentLessonIndex === 0;
    const isLastLesson = currentLessonIndex === module.lessons.length - 1;

    const handleNext = () => {
        if (!isLastLesson) {
            setCurrentLessonIndex(currentLessonIndex + 1);
            setQuizAnswers({});
            setShowQuizResults(false);
        } else {
            navigate("/training");
        }
    };

    const handlePrevious = () => {
        if (!isFirstLesson) {
            setCurrentLessonIndex(currentLessonIndex - 1);
            setQuizAnswers({});
            setShowQuizResults(false);
        }
    };

    const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
        setQuizAnswers({ ...quizAnswers, [questionIndex]: answerIndex });
    };

    const handleSubmitQuiz = () => {
        setShowQuizResults(true);
    };

    const calculateQuizScore = () => {
        if (!currentLesson.quiz) return 0;
        const correct = currentLesson.quiz.filter(
            (q: any, i: number) => quizAnswers[i] === q.correct
        ).length;
        return Math.round((correct / currentLesson.quiz.length) * 100);
    };

    const getLessonIcon = (type: string) => {
        switch (type) {
            case "video":
                return Video;
            case "reading":
                return BookOpen;
            case "quiz":
                return FileText;
            default:
                return BookOpen;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container py-8 max-w-5xl">
                {/* Header */}
                <div className="mb-8">
                    <Button variant="ghost" onClick={() => navigate("/training")} className="mb-4">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Training
                    </Button>

                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                                    {module.category}
                                </Badge>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    {module.duration}
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-foreground md:text-3xl mb-2">
                                {module.title}
                            </h1>
                            <p className="text-muted-foreground">{module.description}</p>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Module Progress</span>
                            <span className="text-sm font-bold text-primary">{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                    </div>
                </div>

                {/* Lesson Navigation */}
                <div className="mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Lessons</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-2">
                                {module.lessons.map((lesson: any, index: number) => {
                                    const LessonIcon = getLessonIcon(lesson.type);
                                    return (
                                        <button
                                            key={lesson.id}
                                            onClick={() => {
                                                setCurrentLessonIndex(index);
                                                setQuizAnswers({});
                                                setShowQuizResults(false);
                                            }}
                                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${index === currentLessonIndex
                                                ? "bg-primary/10 border-primary"
                                                : "hover:bg-muted border-border"
                                                }`}
                                        >
                                            <div className={`flex-shrink-0 ${lesson.completed ? "text-success" : "text-muted-foreground"}`}>
                                                {lesson.completed ? (
                                                    <CheckCircle className="h-5 w-5" />
                                                ) : (
                                                    <LessonIcon className="h-5 w-5" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-sm">{lesson.title}</div>
                                                <div className="text-xs text-muted-foreground capitalize">
                                                    {lesson.type} • {lesson.duration}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Lesson Content */}
                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            {currentLesson.completed ? (
                                <CheckCircle className="h-5 w-5 text-success" />
                            ) : (
                                <Play className="h-5 w-5 text-primary" />
                            )}
                            <CardTitle>{currentLesson.title}</CardTitle>
                        </div>
                        <CardDescription className="capitalize">
                            {currentLesson.type} • {currentLesson.duration}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {currentLesson.type === "quiz" && currentLesson.quiz ? (
                            <div className="space-y-6">
                                {!showQuizResults ? (
                                    <>
                                        {currentLesson.quiz.map((q: any, qIndex: number) => (
                                            <div key={qIndex} className="space-y-3">
                                                <h4 className="font-semibold">
                                                    {qIndex + 1}. {q.question}
                                                </h4>
                                                <div className="space-y-2">
                                                    {q.options.map((option: string, oIndex: number) => (
                                                        <button
                                                            key={oIndex}
                                                            onClick={() => handleQuizAnswer(qIndex, oIndex)}
                                                            className={`w-full text-left p-3 rounded-lg border transition-all ${quizAnswers[qIndex] === oIndex
                                                                ? "bg-primary/10 border-primary"
                                                                : "hover:bg-muted border-border"
                                                                }`}
                                                        >
                                                            {option}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                        <Button
                                            onClick={handleSubmitQuiz}
                                            disabled={Object.keys(quizAnswers).length !== currentLesson.quiz.length}
                                            className="w-full"
                                        >
                                            Submit Quiz
                                        </Button>
                                    </>
                                ) : (
                                    <div className="text-center space-y-4">
                                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-4">
                                            <Award className="h-10 w-10 text-success" />
                                        </div>
                                        <h3 className="text-2xl font-bold">Quiz Completed!</h3>
                                        <p className="text-4xl font-bold text-primary">{calculateQuizScore()}%</p>
                                        <p className="text-muted-foreground">
                                            You got {currentLesson.quiz.filter((q: any, i: number) => quizAnswers[i] === q.correct).length} out of {currentLesson.quiz.length} correct
                                        </p>
                                        {calculateQuizScore() >= 70 ? (
                                            <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
                                                <p className="text-success font-medium">Great job! You passed this quiz.</p>
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg">
                                                <p className="text-warning font-medium">You need 70% to pass. Try again!</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div
                                className="prose prose-sm max-w-none dark:prose-invert"
                                dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={isFirstLesson}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous Lesson
                    </Button>
                    <Button onClick={handleNext}>
                        {isLastLesson ? "Complete Module" : "Next Lesson"}
                        {!isLastLesson && <ChevronRight className="h-4 w-4" />}
                    </Button>
                </div>
            </main>
        </div>
    );
}
