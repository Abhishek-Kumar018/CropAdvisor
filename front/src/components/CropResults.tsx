import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Sparkles, Droplets, Bug, Thermometer, Clock } from "lucide-react";

interface CropRecommendation {
  name: string;
  price: string;
  pricePerUnit: string;
}

interface SuitableCrop {
  name: string;
  waterRequirement: string;
  fertilizer: string;
  idealTemperature: string;
  pesticide: string;
  harvestTime: string;
}

interface CropResultsProps {
  profitableCrops: CropRecommendation[];
  suitableCrop: SuitableCrop;
}

export function CropResults({ profitableCrops, suitableCrop }: CropResultsProps) {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-700">
      {/* Top 3 Profitable Crops */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Top 3 Profitable Crops</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {profitableCrops.map((crop, index) => (
            <Card
              key={index}
              className="p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elevated)] transition-shadow duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <Badge variant="secondary" className="font-semibold">
                  #{index + 1}
                </Badge>
              </div>
              <h3 className="text-xl font-bold mb-2">{crop.name}</h3>
              <p className="text-3xl font-bold text-primary mb-1">{crop.price}</p>
              <p className="text-sm text-muted-foreground">{crop.pricePerUnit}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Most Suitable Crop */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-accent" />
          <h2 className="text-2xl font-bold">AI-Recommended Crop</h2>
        </div>
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-[var(--shadow-elevated)]">
          <div className="flex items-center gap-3 mb-6">
            <Badge className="text-lg px-4 py-2 bg-primary">Most Suitable</Badge>
            <h3 className="text-3xl font-bold">🌾 {suitableCrop.name}</h3>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-6">
              Based on your soil type and local weather conditions
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <Droplets className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Water Requirement</p>
                  <p className="text-sm text-muted-foreground">{suitableCrop.waterRequirement}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Bug className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Pesticide Usage</p>
                  <p className="text-sm text-muted-foreground">{suitableCrop.pesticide}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Thermometer className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Ideal Temperature</p>
                  <p className="text-sm text-muted-foreground">{suitableCrop.idealTemperature}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Time to Harvest</p>
                  <p className="text-sm text-muted-foreground">{suitableCrop.harvestTime}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-background rounded-lg">
              <p className="font-semibold mb-2">Fertilizer Recommendation</p>
              <p className="text-sm text-muted-foreground">{suitableCrop.fertilizer}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
