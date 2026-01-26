import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { login, sendOTP, loginWithOTP } from "@/services/auth.service";
import { Loader2, Phone, Mail, KeyRound, ArrowLeft } from "lucide-react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

export default function Login() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [loginMode, setLoginMode] = useState<"password" | "otp">("password");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { toast } = useToast();

    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(identifier, password);
            toast({
                title: "Welcome back!",
                description: "You have successfully logged in.",
            });
            navigate("/dashboard");
        } catch (error: any) {
            toast({
                title: "Login failed",
                description: error.response?.data?.message || "Invalid credentials",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = async () => {
        if (!identifier) {
            toast({ title: "Identifier required", description: "Please enter your email or phone number", variant: "destructive" });
            return;
        }
        setLoading(true);
        try {
            await sendOTP(identifier);
            setOtpSent(true);
            toast({
                title: "OTP Sent!",
                description: "Please check your email or phone for the 6-digit code.",
            });
        } catch (error: any) {
            toast({
                title: "Failed to send OTP",
                description: error.response?.data?.message || "Something went wrong",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOTPLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            toast({ title: "Invalid OTP", description: "Please enter the 6-digit code", variant: "destructive" });
            return;
        }
        setLoading(true);
        try {
            await loginWithOTP(identifier, otp);
            toast({
                title: "OTP Verified!",
                description: "Welcome back to BioSecure.",
            });
            navigate("/dashboard");
        } catch (error: any) {
            toast({
                title: "Verification failed",
                description: error.response?.data?.message || "Invalid or expired OTP",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 bg-[url('https://www.transparenttextures.com/patterns/pinstripe-light.png')]">
            <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-card/80 backdrop-blur-md p-8 shadow-2xl">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <KeyRound className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">
                        Agent Login
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {loginMode === "password" ? "Enter your credentials to continue" : "Passwordless authentication"}
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    {/* Mode Toggle */}
                    <div className="flex rounded-lg bg-muted p-1">
                        <button
                            onClick={() => { setLoginMode("password"); setOtpSent(false); }}
                            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${loginMode === "password" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Password
                        </button>
                        <button
                            onClick={() => setLoginMode("otp")}
                            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${loginMode === "otp" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            OTP / Phone
                        </button>
                    </div>

                    {!otpSent ? (
                        <form onSubmit={loginMode === "password" ? handlePasswordLogin : (e) => { e.preventDefault(); handleSendOTP(); }} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="identifier">Email or Phone Number</Label>
                                <div className="relative">
                                    <Input
                                        id="identifier"
                                        placeholder="farmer@example.com or +91..."
                                        className="pl-10"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        required
                                    />
                                    <span className="absolute left-3 top-2.5 text-muted-foreground">
                                        {identifier.includes("@") ? <Mail className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
                                    </span>
                                </div>
                            </div>

                            {loginMode === "password" && (
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <Button type="submit" className="w-full h-11" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (loginMode === "password" ? "Sign In" : "Send OTP")}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleOTPLogin} className="space-y-6 text-center">
                            <button
                                type="button"
                                onClick={() => setOtpSent(false)}
                                className="flex items-center text-xs text-primary hover:underline mb-2"
                            >
                                <ArrowLeft className="h-3 w-3 mr-1" />
                                Edit phone/email
                            </button>

                            <div className="space-y-4">
                                <Label className="text-lg">Enter 6-digit code</Label>
                                <p className="text-sm text-muted-foreground">Sent to {identifier}</p>
                                <div className="flex justify-center">
                                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                        </InputOTPGroup>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-11" disabled={loading || otp.length !== 6}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify & Sign In"}
                            </Button>

                            <p className="text-xs text-muted-foreground">
                                Didn't receive the code?{" "}
                                <button type="button" onClick={handleSendOTP} className="text-primary hover:underline font-medium">Resend</button>
                            </p>
                        </form>
                    )}

                    <div className="mt-8 text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/register" className="font-bold text-primary hover:text-primary/80 transition-colors">
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
