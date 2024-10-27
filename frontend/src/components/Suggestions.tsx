const suggestions = ["AI marketing tool", "Healthcare", "Food delivery"];

interface SuggestionsProps {
  onClick: (suggestion: string) => void;
}

const Suggestions = ({ onClick }: SuggestionsProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          className="bg-[#dcdbdb] text-gray-700 px-4 py-1 rounded-full text-sm"
          onClick={() => onClick(suggestion)}
        >
          {suggestion} ↖︎
        </button>
      ))}
    </div>
  );
};

export default Suggestions;
