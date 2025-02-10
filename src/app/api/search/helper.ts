import { AiAgentItem, AiAgentResponse } from "@/components/types";

/**
 * Parses the API response and returns a valid AiAgentResponse.
 * 
 * Expected input: an object with an "answer" property.
 * The "answer" property can be a stringified JSON array of AiAgentItem objects.
 */
export function parseAiAgentResponse(data: unknown): AiAgentResponse {
  // Default error response
  const defaultResponse: AiAgentResponse = { answer: [] };

  if (!data) {
    console.error("No data provided to parseAiAgentResponse.");
    return defaultResponse;
  }

  let parsedData: unknown = data;

  // 1. If data is a string, attempt to parse it as JSON.
  if (typeof data === "string") {
    try {
      console.debug("Raw JSON string:", data);
      parsedData = JSON.parse(data);
    } catch (err) {
      console.error("parseAiAgentResponse - JSON parsing error:", err);
      return defaultResponse;
    }
  }

  // 2. Ensure parsedData is an object.
  if (!parsedData || typeof parsedData !== "object") {
    console.error("parseAiAgentResponse - Parsed data is not a valid object:", parsedData);
    return defaultResponse;
  }

  // Cast to an object so we can access its properties.
  const responseObj = parsedData as Record<string, unknown>;

  // 3. Look for the "answer" property in the response.
  if (!("answer" in responseObj)) {
    console.error("parseAiAgentResponse - Missing 'answer' property in response:", responseObj);
    return defaultResponse;
  }

  let answerField = responseObj["answer"];

  // 4. If the answer field is a string, it may be a JSON stringified array.
  let items: unknown;
  if (typeof answerField === "string") {
    try {
      console.debug("Parsing 'answer' field as JSON:", answerField);
      items = JSON.parse(answerField);
    } catch (err) {
      console.error("parseAiAgentResponse - Error parsing the 'answer' field as JSON:", err);
      return defaultResponse;
    }
  } else {
    items = answerField;
  }

  // 5. Ensure that items is an array.
  if (!Array.isArray(items)) {
    console.error("parseAiAgentResponse - The 'answer' field is not an array:", items);
    return defaultResponse;
  }

  // 6. Validate each item in the array.
  const validItems: AiAgentItem[] = [];
  for (const [index, item] of items.entries()) {
    if (item && typeof item === "object") {
      const { answer, source } = item as Record<string, unknown>;
      if (typeof answer === "string" && typeof source === "string") {
        const trimmedAnswer = answer.trim();
        const trimmedSource = source.trim();

        // Only add if both fields are non-empty.
        if (trimmedAnswer && trimmedSource) {
          validItems.push({ answer: trimmedAnswer, source: trimmedSource });
        } else {
          console.warn(`Skipping entry with empty fields at index ${index}:`, item);
        }
      } else {
        console.warn(`Skipping invalid entry at index ${index}:`, item);
      }
    } else {
      console.warn(`Skipping non-object entry at index ${index}:`, item);
    }
  }

  return { answer: validItems };
}
