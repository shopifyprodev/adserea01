import { Heading, Page,TextField } from "@shopify/polaris";
import React, { useEffect, useState } from 'react';



export default function Index() {
  return (
    <Page>
      <Heading>
        Shopify app with Node and React Test 01 test {" "}
        <span role="img" aria-label="tada emoji">
          🎉
        </span>
      </Heading>
    </Page>
  );
}
