import { SignIn } from "@clerk/nextjs";
import React from "react";

const Page = () => {
  return (
    <main className="flex justify-center mt-20">
      <SignIn path="/agency/sign-in" />
    </main>
  );
};

export default Page;
