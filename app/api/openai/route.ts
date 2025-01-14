import { NextRequest, NextResponse } from "next/server";
import { requestOpenai, validateToken } from "../common";

async function makeRequest(req: NextRequest) {
  try {
    const api = await requestOpenai(req);
    const res = new NextResponse(api.body);
    res.headers.set("Content-Type", "application/json");
    res.headers.set("Cache-Control", "no-cache");
    return res;
  } catch (e) {
    console.error("[OpenAI] ", req.body, e);
    return NextResponse.json(
      {
        error: true,
        msg: JSON.stringify(e),
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(req: NextRequest) {
  const valid = await validateToken(req);
  if (!valid) {
    return NextResponse.json(
      {
        error: true,
        needAccessCode: false,
        msg: "请进行登录。",
      },
      {
        status: 401,
      },
    );
  }

  return makeRequest(req);
}

export async function GET(req: NextRequest) {
  const valid = await validateToken(req);
  if (!valid) {
    return NextResponse.json(
      {
        error: true,
        needAccessCode: false,
        msg: "请进行登录。",
      },
      {
        status: 401,
      },
    );
  }

  return makeRequest(req);
}
