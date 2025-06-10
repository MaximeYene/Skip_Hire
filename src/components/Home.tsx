"use client";

import { useState } from "react";
import { Input } from "@headlessui/react";
import { MapPin, Truck, Search } from "lucide-react";

interface AddressDetails {
  postcode: string;
  country: string;
  region: string;
  admin_district: string;
  parish: string;
  parliamentary_constituency: string;
}

interface HomeProps {
  onContinue: () => void;
  onAddressSelect: (address: AddressDetails) => void;
}

export default function Home({ onContinue, onAddressSelect }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedAddressDetails, setSelectedAddressDetails] = useState<AddressDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setSelectedAddressDetails(null);

    if (query.length > 2) {
      try {
        const response = await fetch(
          `https://api.postcodes.io/postcodes/${encodeURIComponent(query)}/autocomplete`
        );
        const data = await response.json();
        if (data.status === 200 && data.result) {
          setSuggestions(data.result.slice(0, 8));
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectAddress = async (postcode: string) => {
    setSearchQuery(postcode);
    setShowSuggestions(false);
    setSuggestions([]);
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`
      );
      const data = await response.json();

      if (data.status === 200) {
        setSelectedAddressDetails(data.result);
        onAddressSelect(data.result);
      } else {
        console.error("Postcode not found:", data.error);
        setSelectedAddressDetails(null);
      }
    } catch (error) {
      console.error("Failed to fetch postcode details:", error);
      setSelectedAddressDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="p-3 bg-orange-500/20 rounded-full hidden md:block">
              <Truck className="h-16 w-16 text-orange-500" />
            </div>
            <div>
              <h1 className="text-7xl font-bold text-white tracking-tight leading-none">
                SKIP HIRE
              </h1>
              <p className="text-3xl text-orange-400 font-light italic mt-2">
                With A Difference
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white mb-2">
                Enter Your Location
              </h2>
              <p className="text-slate-400">
                We'll find the best skip hire options in your area
              </p>
            </div>

            <div className="relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-slate-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Start typing your delivery postcode..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                  className="w-full h-16 text-lg bg-slate-700/50 border-2 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl pl-12 pr-4 transition-all duration-200"
                />
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-xl shadow-2xl z-10 max-h-80 overflow-y-auto">
                  {suggestions.map((postcode, index) => (
                    <button
                      key={index}
                      onMouseDown={() => selectAddress(postcode)}
                      className="w-full text-left px-6 py-4 hover:bg-slate-700/70 text-white border-b border-slate-700/50 last:border-b-0 transition-all duration-150 first:rounded-t-xl last:rounded-b-xl"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                          <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
                        </div>
                        <span className="text-base">{postcode}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isLoading && (
              <div className="text-center text-slate-400 pt-4">
                Loading address details...
              </div>
            )}

            {selectedAddressDetails && !isLoading && (
              <div className="pt-6 mt-4 border-t border-slate-700 text-left text-white bg-slate-900/40 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-orange-400 mb-4">
                  Location Details
                </h3>
                <div className="flex flex-col gap-x-8 gap-y-4 text-lg">
                  {Object.entries({
                    Postcode: selectedAddressDetails.postcode,
                    "Town/City": selectedAddressDetails.admin_district,
                    Region: selectedAddressDetails.region,
                    Parish: selectedAddressDetails.parish,
                  }).map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center space-x-2 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50"
                    >
                      <span className="font-semibold text-orange-400">
                        {label}:
                      </span>
                      <span className="text-white">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <button
                    className="w-full flex justify-center items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-orange-500/20"
                    onClick={onContinue}
                  >
                    <span>Continue</span>
                    <Truck className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            <div className="text-center pt-4">
              <p className="text-slate-500 text-sm">
                • Fast delivery • Competitive prices
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-slate-600 text-sm font-mono">Version 1.1.34</p>
        </div>
      </div>
    </div>
  );
}