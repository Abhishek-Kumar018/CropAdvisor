import { useMemo, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CropAdvisoryForm } from "@/components/CropAdvisoryForm";
import { PredictionResultCard } from "@/components/PredictionResultCard";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Search, MapPin, CloudRain, Thermometer, Sun, Play, Sparkles, Brain, Sprout } from "lucide-react";

interface FormData {
  state: string;
  district: string;
  market: string;
  landType: string;
  landSize: string;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [apiResult, setApiResult] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);
  const [pendingResult, setPendingResult] = useState<any>(null);
  const pendingResultRef = useRef<any>(null);
  const resultTimeoutRef = useRef<number | null>(null);

  const top3 = (apiResult?.top_3 ?? []) as Array<{ crop: string; predicted_price: number; suitability_score: number; combined_score: number }>;

  // Mock current vs last year using predicted_price as base
  const productionData = useMemo(() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const base = top3.length ? top3[0].predicted_price : 5000;
    return months.map((m, i) => ({
      month: m,
      current: Math.round(base * (0.6 + 0.1 * (i % 5))),
      last: Math.round(base * (0.5 + 0.1 * ((i+2) % 5))),
    }));
  }, [top3]);

  const env = apiResult?.environment || {};
  const params = env?.derived_parameters || {};

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Header */}
      <section className="py-6 px-4 bg-gradient-to-br from-primary/10 via-emerald-50/50 to-background">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-1">{t('dashboard.title')}</h1>
              <p className="text-lg text-muted-foreground">{t('dashboard.subtitle')}</p>
            </div>
            <div className="relative max-w-3xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder={t('ui.searchPlaceholder')} className="pl-10 h-12 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Form + Results */}
      <section className="py-10 px-4">
        <div className={`max-w-6xl mx-auto grid gap-8 ${showForm ? 'lg:grid-cols-3' : ''}`}>
          {showForm && (
            <>
              <div className="lg:col-span-1 animate-in fade-in-50 slide-in-from-left-6">
                <CropAdvisoryForm 
                  setResult={(res) => { setPendingResult(res); pendingResultRef.current = res; }} 
                  setError={(err) => { setApiError(err); if (err) setShowForm(true); }} 
                  onLoadingChange={(loading) => {
                    if (loading) {
                      setShowSpinner(true);
                    } else {
                      if (resultTimeoutRef.current) window.clearTimeout(resultTimeoutRef.current);
                      resultTimeoutRef.current = window.setTimeout(() => {
                        const res = pendingResultRef.current;
                        if (res) {
                          setApiResult(res);
                          setPendingResult(null);
                          pendingResultRef.current = null;
                          setShowForm(false);
                        }
                        setShowSpinner(false);
                      }, 500);
                    }
                  }}
                />
                {apiError && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 font-medium">{apiError}</p>
                  </div>
                )}
              </div>

              {/* Right-side helper panel (visible only while form is shown) */}
              <div className="lg:col-span-2 animate-in fade-in-50 slide-in-from-right-6 relative min-h-[280px]">
                <Card className="p-8 glass">
                  <div className="flex items-start gap-6">
                    <div className="text-5xl leading-none">🌱</div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-emerald-600" />
                        <h3 className="text-2xl font-semibold">Enter your data to get ML recommendations</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">Tell us your soil, season and location. We’ll analyze prices and suitability to suggest the best crops for your land.</p>
                      <ul className="text-sm grid gap-2 md:grid-cols-3">
                        <li className="flex items-center gap-2"><Sprout className="h-4 w-4 text-emerald-600" /> Best-fit crop</li>
                        <li className="flex items-center gap-2"><Brain className="h-4 w-4 text-emerald-600" /> Profitability score</li>
                        <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-emerald-600" /> Top 3 picks</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                {/* Bottom helper tiles */}
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <Card className="p-6 glass">
                    <div className="text-xl">🧭</div>
                    <h4 className="mt-2 font-semibold">How it works</h4>
                    <p className="text-sm text-muted-foreground">We blend local price trends with soil suitability to rank crops for your field.</p>
                  </Card>
                  <Card className="p-6 glass">
                    <div className="text-xl">📝</div>
                    <h4 className="mt-2 font-semibold">Data to provide</h4>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      <li>State/District/Market</li>
                      <li>Soil type & season</li>
                      <li>Optional land size</li>
                    </ul>
                  </Card>
                  <Card className="p-6 glass">
                    <div className="text-xl">🔒</div>
                    <h4 className="mt-2 font-semibold">Your privacy</h4>
                    <p className="text-sm text-muted-foreground">Inputs are used only to compute recommendations and aren’t shared.</p>
                  </Card>
                </div>
                {showSpinner && (
                  <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
                    <div className="loadingspinner" aria-label="Loading">
                      <div id="square1"></div>
                      <div id="square2"></div>
                      <div id="square3"></div>
                      <div id="square4"></div>
                      <div id="square5"></div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {apiResult && !showForm && (
            <div className="lg:col-span-2 animate-in fade-in-50 slide-in-from-right-6">
              <div className="flex items-center justify-end mb-4">
<Button variant="glass" onClick={() => { setApiResult(null); setShowForm(true); }}>
                  {t('buttons.reenterDetails')}
                </Button>
              </div>
              <div className="space-y-8">
                {/* Top widgets */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="p-6 glass">
                    <div className="text-sm text-muted-foreground mb-4">{t('widgets.weatherToday')}</div>
                    <div className="flex items-center gap-6">
                      <div className="h-20 w-20 rounded-full border-8 border-primary/20 flex items-center justify-center">
                        <div className="text-2xl font-bold">{params.temperature ?? 29}<span className="text-sm">°C</span></div>
                      </div>
                      <div className="flex items-center flex-wrap gap-4 text-sm">
                        <div className="inline-flex items-center gap-2"><Thermometer className="h-4 w-4" /> Temp: {params.temperature ?? '—'}°C</div>
                        <div className="inline-flex items-center gap-2"><CloudRain className="h-4 w-4" /> Rainfall: {params.rainfall ?? '—'}mm</div>
                        <div className="inline-flex items-center gap-2"><Sun className="h-4 w-4" /> Humidity: {params.humidity ?? '—'}%</div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 overflow-hidden glass">
                    <div className="text-sm text-muted-foreground mb-2">{t('widgets.plantGrowth')}</div>
                    <ChartContainer config={{ price: { label: 'Combined', color: 'hsl(var(--primary))' } }} className="h-36 w-full">
                      <ResponsiveContainer>
                        <LineChart data={top3.map((t, i) => ({ name: t.crop, value: t.combined_score }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" hide />
                          <YAxis hide />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </Card>

                  <Card className="p-6 flex items-center justify-between glass">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">{t('widgets.location')}</div>
                      <div className="font-semibold flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> {env.state ?? '—'} {env.district ? `/ ${env.district}` : ''}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {env.soil_type && <Badge variant="secondary">{t('labels.soil')}: {env.soil_type}</Badge>}
                        {env.season && <Badge variant="secondary">{t('labels.season')}: {env.season}</Badge>}
                      </div>
                    </div>
                    <div className="text-5xl">🌿</div>
                  </Card>
                </div>

                {/* Summary of production */}
                <Card className="p-6 overflow-hidden glass">
                  <Tabs defaultValue="bar" className="w-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-semibold">{t('charts.summaryProduction')}</div>
                      <TabsList className="shrink-0">
                        <TabsTrigger value="bar">Bar</TabsTrigger>
                        <TabsTrigger value="line">Line</TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="bar">
                      {productionData && productionData.length > 0 ? (
                        <ChartContainer config={{ current: { label: 'Current', color: 'hsl(var(--primary))' }, last: { label: 'Last', color: 'hsl(var(--muted-foreground))' } }} className="h-72 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={productionData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip content={<ChartTooltipContent />} />
                              <Legend />
                              <Bar dataKey="current" fill="hsl(var(--primary))" radius={[6,6,0,0]} />
                              <Bar dataKey="last" fill="hsl(var(--muted-foreground))" radius={[6,6,0,0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      ) : (
                        <div className="flex items-center justify-center h-48 text-muted-foreground">{t('common.noData')}</div>
                      )}
                    </TabsContent>

                    <TabsContent value="line">
                      {productionData && productionData.length > 0 ? (
                        <ChartContainer config={{ current: { label: 'Current', color: 'hsl(var(--primary))' }, last: { label: 'Last', color: 'hsl(var(--muted-foreground))' } }} className="h-72 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={productionData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip content={<ChartTooltipContent />} />
                              <Legend />
                              <Line type="monotone" dataKey="current" stroke="hsl(var(--primary))" strokeWidth={3} />
                              <Line type="monotone" dataKey="last" stroke="hsl(var(--muted-foreground))" strokeWidth={3} />
                            </LineChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      ) : (
                        <div className="flex items-center justify-center h-48 text-muted-foreground">{t('common.noData')}</div>
                      )}
                    </TabsContent>
                  </Tabs>
                </Card>

                {/* Prediction details card */}
                <PredictionResultCard prediction={apiResult} />

                {/* Right-side info card */}
                <Card className="p-0 overflow-hidden glass">
                  <div className="p-6 bg-emerald-700 text-white flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold">{t('tile.verticalHarvestTitle')}</div>
                      <div className="text-sm opacity-90">{t('tile.verticalHarvestDesc')}</div>
                    </div>
                    <button className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 transition flex items-center justify-center">
                      <Play className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="p-6 text-sm text-muted-foreground">
                    Vertical farming can increase yield per area and optimize resource usage with controlled environments.
                  </div>
                </Card>
              </div>
            </div>
          )}

          {!apiResult && showForm && (
<div className="text-muted-foreground">{t('dashboard.prompt') || 'Submit the form to see your personalized dashboard.'}</div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
