import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
import api from "@/lib/api";

export default function Analytics() {
    const [stats, setStats] = useState<any[]>([]);
    const [riskFactors, setRiskFactors] = useState<any[]>([]);
    const [riskHistory, setRiskHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDisease, setSelectedDisease] = useState("Avian Influenza");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, riskRes, historyRes] = await Promise.all([
                    api.get("/analytics/stats"),
                    api.get("/analytics/risk-factors"),
                    api.get("/risk-assessment/history")
                ]);
                setStats(statsRes.data);
                setRiskFactors(riskRes.data);
                setRiskHistory(historyRes.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching analytics data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter data based on selection
    const filteredStats = stats.filter(s => s.diseaseType === selectedDisease);

    // Aggregated by Year
    const yearlyData = Object.values(filteredStats.reduce((acc: any, curr) => {
        if (!acc[curr.year]) {
            acc[curr.year] = { year: curr.year, deaths: 0, outbreaks: 0 };
        }
        acc[curr.year].deaths += curr.deaths;
        acc[curr.year].outbreaks += curr.outbreaks;
        return acc;
    }, {})).sort((a: any, b: any) => a.year - b.year);

    // Top 5 States by Deaths
    const stateData = Object.values(filteredStats.reduce((acc: any, curr) => {
        if (!acc[curr.state]) {
            acc[curr.state] = { state: curr.state, deaths: 0 };
        }
        acc[curr.state].deaths += curr.deaths;
        return acc;
    }, {})).sort((a: any, b: any) => b.deaths - a.deaths).slice(0, 5);

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container py-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Disease Analytics</h1>
                        <p className="text-muted-foreground">Real-time data insights and trend analysis</p>
                    </div>
                    <Select value={selectedDisease} onValueChange={setSelectedDisease}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Disease" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Avian Influenza">Avian Influenza</SelectItem>
                            <SelectItem value="African Swine Fever">African Swine Fever</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Recorded Deaths</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {filteredStats.reduce((sum, curr) => sum + curr.deaths, 0).toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                For {selectedDisease} (2021-2023)
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Outbreaks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {filteredStats.reduce((sum, curr) => sum + curr.outbreaks, 0).toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Reported Incidents
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Affected States</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {new Set(filteredStats.map(s => s.state)).size}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Unique Regions
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="trends" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="trends">Trends Analysis</TabsTrigger>
                        <TabsTrigger value="regional">Regional Impact</TabsTrigger>
                        <TabsTrigger value="risk">Risk Factors</TabsTrigger>
                        <TabsTrigger value="history">Your Progress</TabsTrigger>
                    </TabsList>

                    <TabsContent value="trends" className="space-y-4">
                        <Card className="p-6">
                            <CardHeader>
                                <CardTitle>Yearly Trend: Deaths vs Outbreaks</CardTitle>
                                <CardDescription>Comparative analysis over the last 3 years</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={yearlyData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="year" />
                                        <YAxis yAxisId="left" />
                                        <YAxis yAxisId="right" orientation="right" />
                                        <Tooltip />
                                        <Legend />
                                        <Line yAxisId="left" type="monotone" dataKey="deaths" stroke="#8884d8" name="Deaths" />
                                        <Line yAxisId="right" type="monotone" dataKey="outbreaks" stroke="#82ca9d" name="Outbreaks" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="regional" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="p-6">
                                <CardHeader>
                                    <CardTitle>Top 5 Most Affected States</CardTitle>
                                    <CardDescription>By total number of deaths</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stateData} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis dataKey="state" type="category" width={100} />
                                            <Tooltip />
                                            <Bar dataKey="deaths" fill="#8884d8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="p-6">
                                <CardHeader>
                                    <CardTitle>State Distribution</CardTitle>
                                    <CardDescription>Proportion of total cases</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={stateData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={150}
                                                fill="#8884d8"
                                                dataKey="deaths"
                                                nameKey="state"
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {stateData.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="risk" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Risk Multipliers</CardTitle>
                                <CardDescription>Impact of various factors on disease spread risk</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="relative w-full overflow-auto">
                                    <table className="w-full caption-bottom text-sm">
                                        <thead className="[&_tr]:border-b">
                                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Risk Factor</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ASF Multiplier</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">AI Multiplier</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Evidence</th>
                                            </tr>
                                        </thead>
                                        <tbody className="[&_tr:last-child]:border-0">
                                            {riskFactors.map((factor) => (
                                                <tr key={factor.id} className="border-b transition-colors hover:bg-muted/50">
                                                    <td className="p-4 align-middle font-medium">{factor.factor.replace(/_/g, " ")}</td>
                                                    <td className="p-4 align-middle">
                                                        <span className={`px-2 py-1 rounded-full text-xs ${factor.asfRiskMultiplier >= 3 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                            {factor.asfRiskMultiplier}x
                                                        </span>
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        <span className={`px-2 py-1 rounded-full text-xs ${factor.aiRiskMultiplier >= 3 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                            {factor.aiRiskMultiplier}x
                                                        </span>
                                                    </td>
                                                    <td className="p-4 align-middle">{factor.evidence ? "✅ Verified" : "⚠️ Pending"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="history" className="space-y-4">
                        <Card className="p-6">
                            <CardHeader>
                                <CardTitle>Biosecurity Score Trend</CardTitle>
                                <CardDescription>Tracking your farm's risk level over time</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                {riskHistory.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={[...riskHistory].reverse()}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="createdAt"
                                                tickFormatter={(str) => new Date(str).toLocaleDateString()}
                                            />
                                            <YAxis domain={[0, 100]} />
                                            <Tooltip
                                                labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                                            />
                                            <Legend />
                                            <Line type="monotone" dataKey="score" stroke="#2d6a4f" strokeWidth={3} name="Biosecurity Score" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                        <p>No assessment history found.</p>
                                        <Button className="mt-4" asChild>
                                            <a href="/risk-assessment">Take Your First Assessment</a>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {riskHistory.slice(0, 6).map((item) => (
                                <Card key={item.id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-sm font-medium">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </CardTitle>
                                            <Badge
                                                variant={item.level === 'high' ? 'destructive' : 'secondary'}
                                                className={
                                                    item.level === 'low' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                                                        item.level === 'medium' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : ''
                                                }
                                            >
                                                {item.level} risk
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{item.score}%</div>
                                        <p className="text-xs text-muted-foreground">
                                            {item.recommendations.length} recommendations
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
