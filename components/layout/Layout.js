import React from "react";
import Header from "../ub-header";
import Footer from "../ub-footer";


function layout({children}) {
  return (
    <>
    <div className="d-flex w-100 vh-100 mx-auto flex-column">
      <Header/>
        {children}
      <Footer/>
    </div>
    </>
  );
}

export default layout