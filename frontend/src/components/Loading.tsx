export const Loading = () => {
  return (
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
  );
};

export const Searching = () => {
  return (
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
  );
};
