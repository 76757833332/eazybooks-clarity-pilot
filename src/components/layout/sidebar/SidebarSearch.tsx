
import React from "react";

const SidebarSearch = () => {
  return (
    <div className="mx-3 mb-3 rounded-lg bg-secondary px-3 py-2 flex items-center gap-2">
      <span className="text-muted-foreground text-sm">Search...</span>
      <span className="ml-auto text-xs text-muted-foreground">⌘ S</span>
    </div>
  );
};

export default SidebarSearch;
