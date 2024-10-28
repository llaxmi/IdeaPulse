interface CompanyDetailProps {
  company: {
    name: string;
    small_logo_thumb_url: string;
    website: string;
    all_locations: string;
    one_liner: string;
  };
}

const CompanyDetail = ({ company }: CompanyDetailProps) => {
  return (
    <div className="bg-white/80 space-x-4 p-4 rounded-md shadow-md w-full flex items-center ">
      <img
        src={
          company?.small_logo_thumb_url ||
          `https://logo.clearbit.com/${company.website.replace(
            /^https?:\/\//,
            ""
          )}`
        }
        alt={`${company?.name || "Company"} logo`}
        className="rounded-full h-14 w-14"
        onError={(e) => {
          const target = e.target as HTMLImageElement; // Cast to HTMLImageElement
          target.onerror = null; // Prevents infinite loop
          target.src = `https://logo.clearbit.com/${company.website.replace(
            /^https?:\/\//,
            ""
          )}`;
        }}
      />

      <div className="flex flex-col space-y-1">
        <h3 className="text-lg font-semibold text-[#092635] ">
          {company.name}
        </h3>
        <p className="text-xs font-normal text-gray-800">
          📍{company.all_locations}
        </p>
        {/* <details className="mb-4">
        <p className="text-gray-800 mb-4 text-balance">
          {company.long_description}
        </p>
      </details> */}
        <p className="text-sm text-gray-800">{company.one_liner}</p>
        <a
          href={company.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 text-xs hover:text-blue-600 transition-all duration-500"
        >
          Visit website
        </a>
      </div>
    </div>
  );
};
export default CompanyDetail;
