// types.tsx
export interface AiAgentItem {
    answer: string;
    source: string;
  }
  
  export interface AiAgentResponse {
    [key: string]: AiAgentItem;
  }
  
  export function parseAiAgentResponse(data: unknown): AiAgentResponse {
    // Default error response
    const errorResponse: AiAgentResponse = {};
  
    // If there's no data, return empty response
    if (!data) {
      console.error("No data provided to parseAiAgentResponse.");
      return errorResponse;
    }
  
    let parsedData: unknown = data;
  
    // 1. If data is a string, attempt to parse as JSON
    if (typeof data === "string") {
      try {
        console.debug("Raw JSON string:", data);
        parsedData = JSON.parse(data);
      } catch (err) {
        console.error("parseAiAgentResponse - JSON parsing error:", err);
        return errorResponse;
      }
    }
  
    // 2. Ensure parsedData is an object and not null or an array
    if (
      !parsedData ||
      typeof parsedData !== "object" ||
      Array.isArray(parsedData)
    ) {
      console.error("parseAiAgentResponse - Parsed data is not a valid object:", parsedData);
      return errorResponse;
    }
  
    // Cast to an object for iteration
    const responseObject = parsedData as Record<string, unknown>;
  
    // Prepare final result
    const result: AiAgentResponse = {};
  
    // 3. Validate each item; skip invalid entries
    for (const key in responseObject) {
      const item = responseObject[key] as Record<string, unknown>;
  
      // Basic structure validation
      if (!item || typeof item !== "object") {
        console.warn(`Skipping non-object item at key "${key}":`, item);
        continue;
      }
  
      const { answer, source } = item;
      // Check if 'answer' and 'source' are strings
      if (typeof answer === "string" && typeof source === "string") {
        const trimmedAnswer = answer.trim();
        const trimmedSource = source.trim();
  
        // Optional: Check for non-empty strings
        if (!trimmedAnswer || !trimmedSource) {
          console.warn(
            `Skipping entry with empty fields at key "${key}":`,
            item
          );
          continue;
        }
  
        // Valid item, add to result
        result[key] = {
          answer: trimmedAnswer,
          source: trimmedSource,
        };
      } else {
        // Skip if any required property is missing or not a string
        console.warn(`Skipping invalid item at key "${key}":`, item);
      }
    }
  
    // Return collected valid results
    return result;
  }
  