import { Analytics } from "@vercel/analytics/react";

import { Home } from "./components/home";

import { getServerSideConfig } from "./config/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Header from "./components/header";

const serverConfig = getServerSideConfig();

export default async function App() {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  if (!token) {
    redirect("/user/login");
  }
  return (
    <>
      <Header></Header>
      <Home />
      {serverConfig?.isVercel && <Analytics />}
    </>
  );
}
