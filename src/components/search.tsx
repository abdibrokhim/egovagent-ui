"use client"

import React from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Notification } from "@/components/ui/notification"
import { useEffect, useState } from "react"
import { loader } from "@/lib/getLoader"
import { SearchResultsData } from "./types"
import SearchResults from "./search-results"
import { getSearchSuggestions } from "@/lib/getSearchSuggestions"
import { getOnLoadWordList } from "@/lib/getOnLoadWordList"
import { AnimatedWordList } from "./onload-wordlist"
import { ScrollStyle } from "./ui/scroll-style"

export default function BookFinder() {
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  // sports: 607ff03a7b6428eee08802b8
  const [indexName, setIndexName] = useState("607ff03a7b6428eee08802b8")
  const [notification, setNotification] = useState<{
    message: string
    variant: "default" | "error" | "success" | "info"
  } | null>(null)

  const showNotification = (message: string, variant: "default" | "error" | "success" | "info") => {
    setNotification({ message, variant })
  }

  const [searchResults, setSearchResults] = useState<SearchResultsData>([
    {
      "answer": "It's 71 210-02-69",
      "source": "6107f6622a2e256d868e8796"
    }
  ]);
  const categories: string[][] = getSearchSuggestions();
  const onLoadWordList: string[] = getOnLoadWordList();

  // Validate input as user types
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;

    // 1) Enforce max length of 100 characters
    if (val.length > 100) {
      showNotification("You can't enter more than 100 characters.", "error");
      return;
    }

    // 2) Disallow JSON-like curly/square brackets
    if (/[{}\[\]]/.test(val)) {
      showNotification("No JSON data allowed.", "error");
      return;
    }

    // 3) Allow only basic Latin letters, numbers, spaces, and punctuation
    //    (Adjust the regex as needed to allow more symbols)
    const validRegex = /^[a-zA-Z0-9\s.,?!'"()]*$/;
    if (!validRegex.test(val)) {
      showNotification("Only Latin letters and standard punctuation are allowed.", "error");
      return;
    }

    setSearchQuery(val);
  };

  async function handleSearch(val: string) {
    // Clear search results if any
    if (searchResults.length !== 0) {
      setSearchResults([]);
    }

    setLoading(true);
    setSearchQuery(val);
    showNotification(`Searching for "${val}"...`, "info");

    // send search query and indexName to backend
    try {
      const response = await fetch(`/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ q: val, indexName: indexName }),
      });
      const data = await response.json();
      console.log('data', data);
      setSearchResults(data);
    } catch (error) {
      showNotification("Failed to fetch search results", "error");
    } 
    setLoading(false);
  };

  return (
    <div key={"search"} className="p-0">
      {notification && (
          <Notification
            message={notification.message}
            variant={notification.variant}
            onClose={() => setNotification(null)}
          />
        )}
      <ScrollStyle />

      {/* Main container with a fixed max width */}
      <div className="max-w-6xl mx-auto space-y-8 px-4 md:px-0">
        {/* Heading */}
        <h1 className="text-2xl md:text-3xl text-center">
          chillguy.devpost.com
        </h1>

        {/* Search bar */}
        <div className="relative max-w-2xl mx-auto">
          <Input
            type="text"
            placeholder="chillguy.devpost.com"
            className="w-full pl-6 pr-12 py-3 text-lg border-gray-300 rounded-full bg-white outline-none shadow-sm"
            value={searchQuery}
            onChange={handleChange}
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-2">
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-stone-400 hover:text-stone-600 focus:outline-none flex items-center justify-center"
                onClick={
                  () => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
            <Button 
              variant="default" 
              size="icon" 
              className="h-10 w-10"
              onClick={() => handleSearch(searchQuery)}
              >
              {loading ? loader() :
              <Search className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* 
        CATEGORIES SECTION 
        Full-width strip (outside max-w-6xl).
        You could also wrap this in its own container
        if you only want, say, max-w-5xl.
      */}
        <div className="w-screen max-w-full overflow-hidden mt-8">
          {categories.map((row, i) => (
            <div key={i} className="flex gap-3 py-1 animate-scroll whitespace-nowrap">
              {row.map((category, j) => (
                <Button
                  key={j}
                  variant="outline"
                  // Responsive text sizes: smaller on mobile, bigger on desktop
                  className=""
                  onClick={() => handleSearch(category)}
                >
                  {category}
                </Button>
              ))}
              {/* Duplicate categories for seamless loop */}
              {row.map((category, j) => (
                <Button
                  key={`duplicate-${j}`}
                  variant="outline"
                  className=""
                  onClick={() => handleSearch(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          ))}
        </div>

      {/* Results (still in a max-w container) */}
      <div className="mt-8 min-h-[4rem]">
        {loading ? (
          <AnimatedWordList words={onLoadWordList} />
        ) : (<div></div>)}
          {searchResults.length !== 0 && (
            <SearchResults data={searchResults} />
          )}
      </div>
    </div>
  )
}
