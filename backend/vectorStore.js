import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Ollama, OllamaEmbeddings } from "@langchain/ollama";
import { config } from "dotenv";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

config();

async function run(question) {
  const loader = new JSONLoader("./dataa.json");

  try {
    // Load documents from the JSON file
    const docs = await loader.load();

    // Create a vector store from the loaded documents
    const vectorStore = await MemoryVectorStore.fromDocuments(
      docs,
      new OllamaEmbeddings({
        model: "nomic-embed-text",
      })
    );

    // Perform similarity search
    const result = await vectorStore.similaritySearch(question, 10);

    if (result.length === 0) {
      throw new Error(`No similar results found for the question: ${question}`);
    }

    // Initialize Ollama with the desired model
    const bot = new Ollama({
      model: "llama3.1",
    });

    const formatInstruction = `
    Response should contain an array of valid JSON objects, each containing fields: "name", "long_description", "all_locations", "one_liner", and "website".
    If no matching companies are found who have funded similar ideas before, return a JSON with the message: "No similar companies found.".
    `;

    const parser = new JsonOutputParser();

    const promptTemplate = ChatPromptTemplate.fromTemplate(
      `Extract the core idea from the user's input: {query}.
      Find and sort the most similar previously funded ideas based on relevance to the {query} from the given JSON data.
      {format_instructions}\n{query}`
    );

    // Combine the partial prompt template with the format instructions
    const finalPrompt = await promptTemplate.partial({
      format_instructions: formatInstruction,
    });

    const finalChain = finalPrompt.pipe(bot).pipe(parser);

    // Execute the chain
    const response = await finalChain.invoke({ query: question });

    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("An error occurred:", error.message);
    return null;
  }
}

export default run;
