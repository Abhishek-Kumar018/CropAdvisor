import React, { useState, useEffect, useMemo } from 'react';

// --- TYPE DEFINITIONS ---

/**
 * Defines the structure of a single crop price record.
 * We normalize header names (e.g., "Min_x0020_Price" becomes "min_price").
 */
interface CropData {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  grade: string;
  arrival_date: string;
  min_price: number;
  max_price: number;
  modal_price: number;
}

/**
 * Defines the shape of the filters the user can apply.
 */
interface Filters {
  state: string;
  district: string;
  commodity: string;
}

// --- CONSTANTS ---
const CSV_FILE_PATH = 'crop_price.csv'; // Corrected path
const MAX_DISPLAY_ROWS = 200;

// --- DATA SERVICE (The "Offline API") ---

/**
 * This object will hold our data and methods, acting as a singleton service.
 */
const dataService = {
  _data: [] as CropData[],
  _isLoaded: false,
  _loadPromise: null as Promise<void> | null,

  /**
   * Normalizes CSV header names.
   * "State" -> "state", "Min_x0020_Price" -> "min_price"
   */
  _normalizeHeader: (header: string): string => {
    return header
      .trim()
      .toLowerCase()
      .replace(/_x0020_/g, '_');
  },

  /**
   * Parses raw CSV text into an array of CropData objects.
   */
  _parseCSV: (text: string): CropData[] => {
    const rows = text.split(/\r?\n/);
    if (rows.length === 0) return [];

    // Extract and normalize headers
    const headers = rows[0].split(',').map(h => dataService._normalizeHeader(h));
    
    // Get indices for our key fields
    const stateIdx = headers.indexOf('state');
    const districtIdx = headers.indexOf('district');
    const marketIdx = headers.indexOf('market');
    const commodityIdx = headers.indexOf('commodity');
    const varietyIdx = headers.indexOf('variety');
    const gradeIdx = headers.indexOf('grade');
    const arrivalDateIdx = headers.indexOf('arrival_date');
    const minPriceIdx = headers.indexOf('min_price');
    const maxPriceIdx = headers.indexOf('max_price');
    const modalPriceIdx = headers.indexOf('modal_price');

    const parsedData: CropData[] = [];

    // Start from 1 to skip header row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row) continue; // Skip empty lines

      const values = row.split(',');

      // Basic validation
      if (values.length >= headers.length) {
        try {
          const record: CropData = {
            state: values[stateIdx]?.trim() || 'N/A',
            district: values[districtIdx]?.trim() || 'N/A',
            market: values[marketIdx]?.trim() || 'N/A',
            commodity: values[commodityIdx]?.trim() || 'N/A',
            variety: values[varietyIdx]?.trim() || 'N/A',
            grade: values[gradeIdx]?.trim() || 'N/A',
            arrival_date: values[arrivalDateIdx]?.trim() || 'N/A',
            min_price: parseFloat(values[minPriceIdx]) || 0,
            max_price: parseFloat(values[maxPriceIdx]) || 0,
            modal_price: parseFloat(values[modalPriceIdx]) || 0,
          };
          parsedData.push(record);
        } catch (e) {
          console.warn(`Skipping unparseable row ${i}: ${row}`, e);
        }
      }
    }
    return parsedData;
  },

  /**
   * Loads the CSV data from the file.
   * This is idempotent - it only fetches and parses the data once.
   */
  loadData: async function (): Promise<void> {
    if (this._isLoaded) {
      return Promise.resolve();
    }

    if (this._loadPromise) {
      return this._loadPromise;
    }

    this._loadPromise = (async () => {
      try {
        const response = await fetch(CSV_FILE_PATH);
        if (!response.ok) {
          throw new Error(`Failed to fetch CSV: ${response.statusText}`);
        }
        const csvText = await response.text();
        this._data = this._parseCSV(csvText);
        this._isLoaded = true;
        console.log(`Loaded and parsed ${this._data.length} records.`);
      } catch (error) {
        console.error("Error loading data:", error);
        throw error; // Re-throw to be caught by the component
      } finally {
        this._loadPromise = null;
      }
    })();

    return this._loadPromise;
  },

  /**
   * Gets all unique, sorted values for a given data key.
   * Used to populate filter dropdowns.
   */
  getUniqueValues: function (key: keyof CropData): string[] {
    if (!this._isLoaded) return [];
    const valueSet = new Set<string>();
    for (const record of this._data) {
      const value = record[key];
      if (typeof value === 'string' && value.trim() && value !== 'N/A') {
        valueSet.add(value.trim());
      }
    }
    return Array.from(valueSet).sort();
  },

  /**
   * Searches the loaded data based on the provided filters.
   * This is our "offline API" fetch call.
   */
  search: function (filters: Partial<Filters>): CropData[] {
    if (!this._isLoaded) return [];

    const { state, district, commodity } = filters;

    return this._data
      .filter(record => {
        const stateMatch = !state || record.state === state;
        const districtMatch = !district || record.district === district;
        const commodityMatch = !commodity || record.commodity === commodity;
        return stateMatch && districtMatch && commodityMatch;
      });
  },
};

// --- REACT COMPONENT ---

/**
 * A reusable dropdown component.
 */
interface FilterSelectProps {
  label: string;
  name: keyof Filters;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
}

const FilterSelect: React.FC<FilterSelectProps> = ({ label, name, value, options, onChange, disabled }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-600">
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
    >
      <option value="">All {label}s</option>
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

/**
 * Main Application Component
 */
const App: React.FC = () => {
  // --- STATE ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filter dropdown options
  const [uniqueStates, setUniqueStates] = useState<string[]>([]);
  const [uniqueDistricts, setUniqueDistricts] = useState<string[]>([]);
  const [uniqueCommodities, setUniqueCommodities] = useState<string[]>([]);
  
  // State for current filter values
  const [filters, setFilters] = useState<Filters>({
    state: '',
    district: '',
    commodity: '',
  });

  // State for search results
  const [results, setResults] = useState<CropData[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // --- EFFECTS ---

  // Effect to load data and populate filters on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        setError(null);
        setIsLoading(true);
        await dataService.loadData();
        
        // Once data is loaded, populate the dropdowns
        setUniqueStates(dataService.getUniqueValues('state'));
        setUniqueDistricts(dataService.getUniqueValues('district'));
        setUniqueCommodities(dataService.getUniqueValues('commodity'));
        
      } catch (err) {
        if (err instanceof Error) {
          setError(`Failed to load data. Please ensure 'crop_price.csv' is in the same directory. Error: ${err.message}`);
        } else {
          setError('An unknown error occurred while loading data.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    initialize();
  }, []);

  // --- HANDLERS ---

  /**
   * Update filter state when a dropdown changes.
   * Resets dependent filters (e.g., changing state resets district).
   */
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target as { name: keyof Filters; value: string };
    
    setFilters(prev => {
      const newFilters = { ...prev, [name]: value };
      
      // If state changes, reset district
      if (name === 'state') {
        newFilters.district = '';
      }
      
      return newFilters;
    });
  };

  /**
   * Run the search when the user clicks the "Search" button.
   */
  const handleSearch = () => {
    setHasSearched(true);
    const searchResults = dataService.search(filters);
    setResults(searchResults);
  };
  
  /**
   * Reset all filters and search results.
   */
  const handleReset = () => {
    setFilters({ state: '', district: '', commodity: '' });
    setResults([]);
    setHasSearched(false);
  };

  // --- MEMOIZED VALUES ---
  
  // Filter district options based on selected state
  const availableDistricts = useMemo(() => {
    if (!filters.state) return uniqueDistricts; // Show all if no state selected
    
    // This is a bit slow on large datasets, but fine for this "offline" demo.
    // A better way would be to pre-compute this map on load.
    const districtsInState = new Set<string>();
    dataService._data.forEach(record => {
      if (record.state === filters.state) {
        districtsInState.add(record.district);
      }
    });
    return Array.from(districtsInState).sort();
  }, [filters.state, uniqueDistricts]);
  
  const limitedResults = results.slice(0, MAX_DISPLAY_ROWS);

  // --- RENDER ---
  return (
    <div className="font-inter min-h-screen w-full bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Offline Crop Price API</h1>
          <p className="text-gray-600 mt-1">Search and filter crop data loaded from <code>crop_price.csv</code>.</p>
        </header>

        {/* --- Loading and Error States --- */}
        {isLoading && (
          <div className="text-center p-10 bg-white rounded-lg shadow">
            <p className="text-blue-600 font-medium">Loading data from CSV...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* --- Main Content (Filters & Results) --- */}
        {!isLoading && !error && (
          <>
            {/* --- Filter Card --- */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Filters</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <FilterSelect
                  label="State"
                  name="state"
                  value={filters.state}
                  options={uniqueStates}
                  onChange={handleFilterChange}
                  disabled={uniqueStates.length === 0}
                />
                <FilterSelect
                  label="District"
                  name="district"
                  value={filters.district}
                  options={availableDistricts}
                  onChange={handleFilterChange}
                  disabled={availableDistricts.length === 0}
                />
                <FilterSelect
                  label="Commodity"
                  name="commodity"
                  value={filters.commodity}
                  options={uniqueCommodities}
                  onChange={handleFilterChange}
                  disabled={uniqueCommodities.length === 0}
                />
              </div>
              <div className="flex items-center gap-4">
                 <button
                  onClick={handleSearch}
                  className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Search
                </button>
                 <button
                  onClick={handleReset}
                  className="px-5 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* --- Results Card --- */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700">
                  Results
                  {hasSearched && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      (Found {results.length} records{results.length > MAX_DISPLAY_ROWS ? `, showing first ${MAX_DISPLAY_ROWS}` : ''})
                    </span>
                  )}
                </h2>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto">
                {limitedResults.length > 0 ? (
                  <table className="w-full text-sm text-left text-gray-700">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3">State</th>
                        <th scope="col" className="px-4 py-3">District</th>
                        <th scope="col" className="px-4 py-3">Market</th>
                        <th scope="col" className="px-4 py-3">Commodity</th>
                        <th scope="col" className="px-4 py-3">Variety</th>
                        <th scope="col" className="px-4 py-3">Min Price</th>
                        <th scope="col" className="px-4 py-3">Max Price</th>
                        <th scope="col" className="px-4 py-3">Modal Price</th>
                        <th scope="col" className="px-4 py-3">Arrival Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {limitedResults.map((item, index) => (
                        <tr key={index} className="bg-white hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{item.state}</td>
                          <td className="px-4 py-3">{item.district}</td>
                          <td className="px-4 py-3">{item.market}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">{item.commodity}</td>
                          <td className="px-4 py-3">{item.variety}</td>
                          <td className="px-4 py-3 text-right">{item.min_price.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">{item.max_price.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right font-bold">{item.modal_price.toFixed(2)}</td>
                          <td className="px-4 py-3">{item.arrival_date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center p-10 text-gray-500">
                    {hasSearched ? 'No results found for your criteria.' : 'Click "Search" to see results.'}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;

// --- NEW API ENDPOINTS ---

/**
 * Fetches crop prediction data from the external ML Advisor API.
 */
async function getMLPrediction(input: {
  soil_type: string;
  season: string;
  state: string;
  district: string;
  market: string;
}): Promise<{
  predicted_price: number;
  suitable_crop: string;
  top_crops: string[];
}> {
  try {
    const response = await fetch("https://cropadvisorml.onrender.com/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`ML Advisor API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching ML prediction:", error);
    throw error;
  }
}

/**
 * Calculates the top 3 profitable crops based on local crop price data.
 */
async function getTop3ProfitableCrops(input: {
  soil_type: string;
  season: string;
  state: string;
  district: string;
  market: string;
}): Promise<{
  top_crops: string[];
}> {
  try {
    await dataService.loadData(); // Ensure data is loaded

    // Filter data based on input
    const filteredData = dataService.search({
      state: input.state,
      district: input.district,
    });

    // Calculate average price for each commodity
    const commodityPrices: { [commodity: string]: number[] } = {};
    filteredData.forEach((item) => {
      if (!commodityPrices[item.commodity]) {
        commodityPrices[item.commodity] = [];
      }
      commodityPrices[item.commodity].push(item.modal_price);
    });

    const avgCommodityPrices: { [commodity: string]: number } = {};
    for (const commodity in commodityPrices) {
      const prices = commodityPrices[commodity];
      const sum = prices.reduce((a, b) => a + b, 0);
      avgCommodityPrices[commodity] = sum / prices.length;
    }

    // Sort commodities by average price in descending order
    const sortedCommodities = Object.entries(avgCommodityPrices)
      .sort(([, priceA], [, priceB]) => priceB - priceA)
      .map(([commodity]) => commodity);

    // Get the top 3 commodities
    const top3Crops = sortedCommodities.slice(0, 3);

    return { top_crops: top3Crops };
  } catch (error) {
    console.error("Error calculating top 3 crops:", error);
    throw error;
  }
}

export { getMLPrediction, getTop3ProfitableCrops };