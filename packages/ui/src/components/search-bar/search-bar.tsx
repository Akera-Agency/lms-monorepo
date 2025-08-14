import Input from "../form/input";
import { Search } from "lucide-react";

const SearchBar = ({ placeholder = "Search" }: { placeholder?: string }) => {
  return (
    <div className="relative hidden w-80 md:block">
      <Input
        placeholder={placeholder}
        className="w-full rounded-full h-11 border border-indigo-100 ps-12"
      />
      <Search className="absolute left-4 top-2.5 w-5 text-gray-500" />
    </div>
  );
};

export default SearchBar;
