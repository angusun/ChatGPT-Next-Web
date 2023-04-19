import { NextRequest, NextResponse } from "next/server";

const OPENAI_URL = "api.openai.com";
const DEFAULT_PROTOCOL = "https";
const PROTOCOL = process.env.PROTOCOL ?? DEFAULT_PROTOCOL;
const BASE_URL = process.env.BASE_URL ?? OPENAI_URL;

export async function requestOpenai(req: NextRequest) {
  const apiKey = req.headers.get("token");
  const openaiPath = req.headers.get("path");

  console.log("[Proxy] ", openaiPath);

  return fetch(`${PROTOCOL}://${BASE_URL}/${openaiPath}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    method: req.method,
    body: req.body,
  });
}

export async function validateToken(req: NextRequest): Promise<boolean> {
  const authToken = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!authToken) {
    return false;
  }
  let token = null;
  if (token) {
    return true;
  } else {
    const host = process.env.AUTH_URL + "/auth/info";
    try {
      const res = await fetch(host, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (res.status == 200) {
        return true;
      }
      return false;
    } catch (err) {
      console.log("NetWork Error", err);
      return false;
    }
  }
}
