import { Heading, Page,TextField } from "@shopify/polaris";
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";

function Index(props){
  async function UploadProduct(){
    const res = await axios.post("/uploadproduct");
    toast.success(res.data);
  }  


  return (
    <Page>

<Toaster />

      <Heading>
      Adserea App {" "}
        <span role="img" aria-label="tada emoji">
          
        </span>
      </Heading>
      <p>Click button to upload Demo Products.</p>
      <input value="Upload Demo Product" type="button" className="btn btn-info" onClick={UploadProduct}
      ></input>


    </Page>
  );
}
export default Index;