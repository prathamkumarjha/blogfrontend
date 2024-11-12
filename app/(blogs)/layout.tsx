import React from "react";
import Nav from "./components/navbar";

interface NavLayoutProps {
  children: React.ReactNode; // Correctly define the 'children' prop type
}

const NavLayout: React.FC<NavLayoutProps> = ({ children }) => {
  return (
    <div>
      <Nav />
      {children} {/* Render the children */}
    </div>
  );
};

export default NavLayout;
