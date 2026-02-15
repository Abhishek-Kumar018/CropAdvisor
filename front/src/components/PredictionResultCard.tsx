import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Tooltip as UiTooltip, TooltipContent as UiTooltipContent, TooltipProvider, TooltipTrigger as UiTooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp, Sparkles, BarChart3, Filter, ArrowRight, AlertCircle, Info } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

type Top3Item = {
  crop: string;
  predicted_price: number | null;
  suitability_score: number;
  combined_score: number;
};

type NewPredictionShape = {
  suitable_crop?: string;
  most_profitable_crop?: string;
  most_profitable_price?: number | null;
  top_3?: Top3Item[];
  environment?: {
    soil_type?: string;
    season?: string;
    state?: string;
    district?: string;
    market?: string;
    derived_parameters?: {
      N?: number;
      P?: number;
      K?: number;
      temperature?: number;
      humidity?: number;
      ph?: number;
      rainfall?: number;
    };
  };
  scoring_weights?: { 
    price_weight?: number; 
    suitability_weight?: number 
  };
  debug_info?: {
    total_crops_evaluated?: number;
    crops_with_prices?: number;
    crops_without_prices?: number;
  };
};

interface PredictionResultCardProps {
  prediction: NewPredictionShape;
}

export function PredictionResultCard({ prediction }: PredictionResultCardProps) {
  const [metric, setMetric] = useState<'price' | 'suitability' | 'combined'>('combined');
  const { t } = useTranslation();

  const hasRich = Array.isArray(prediction?.top_3);

  if (hasRich) {
    const env = prediction.environment || {};
    const params = env.derived_parameters || {};
    const weights = prediction.scoring_weights || {};
    const top3 = (prediction.top_3 || []).slice(0, 3);

    // Sort with null-safe comparison
    const sortedTop3 = [...top3].sort((a, b) => {
      if (metric === 'price') {
        const priceA = a.predicted_price ?? 0;
        const priceB = b.predicted_price ?? 0;
        return priceB - priceA;
      }
      if (metric === 'suitability') return b.suitability_score - a.suitability_score;
      return b.combined_score - a.combined_score;
    });

    // Prepare chart data
    const chartData = sortedTop3.map((t, idx) => ({
      name: t.crop,
      rank: idx + 1,
      price: t.predicted_price ?? 0,
      suitability: t.suitability_score,
      combined: t.combined_score,
    }));

    const COLORS = ['#10B981', '#059669', '#047857'];

    return (
      <div className="space-y-6">
        {/* Header Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Most Suitable Crop */}
          <Card className="p-6 hover:shadow-lg transition-shadow glass">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-green-600" />
                <span>{t('rec.mostSuitable')}</span>
              </div>
              <h3 className="text-3xl font-bold text-green-700 capitalize">
                {prediction.suitable_crop || "—"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Best environmental match
              </p>
            </div>
          </Card>

          {/* Most Profitable Crop */}
          <Card className="p-6 hover:shadow-lg transition-shadow glass">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span>{t('rec.mostProfitable')}</span>
              </div>
              <h3 className="text-3xl font-bold text-blue-700 capitalize">
                {prediction.most_profitable_crop || "—"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {prediction.most_profitable_price 
                  ? `₹${prediction.most_profitable_price.toLocaleString('en-IN')}/quintal`
                  : t('common.unavailable')
                }
              </p>
            </div>
          </Card>

          {/* Scoring Weights */}
          <Card className="p-6 hover:shadow-lg transition-shadow glass">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span>{t('rec.scoringWeights')}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Price</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {((weights.price_weight ?? 0.6) * 100).toFixed(0)}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Suitability</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {((weights.suitability_weight ?? 0.4) * 100).toFixed(0)}%
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Card */}
        <Card className="p-6 glass">
          <div className="space-y-6">
            {/* Crop Recommendation Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">🌾 {t('rec.title')}</h3>
              </div>
              
              {/* Filter Tabs */}
              <Tabs value={metric} onValueChange={(v) => setMetric(v as any)} className="w-auto">
                <TabsList className="grid grid-cols-3 gap-1">
                  <TabsTrigger value="combined" className="text-xs px-3">
                    {t('rec.filters.ranking')}
                  </TabsTrigger>
                  <TabsTrigger value="price" className="text-xs px-3">
                    {t('rec.filters.profitability')}
                  </TabsTrigger>
                  <TabsTrigger value="suitability" className="text-xs px-3">
                    {t('rec.filters.suitability')}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Top 3 Crop Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sortedTop3.map((item, idx) => (
                <Card 
                  key={idx}
                  className={`p-4 border-2 transition-all glass ${
                    idx === 0 ? 'border-green-500 shadow-md' : 'border-gray-200'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <Badge variant={idx === 0 ? "default" : "secondary"} className="text-xs">
                        #{idx + 1}
                      </Badge>
                      {idx === 0 && (
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-xl font-bold capitalize">{item.crop}</h4>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">{t('rec.price')}</span>
                        {item.predicted_price ? (
                          <span className="font-semibold text-green-700">
                            ₹{item.predicted_price.toLocaleString('en-IN')}
                          </span>
                        ) : (
<span className="text-gray-400 italic text-xs">{t('common.na')}</span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">{t('rec.suitability')}</span>
                        <span className="font-semibold">{item.suitability_score.toFixed(1)}%</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">{t('rec.combined')}</span>
                        <span className="font-semibold text-blue-700">{item.combined_score.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Detailed Table */}
            <div className="rounded-lg border glass">
              <div className="bg-muted/50 px-4 py-3 border-b flex items-center gap-2">
                <h4 className="text-sm font-medium">{t('rec.combinedScore')}</h4>
                <TooltipProvider>
                  <UiTooltip>
                    <UiTooltipTrigger className="inline-flex items-center"><Info className="h-4 w-4 text-muted-foreground" /></UiTooltipTrigger>
                    <UiTooltipContent>Weighted score based on price (60%) and suitability (40%)</UiTooltipContent>
                  </UiTooltip>
                </TooltipProvider>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">{t('rec.rank') || 'Rank'}</TableHead>
                    <TableHead>{t('rec.crop') || 'Crop'}</TableHead>
                    <TableHead className="text-right">{t('rec.price')} (₹/quintal)</TableHead>
                    <TableHead className="w-28">
                      <TooltipProvider>
                        <UiTooltip>
                          <UiTooltipTrigger asChild>
                            <div className="w-full text-right flex items-center justify-end gap-1">
                              <span>Suitability</span>
                            </div>
                          </UiTooltipTrigger>
                          <UiTooltipContent>
                            {t('rec.envMatchScore')}
                          </UiTooltipContent>
                        </UiTooltip>
                      </TooltipProvider>
                    </TableHead>
                    <TableHead className="text-right">{t('rec.combined')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTop3.map((item, idx) => (
                    <TableRow key={idx} className={idx === 0 ? "bg-green-50" : ""}>
                      <TableCell className="font-medium">
                        <Badge variant={idx === 0 ? "default" : "outline"}>#{idx + 1}</Badge>
                      </TableCell>
                      <TableCell className="font-medium capitalize">{item.crop}</TableCell>
                      <TableCell className="text-right">
                        {item.predicted_price ? (
                          <span className="font-semibold">₹{item.predicted_price.toLocaleString('en-IN')}/qtl</span>
                        ) : (
<span className="text-gray-400 text-sm italic">{t('common.unavailable')}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">{item.suitability_score.toFixed(1)}%</TableCell>
                      <TableCell className="text-right font-semibold text-blue-700">
                        {item.combined_score.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Score Distribution Chart */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">{t('rec.scoreDistribution')}</h4>
              <div className="h-64">
                {chartData && chartData.length > 0 ? (
                  <ChartContainer
                    config={{
                      combined: { label: 'Combined', color: 'hsl(var(--primary))' },
                      price: { label: 'Price', color: 'hsl(var(--muted-foreground))' },
                      suitability: { label: 'Suitability', color: '#16a34a' },
                    }}
                    className="w-full h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="name" 
                          className="text-xs"
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <YAxis 
                          className="text-xs"
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                          domain={metric === 'price' ? [0, 'auto'] : [0, 100]}
                        />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Bar 
                          dataKey={metric === 'price' ? 'price' : metric === 'suitability' ? 'suitability' : 'combined'} 
                          radius={[8, 8, 0, 0]}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                      <p>{t('common.noData')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-2">{t('rec.notePerQuintal')}</p>

            {/* Debug Info (if available) */}
            {prediction.debug_info && (
              <Card className="p-4 bg-muted/30">
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Total crops evaluated:</span>
                    <span className="font-medium">{prediction.debug_info.total_crops_evaluated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Crops with price data:</span>
                    <span className="font-medium text-green-700">{prediction.debug_info.crops_with_prices}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Crops without price data:</span>
                    <span className="font-medium text-orange-700">{prediction.debug_info.crops_without_prices}</span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // Fallback for legacy format
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Prediction Result</h3>
        <p>Predicted Price: ₹{prediction.predicted_price?.toLocaleString('en-IN') || "N/A"}</p>
        {prediction.top_crops && (
          <div>
            <p className="font-medium">Top Crops:</p>
            <ul className="list-disc list-inside">
              {prediction.top_crops.map((crop, i) => (
                <li key={i} className="capitalize">{crop}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
