import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { OutbreakMap } from "@/components/map/OutbreakMap";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { reportOutbreak } from "@/services/outbreak.service";
import { toast } from "@/components/ui/use-toast";

export default function DiseaseMap() {
  const [formData, setFormData] = useState({
    disease: "",
    location: "",
    affected: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const success = await reportOutbreak(formData);
    setIsSubmitting(false);

    if (success) {
      setIsOpen(false);
      setFormData({ disease: "", location: "", affected: "", description: "" });
      alert("Report submitted successfully to veterinary authorities.");
    } else {
      alert("Failed to submit report. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex flex-1 flex-col">
        <div className="container py-4">
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Button variant="ghost" asChild className="mb-2">
                <a href="/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </a>
              </Button>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                Disease Outbreak Map
              </h1>
              <p className="text-muted-foreground">
                Real-time visualization of disease outbreaks and risk zones in your region.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
                Refresh Data
              </Button>

              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button variant="warning" size="sm">
                    <AlertTriangle className="h-4 w-4" />
                    Report Outbreak
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Report Disease Outbreak</DialogTitle>
                    <DialogDescription>
                      Submit a new disease outbreak report required for immediate attention.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="disease">Disease Type</Label>
                      <Input id="disease" placeholder="e.g. African Swine Fever" value={formData.disease} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="Farm Name or Coordinates" value={formData.location} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="affected">Affected Animals</Label>
                      <Input id="affected" type="number" placeholder="Number of animals" value={formData.affected} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Describe symptoms and situation..." value={formData.description} onChange={handleChange} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="destructive" onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Report"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Alert Banner */}
          <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">Active Alert: H5N1 Outbreak</h3>
                <p className="text-sm text-muted-foreground">
                  Avian Influenza H5N1 confirmed 50km from your farm location. Review biosecurity protocols immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 border-t border-border" style={{ minHeight: "500px" }}>
          <OutbreakMap />
        </div>
      </main>
    </div>
  );
}
