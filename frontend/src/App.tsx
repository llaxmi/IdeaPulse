import { useState } from "react";
import CompanyList from "./components/CompaniesList";
import Footer from "./components/Footer";
import { Loading, Searching } from "./components/Loading";
import Suggestions from "./components/Suggestions";
import idea from "/idea.png";

const App = () => {
  const [query, setQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (inputQuery: string) => {
    const trimmedQuery = inputQuery.trim();
    if (!trimmedQuery) return;

    setQuery(trimmedQuery);
    setIsSearching(true);

    try {
      const response = await fetch("http://localhost:3000/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: trimmedQuery }),
      });

      if (!response.ok) throw new Error("Failed to fetch results");

      const { result } = await response.json();
      if (!result) {
        return;
      }
      setResults(result);
    } catch (error) {
      console.error("Error during search:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) =>
    handleSearch(suggestion);

  const renderSearchButton = () => (
    <button
      type="button"
      className="absolute right-2 top-3 text-gray-500"
      onClick={() => handleSearch(query)}
      disabled={isSearching || !query.trim()}
    >
      {isSearching ? <Loading /> : <Searching />}
    </button>
  );

  const renderSearchInput = () => (
    <div className="relative w-full">
      <input
        type="text"
        className="w-full px-4 border-none py-3 text-sm rounded-lg outline-none"
        spellCheck="false"
        placeholder="Describe your idea to IdeaFoundry"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      {renderSearchButton()}
    </div>
  );

  return (
    <div className="bg-gradient-to-r from-[#efefe9] via-[#f2e9dc88] to-[#dcf6e8] p-3 text-[#223030] h-screen flex flex-col items-center justify-center relative">
      <div className="absolute top-4 left-4">
        <img
          src={idea}
          alt="Descriptive text for the image"
          className="h-12 w-12"
        />
      </div>

      <section className="py-8 mt-4 space-y-6 text-center max-w-5xl">
        <header className="space-y-2">
          <h1 className="font-outfit font-heading text-[30px] font-semibold md:text-[33px] lg:text-[35px]">
            Find Your Startup's Match:{" "}
            <span className="line-clamp-2">
              Discover YC-Funded Ideas Similar to Yours
            </span>
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Share your startup concept, and find similar ideas that have
            attracted funding.
          </p>
        </header>

        <section id="submit" className="flex flex-col items-center">
          <div className="p-4 w-full flex justify-center">
            {renderSearchInput()}
          </div>
          <Suggestions onClick={handleSuggestionClick} />
        </section>
      </section>

      <div className="p-4 my-3 w-2/4 overflow-scroll">
        {isSearching ? (
          <p className="animate-pulse text-base text-center">...</p>
        ) : (
          <CompanyList companies={results} />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default App;
