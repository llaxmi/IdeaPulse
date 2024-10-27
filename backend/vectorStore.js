import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Ollama, OllamaEmbeddings } from "@langchain/ollama";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const formatInstructions = `
Respond only in valid JSON. The JSON array should contain objects with the following schema: [{ "name": string, "website": "string", "all_locations": "string", "logo": "string", "one_liner": "string" }]
If no similar ideas are found, respond with an empty JSON array: []
Strictly return only JSON with no additional text, comments, or line breaks outside of the JSON structures.
`;

async function run(query) {
  const loader = new JSONLoader("./minData.json");

  try {
    // Load documents
    const docs = await loader.load();

    // Initialize Vector Store
    const vectorStore = await MemoryVectorStore.fromDocuments(
      docs,
      new OllamaEmbeddings({ model: "nomic-embed-text" })
    );

    // Create a retriever for similarity search
    const retriever = vectorStore.asRetriever({
      k: 10,
      searchType: "similarity",
    });

    // Perform similarity search
    const retrievedDocs = await retriever.invoke(query);
    if (!retrievedDocs || retrievedDocs.length === 0) {
      return JSON.stringify([]); // Return empty JSON array if no similar ideas are found
    }

    // Extract necessary fields directly from the retrieved documents
    const extractedData = retrievedDocs.map((doc) => {
      const { name, website, all_locations, logo, one_liner } = doc.pageContent;
      return { name, website, all_locations, logo, one_liner };
    });

    const formattedDocs = JSON.stringify(extractedData);

    // Initialize LLM model
    const llm = new Ollama({ model: "llama3.1" });

    // Create the prompt template
    const prompt = ChatPromptTemplate.fromTemplate(`
      Based on the user's query: "{query}",
      retrieve and list the most similar previously funded companies from the documents below.
      Documents:
      {docs}
      {format_instructions}
    `);

    // Prepare partial prompt
    const partialPrompt = await prompt.partial({
      format_instructions: formatInstructions,
      docs: formattedDocs, // Using the extracted data for LLM processing
    });

    // Build the chain and invoke
    const chain = partialPrompt.pipe(llm).pipe(new JsonOutputParser());
    const result = await chain.invoke({ query });

    return result;
  } catch (error) {
    console.error(
      "An error occurred while processing the query:",
      error.message
    );
    return JSON.stringify({
      message: "Restart your llm. Please try again later.",
    });
  }
}

export default run;
