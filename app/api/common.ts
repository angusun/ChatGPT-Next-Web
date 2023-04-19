import { NextRequest, NextResponse } from "next/server";
import redisClient from "../../redis";
import axios from "axios";

const OPENAI_URL = "api.openai.com";
const DEFAULT_PROTOCOL = "https";
const PROTOCOL = process.env.PROTOCOL ?? DEFAULT_PROTOCOL;
const BASE_URL = process.env.BASE_URL ?? OPENAI_URL;

export async function requestOpenai(req: NextRequest) {
  const apiKey = req.headers.get("token");
  const openaiPath = req.headers.get("path");

  console.log("[Proxy] ", openaiPath);
  console.log("requestOpenai", req.body);

  return fetch(`${PROTOCOL}://${BASE_URL}/${openaiPath}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    method: req.method,
    body: req.body,
  });
}

export async function requestAuth(req: NextRequest) {
  const host = process.env.AUTH_URL + "/auth/info";

  return axios.request({
    url: host,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.get("authorization"),
    },
  });
}

export async function requestLogin(req: NextRequest) {
  const host = process.env.AUTH_URL + "/auth/login";

  return axios.request({
    url: host,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: req.body,
  });
}

export async function validateToken(req: NextRequest): Promise<boolean> {
  const authToken = req.headers.get("authorization")?.replace("Bearer ", "");
  console.log(authToken, "notoken");
  if (!authToken) {
    return false;
  }
  let token = null;
  // try {
  //   token = await redisClient.get(authToken);
  // } catch (err) {
  //   console.log("redis get error:", err);
  // }
  // console.log("token", token);
  if (token) {
    return true;
  } else {
    const host = process.env.AUTH_URL + "/auth/info";
    try {
      const res = await axios.request({
        url: host,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log("user res", res.status);
      if (res.status == 200 && res.data.username) {
        // await redisClient.set(authToken, res.data.username, 60 * 60 * 8);
        return true;
      }
      return false;
    } catch (err) {
      console.log("error:", err);
      return false;
    }
  }
}
