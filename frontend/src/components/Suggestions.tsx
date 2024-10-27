const suggestions = ["AI marketing tool", "Travel agency", "Food delivery"];

interface SuggestionsProps {
  onClick: (suggestion: string) => void;
}

const Suggestions = ({ onClick }: SuggestionsProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          className="bg-[#F5F5F5] text-gray-700 px-4 py-1 rounded-full text-sm"
          onClick={() => onClick(suggestion)} // Pass the suggestion to the onClick function
        >
          {suggestion} ↖︎
        </button>
      ))}
    </div>
  );
};

export default Suggestions;
