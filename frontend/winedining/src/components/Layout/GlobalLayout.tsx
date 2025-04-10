import React from "react";

const GlobalLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="app-wrapper">{children}</div>;
};

export default GlobalLayout;
