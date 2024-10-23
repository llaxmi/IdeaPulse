import CompanyDetail from "./CompanyDetail";

interface Company {
  name: string;
  long_description: string;
  website: string;
  all_locations: string;
  one_liner: string;
}

interface CompanyListProps {
  companies: Company[];
}

const CompanyList = ({ companies }: CompanyListProps) => {
  return (
    <div className="flex w-full justify-center items-center flex-col space-y-4">
      {companies.length > 0 &&
        companies.map((company, index) => (
          <CompanyDetail key={index} company={company} />
        ))}
    </div>
  );
};
export default CompanyList;
