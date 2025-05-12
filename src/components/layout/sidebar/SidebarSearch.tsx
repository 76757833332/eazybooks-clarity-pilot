
import React from "react";
import { Search } from "lucide-react";
import { GlobalSearch } from "@/components/search/GlobalSearch";

const SidebarSearch = () => {
  return (
    <div className="mx-3 mb-3">
      <GlobalSearch />
    </div>
  );
};

export default SidebarSearch;
