import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { stateDistrictMarketMap } from "@/data/stateDistrictMarketMap";
import { useTranslation } from "react-i18next";

interface FormData {
  state: string;
  district: string;
  market: string;
  landType: string;
  season: string;
  landSize: string;
}

interface CropAdvisoryFormProps {
  setResult: (result: any) => void;
  setError: (error: string | null) => void;
  onLoadingChange?: (loading: boolean) => void;
}

const landTypes = ["Loamy", "Clay", "Sandy", "Black"];
const seasons = ["Kharif", "Rabi", "Summer"];

export function CropAdvisoryForm({ setResult, setError, onLoadingChange }: CropAdvisoryFormProps) {
  const { t } = useTranslation();
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [availableMarkets, setAvailableMarkets] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    state: "",
    district: "",
    market: "",
    landType: "",
    season: "",
    landSize: "0",
  });
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
  const states = Object.keys(stateDistrictMarketMap);
  setAvailableStates(states)
  }, []);

  // ✅ 2. Fetch Districts when State changes
  useEffect(() => {
      const districts = formData.state ? Object.keys(stateDistrictMarketMap[formData.state] || {}) : [];
      setAvailableDistricts(districts);
      setFormData((prev) => ({ ...prev, district: "", market: "" }));
      setAvailableMarkets([]);
  }, [formData.state]);

  // ✅ 3. Fetch Markets when District changes
  useEffect(() => {
    if (formData.district) {
       const markets = stateDistrictMarketMap[formData.state]?.[formData.district] || [];
      setAvailableMarkets(markets);
      setFormData((prev) => ({ ...prev, market: "" }));
    }
  }, [formData.district]);

  // ✅ Optional: Debug formData
  useEffect(() => {
    console.log("Form Data:", formData);
  }, [formData]);

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    onLoadingChange?.(true);

    try {
      const requestBody = {
        soil_type: formData.landType,
        season: formData.season,
        state: formData.state,
        district: formData.district,
        market: formData.market || "Arambagh"
      };
      
      console.log("Request body:", requestBody);
      
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error("API Error:", result);
        setError(result.detail || `Error: ${response.status}`);
        setIsLoading(false);
        return;
      }
      
      console.log("API Response:", result);
      setResult(result);
      setIsLoading(false);
      onLoadingChange?.(false);
    } catch (error) {
      console.error("Request failed:", error);
      setError(error instanceof Error ? error.message : "Failed to get prediction");
      setIsLoading(false);
    }
      
  };

  return (
    <Card className="p-8 glass">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* -------------------- STATE DROPDOWN -------------------- */}
        <div className="space-y-2">
<Label htmlFor="state" className="text-base font-semibold">{t('form.state')}</Label>
          <Select
            value={formData.state}
            onValueChange={(value) => setFormData({ ...formData, state: value, district: "", market:"" })
            }
          >
            <SelectTrigger id="state" className="h-12">
<SelectValue placeholder={t('form.state')} />
            </SelectTrigger>
            <SelectContent>
              {(availableStates ?? []).map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* -------------------- DISTRICT DROPDOWN -------------------- */}
        <div className="space-y-2">
<Label htmlFor="district" className="text-base font-semibold">{t('form.district')}</Label>
          <Select
            value={formData.district}
            onValueChange={(value) =>
              setFormData({ ...formData, district: value, market:"" })
            }
            disabled={!formData.state}
          >
            <SelectTrigger id="district" className="h-12">
              <SelectValue
                placeholder={
                  formData.state
? t('form.district')
                    : t('form.state')
                }
              />
            </SelectTrigger>
            <SelectContent>
              {(availableDistricts ?? []).map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* -------------------- MARKET DROPDOWN -------------------- */}
        <div className="space-y-2">
<Label htmlFor="market" className="text-base font-semibold">{t('form.market')}</Label>
          <Select
            value={formData.market}
            onValueChange={(value) =>
              setFormData({ ...formData, market: value })
            }
            disabled={!formData.district}
          >
            <SelectTrigger id="market" className="h-12">
              <SelectValue
                placeholder={
                  formData.district
? t('form.market')
                    : t('form.district')
                }
              />
            </SelectTrigger>
            <SelectContent>
              {(availableMarkets ?? []).map((market) => (
                <SelectItem key={market} value={market}>
                  {market}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
{/* -------------------- landType DROPDOWN -------------------- */}
<div className="space-y-2">
<Label htmlFor="landType" className="text-base font-semibold">{t('form.landType')}</Label>
          <Select
            value={formData.landType}
            onValueChange={(value) => setFormData({ ...formData, landType: value })}
          >
            <SelectTrigger id="landType" className="h-12">
<SelectValue placeholder={t('form.landType')} />
            </SelectTrigger>
            <SelectContent>
              {landTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* -------------------- SEASON DROPDOWN -------------------- */}
        <div className="space-y-2">
<Label htmlFor="season" className="text-base font-semibold">{t('form.season') || 'Season'}</Label>
          <Select
            value={formData.season}
            onValueChange={(value) => setFormData({ ...formData, season: value })}
          >
            <SelectTrigger id="season" className="h-12">
<SelectValue placeholder={t('form.season')} />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((season) => (
                <SelectItem key={season} value={season}>
                  {season}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
<Label htmlFor="landSize" className="text-base font-semibold">{t('form.landSize')}</Label>
          <Input
            id="landSize"
            type="number"
placeholder={t('form.landSize')}
            value={formData.landSize}
            onChange={(e) => setFormData({ ...formData, landSize: e.target.value })}
            className="h-12 text-base"
            min="0.1"
            step="0.1"
          />
        </div>
<Button
          type="submit"
          size="lg"
          className="w-full h-12 text-base font-semibold"
          disabled={isLoading || !formData.state || !formData.district || !formData.landType || !formData.season || !formData.landSize}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {t('form.analyzing')}
            </>
          ) : (
            t('form.submit')
          )}
        </Button>
      </form>
    </Card>
  );
}
