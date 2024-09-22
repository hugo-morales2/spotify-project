import React, { ReactNode, FC } from "react";
import Navbar from "./Navbar"; // Import your Navbar component

interface layoutProps {
  children?: ReactNode;
}

const Layout: FC<layoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex flex-col min-h-0">{children}</main>
    </div>
  );
};

export default Layout;
