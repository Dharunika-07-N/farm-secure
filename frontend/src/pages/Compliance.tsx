import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  Circle,
  Download,
  Upload,
  Calendar
} from "lucide-react";

const complianceCategories = [
  {
    id: "facility",
    name: "Facility Standards",
    progress: 80,
    items: [
      { id: "f1", name: "Perimeter fencing maintained", completed: true, dueDate: null },
      { id: "f2", name: "Entry point signage installed", completed: true, dueDate: null },
      { id: "f3", name: "Footbath stations operational", completed: true, dueDate: null },
      { id: "f4", name: "Vehicle wash station available", completed: false, dueDate: "2024-02-15" },
      { id: "f5", name: "Dead bird disposal system", completed: true, dueDate: null },
    ],
  },
  {
    id: "documentation",
    name: "Documentation",
    progress: 60,
    items: [
      { id: "d1", name: "Visitor log maintained", completed: true, dueDate: null },
      { id: "d2", name: "Mortality records updated", completed: true, dueDate: null },
      { id: "d3", name: "Feed delivery records", completed: true, dueDate: null },
      { id: "d4", name: "Vaccination records current", completed: false, dueDate: "2024-02-01" },
      { id: "d5", name: "Emergency contact list updated", completed: false, dueDate: "2024-02-10" },
    ],
  },
  {
    id: "training",
    name: "Staff Training",
    progress: 50,
    items: [
      { id: "t1", name: "Biosecurity basics - All staff", completed: true, dueDate: null },
      { id: "t2", name: "Disease recognition training", completed: true, dueDate: null },
      { id: "t3", name: "PPE usage certification", completed: false, dueDate: "2024-02-20" },
      { id: "t4", name: "Emergency response drill", completed: false, dueDate: "2024-03-01" },
    ],
  },
  {
    id: "inspections",
    name: "Inspections",
    progress: 75,
    items: [
      { id: "i1", name: "Monthly self-inspection", completed: true, dueDate: null },
      { id: "i2", name: "Quarterly veterinary check", completed: true, dueDate: null },
      { id: "i3", name: "Annual government audit", completed: true, dueDate: null },
      { id: "i4", name: "Water quality testing", completed: false, dueDate: "2024-02-28" },
    ],
  },
];

const documents = [
  { id: "1", name: "Biosecurity Plan 2024", type: "PDF", date: "2024-01-15", status: "current" },
  { id: "2", name: "Emergency Response Protocol", type: "PDF", date: "2024-01-10", status: "current" },
  { id: "3", name: "Staff Training Certificates", type: "ZIP", date: "2024-01-08", status: "current" },
  { id: "4", name: "Veterinary Health Certificate", type: "PDF", date: "2023-12-20", status: "expiring" },
  { id: "5", name: "Feed Supplier Agreements", type: "PDF", date: "2023-11-15", status: "current" },
];

export default function Compliance() {
  const overallProgress = Math.round(
    complianceCategories.reduce((acc, cat) => acc + cat.progress, 0) / complianceCategories.length
  );

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
            Compliance Tracking
          </h1>
          <p className="text-muted-foreground">
            Monitor your regulatory compliance status and manage required documentation.
          </p>
        </div>

        {/* Overall Progress */}
        <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Overall Compliance Score</h2>
              <p className="text-sm text-muted-foreground">
                Based on {complianceCategories.length} compliance categories
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Progress value={overallProgress} className="h-4 w-48" />
              <span className="text-2xl font-bold text-primary">{overallProgress}%</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="checklist" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="checklist">Compliance Checklist</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="checklist">
            <div className="grid gap-6 md:grid-cols-2">
              {complianceCategories.map((category) => (
                <div key={category.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{category.name}</h3>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                      {category.progress}%
                    </Badge>
                  </div>
                  <Progress value={category.progress} className="mb-4 h-2" />
                  <div className="space-y-2">
                    {category.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {item.completed ? (
                            <CheckCircle className="h-4 w-4 text-success shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                          <span className={`text-sm ${item.completed ? "text-foreground" : "text-muted-foreground"}`}>
                            {item.name}
                          </span>
                        </div>
                        {item.dueDate && !item.completed && (
                          <span className="flex items-center gap-1 text-xs text-warning">
                            <Calendar className="h-3 w-3" />
                            {item.dueDate}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <div className="rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border p-4">
                <h3 className="font-semibold text-foreground">Farm Documents</h3>
                <Button size="sm">
                  <Upload className="h-4 w-4" />
                  Upload New
                </Button>
              </div>
              <div className="divide-y divide-border">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">{doc.type} • {doc.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.status === "expiring" && (
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                          Expiring Soon
                        </Badge>
                      )}
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
