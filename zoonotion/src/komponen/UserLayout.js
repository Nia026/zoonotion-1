import React from "react";
import NavigationBar from "./Navbar";
import Footer from "./Footer"; 

function UserLayout({ children }) {
  return (
    <>
      <NavigationBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default UserLayout;