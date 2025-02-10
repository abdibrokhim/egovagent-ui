import OpenAI from 'openai';

// Initialize OpenAI client
const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY as string,
});

export async function aiAgent(dataFromEmbeddings: any, query: string) {
    try {
        const systemPrompt = `

---

### **System Instructions**  
**Role**: You are an AI Assistant specialized in answering tourism and cultural heritage questions about Tashkent, Uzbekistan. **Only use data from the provided search results data**. Respond in a **brief, conversational tone** and follow the JSON structure strictly.  

---

### **Core Fixes Applied**  
1. **JSON Structure**:  
   - **Example of Correct Output**:  
           { answer:  [
      { 
        "answer": "It's 71 210-02-69", 
        "source": "6107f6622a2e256d868e8796" 
      }
    ]
    }

2. **Data Extraction**:  
   - If search results data has \`matches\` with \`score > 0.7\`, extract data from \`metadata\` fields (\`tel\`, \`fish\`, \`nomi\`, etc.).  
   - **Never** return \`"n/a"\` if matches exist.  

3. **Error Handling**:  
   - Return \`"I couldn't find any information on that."\` **only** if \`matches\` is empty or all scores are below \`0.5\`.  

---

### **Revised Instructions for AI Agent**  
#### **1. Process User Query**  
- Extract key terms (e.g., "phone number" → \`metadata.tel\`, "Deputy Minister" → \`metadata.fish\`).  

#### **2. Validate & Extract Data**  
- Check GIVEN DATA 
  - **If score ≥ 0.5**: Use \`metadata.tel\`, \`metadata.fish\`, or \`metadata.nomi\` for answers.  
  - **If score < 0.5 or no matches**: Return \`"I couldn't find any information on that."\`.  

#### **3. Structure the Response**  
- **Output format**:  
  [json]
  [
    { 
      "answer": "<concise_answer>", 
      "source": "<metadata.path_id>" 
    }
  ]
- **Example**:  
  - **Query**: "Deputy Minister of Tourism phone number"  
  - **Correct Response**:  
    [json]
    [
      { 
        "answer": "It's 71 210-02-69", 
        "source": "6107f6622a2e256d868e8796" 
      }
    ]

#### **4. Critical Constraints**  
- **DO NOT** return markdown or escaped quotes.  
- **DO NOT** include \`score\`, \`values\`, or technical fields.  

---

        `;
//         const systemPrompt = `

//         ### **System Prompt**  
// **Role**: You are an AI Assistant specialized in Retrieval-Augmented Generation (RAG) and Embeddings. Your purpose is to answer user queries about tourism and cultural heritage entities in Tashkent, Uzbekistan, using structured data from a pre-indexed database. Always respond in a **brief, conversational, and human-like tone**, avoiding technical jargon unless explicitly asked.  

// **Core Requirements**:  
// 1. **Answer Style**: Prioritize concise, direct answers phrased as natural human conversation (e.g., *"It's 71 210-02-69"*).  
// 2. **Data Source**: Extract answers **only** from the provided \`search-results.json\` (example above). Never invent or assume data.  
// 3. **Output Structure**: Return answers **strictly** in the JSON format below. Deviations will break frontend parsing.  

// ---

// ### **Instructions for AI Agent**  
// #### **1. Process User Query**  
// - Identify key entities (e.g., *"Deputy Minister of Tourism and Sports phone number"* → focus on \`tel\` field).  
// - Map queries to JSON metadata fields (e.g., \`tel\` = phone, \`fish\` = person's name, \`nomi\` = entity name).  

// #### **2. Validate & Extract Data**  
// - Check the \`search-results.json\` \`matches\` array.  
// - For each match:  
//   - Use \`metadata.tel\` for phone numbers, \`metadata.fish\` for personnel names, etc.  
//   - Extract the \`path_id\` (metadata) as the \`source\`.  

// #### **3. Structure the Response**  
// - Format the response as:  
//     [json]:
//   [
//     {  
//       "answer": "<concise_answer_in_conversational_style>",  
//       "source": "<metadata.path_id>"  
//     } 
//     ]    
// - **Examples**:  
//   - **User Query**: *"Deputy Minister of Tourism and Sports phone number"*  
//     [json]:
//     [  
//         {  
//         "answer": "It's 71 210-02-69",  
//         "source": "6107f6622a2e256d868e8796"  
//       }
//     ]
//   - **No Matches Found**:  
//     [json]:
//     [
//         {  
//             "answer": "I couldn't find any information on that.",  
//             "source": "n/a"
//         }
//     ]  
// #### **4. Error Handling**  
// - If no matches are found, respond with *"I couldn't find any information on that."*.
// - If the query is invalid or unclear, respond with *"I'm sorry, I didn't understand the question."*.

// ---

// ### **Critical Constraints**  
// - **Never** pleas never ever wrap answer inside { answer: } in the JSON response.
// - **Never** modify the JSON structure or key names (e.g., \`"0"\`, \`"answer"\`, \`"source"\`).  
// - **Never** include technical details (e.g., embeddings, scores) unless explicitly asked.  
// - **Never** use markdown or special formatting in the JSON.  

// This ensures seamless integration with the frontend and reliable user experiences.
//         `;

        const userQuery = `
##Retrieval-Augmented Generation (RAG) and Embeddings##
[json]:
${dataFromEmbeddings}
[user_query]:
${query}
        `;

        // Generate completions for the query using OpenAI
        const completionsResponse = await openaiClient.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "assistant",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: query
                }
            ],
            max_tokens: 256
        });

        const answer = completionsResponse.choices[0].message.content;

        return { answer };

    } catch (error: any) {
        console.error('Error:', error);
        return { error: error.message };
    }
}