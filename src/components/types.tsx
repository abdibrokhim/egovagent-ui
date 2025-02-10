// Each item now represents a single agent response.
export interface AiAgentItem {
    answer: string;
    source: string;
}
  
  // The overall response contains an "answer" property with an array of items.
export interface AiAgentResponse {
    answer: AiAgentItem[];
}