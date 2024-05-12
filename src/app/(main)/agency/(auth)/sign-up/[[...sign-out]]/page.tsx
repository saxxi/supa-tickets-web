import { SignUp } from "@clerk/nextjs";
import React from "react";

const Page = () => {
  return (
    <main className="flex justify-center mt-20">
      <SignUp path="/agency/sign-up" />
    </main>
  );
};

export default Page;
