import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Ollama, OllamaEmbeddings } from "@langchain/ollama";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { formatDocumentsAsString } from "langchain/util/document";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const formatInstructions = `
Respond only in valid JSON. The JSON array should contain objects with the following schema: [{ "name": string, "website": "string", "all_locations": "string", "small_logo_thumb_url": "string", "one_liner": "string" }] strictly only from given.
If no similar ideas are found, respond with an empty JSON array: []
Strictly return only JSON with no additional text, comments, or line breaks outside of the JSON structures.
`;

async function run(query) {
  const loader = new JSONLoader("./mini2.json");

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
    // console.log(retrievedDocs);

    // Initialize LLM model
    const llm = new Ollama({ model: "llama3.1" });

    // Create the prompt template
    const prompt = ChatPromptTemplate.fromTemplate(`
      Based on the user's query: "{query}",
      Here is the doc  {docs} with relevant information,retrieve and list the most similar previously funded companies strictly.
      {formatInstructions}
    `);

    // Prepare partial prompt
    const partialPrompt = await prompt.partial({
      formatInstructions: formatInstructions,
      docs: formatDocumentsAsString(retrievedDocs),
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
