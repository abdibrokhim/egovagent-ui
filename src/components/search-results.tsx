"use client"

import { Card, CardContent } from "@/components/ui/card"
import { SearchResultsData } from "./types"
import { ExternalLink } from "lucide-react";

export default function SearchResults({ data }: { data: SearchResultsData }) {
  // Convert the object to an array we can map over
  const resultsArray = Object.values(data).filter((item) => typeof item === "object" && "answer" in item && "source" in item)

  const sourcePath = "https://data.egov.uz/eng/data";

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4 md:px-0">
      <Card className="bg-white shadow-sm border-stone-200">
        <CardContent className="p-6">
          {resultsArray.map((result, index) => (
            <div 
              key={index} 
              className="mb-4 last:mb-0 flex">
              {/* Answer */}
              <p className="text-gray-800 text-sm md:text-base">
                {result.answer}
                <span 
                  onClick={
                    () => window.open(`${sourcePath}/${result.source}`, '_blank')
                  }
                  className="ml-1 bg-stone-100 rounded-md px-1.5 py-1.5 text-xs font-mono text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer">
                    source
                    <ExternalLink className="ml-1 h-3 w-3 inline" />
                </span>
                .
              </p>
              {
               index !== resultsArray.length - 1 && <hr className="border-stone-100 my-4" />
              }
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
