import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export default function HelpSupport() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container py-8 max-w-4xl">
                <div className="mb-8 text-center space-y-2">
                    <h1 className="text-3xl font-bold">Help & Support</h1>
                    <p className="text-muted-foreground">How can we assist you today?</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-10">
                    <Card className="flex flex-col items-center text-center p-6 hover:shadow-lg transition-shadow">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                            <Phone className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Call Support</h3>
                        <p className="text-sm text-muted-foreground mb-4">Speak directly with our support team.</p>
                        <Button variant="outline" className="mt-auto">+91 1800-BIO-FARM</Button>
                    </Card>

                    <Card className="flex flex-col items-center text-center p-6 hover:shadow-lg transition-shadow">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                            <Mail className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Email Us</h3>
                        <p className="text-sm text-muted-foreground mb-4">Send us your queries anytime.</p>
                        <Button variant="outline" className="mt-auto">support@biosecure.com</Button>
                    </Card>

                    <Card className="flex flex-col items-center text-center p-6 hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                            <MessageCircle className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
                        <p className="text-sm text-muted-foreground mb-4">Chat with our experts instantly.</p>
                        <Button variant="outline" className="mt-auto">Start Chat</Button>
                    </Card>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>How do I update my farm location?</AccordionTrigger>
                                <AccordionContent>
                                    Go to your Profile and select the &quot;Farm Details&quot; tab. You can update your GPS location and address there.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>How is the Biosecurity Score calculated?</AccordionTrigger>
                                <AccordionContent>
                                    The score is based on your answers to the Risk Assessment surveys and verification visits by our inspectors.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>Can I add multiple users to my farm?</AccordionTrigger>
                                <AccordionContent>
                                    Currently, each farm is linked to a single owner account. We are working on a multi-user feature for the next update.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger>What should I do during an outbreak alert?</AccordionTrigger>
                                <AccordionContent>
                                    Follow the immediate protocols listed in the alert notification. Isolate affected animals and contact your assigned veterinarian immediately.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>

                    <section>
                        <Card>
                            <CardHeader>
                                <CardTitle>Send us a Message</CardTitle>
                                <CardDescription>We usually respond within 24 hours.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input id="name" placeholder="Your name" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" placeholder="Your email" type="email" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject</Label>
                                        <Input id="subject" placeholder="What is this regarding?" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea id="message" placeholder="Type your message here..." className="min-h-[120px]" />
                                    </div>
                                    <Button className="w-full">Send Message</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </main>
        </div>
    );
}
