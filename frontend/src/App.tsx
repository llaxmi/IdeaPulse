import { useState } from "react";
import CompanyList from "./components/CompaniesList";

const App = () => {
  const [query, setQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);

  const suggestions = [
    "AI marketing tool",
    "Travel agency",
    "Organic meal delivery",
  ];

  const handleSearch = async (query: string) => {
    setQuery(query);
    if (!query.trim()) return; // Disable search if input is empty
    setIsSearching(true);
    try {
      const response = await fetch("http://localhost:3000/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: query }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }

      const { result } = await response.json();
      console.log("results", result);
      setResults(result);
    } catch (error) {
      console.error("Error during search:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
  };

  return (
    <div className="bg-gradient-to-r from-[#d6eaff] to-[#d8ede1] p-3 text-[#0e2e2e] h-screen flex flex-col items-center justify-center relative">
      <div className="absolute top-4 left-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 16L1 11h100L10 7z"
          />
        </svg>
      </div>
      <section className="py-8 mt-4 space-y-2 text-center max-w-5xl">
        <div className="space-y-2">
          <h1 className="font-outfit font-heading text-[30px] font-semibold tracking-normal md:text-[33px] lg:text-[35px]">
            Find Your Startup's Match:{" "}
            <span className="line-clamp-2">
              {" "}
              Discover YC-Funded Ideas Similar to Yours
            </span>
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Share your startup concept, and find similar ideas that have
            attracted funding.
          </p>
        </div>

        <section id="submit" className="flex flex-col items-center">
          <div className="p-4 w-5/6 flex justify-center">
            <div className="relative w-full">
              <textarea
                rows={2}
                className="w-full px-4 border-none py-2 text-sm rounded-lg outline-none ring-0 overflow-auto"
                spellCheck="false"
                placeholder="Describe your idea to IdeaFoundry"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                className="absolute right-2 top-8 text-gray-500"
                onClick={() => handleSearch(query)}
                disabled={isSearching || !query.trim()}
              >
                {isSearching ? (
                  <div className="flex space-x-1">
                    <p className="text-sm">analyzing</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="black"
                      strokeWidth="2"
                    >
                      <path
                        d="M 12 2 A 10 10 0 1 1 12 22"
                        stroke="grey"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  </div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="black"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((query, index) => (
              <button
                key={index}
                className="bg-gray-300 text-gray-700 px-4 py-1 rounded-full text-sm"
                onClick={() => handleSuggestionClick(query)}
              >
                {query} ↖︎
              </button>
            ))}
          </div>
        </section>
      </section>

      <div className="p-4 my-3 w-2/4 overflow-scroll  scroll-smooth">
        {isSearching ? (
          <p className="animate-pulse text-base text-center">...</p>
        ) : (
          <CompanyList companies={results} />
        )}
      </div>
      <footer className=" bg-[#0c2121] text-gray-100 absolute inset-x-0 bottom-0 text-center">
        <div className=" p-1 text-xs">
          <p>&copy; 2024 IdeaFoundry. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
