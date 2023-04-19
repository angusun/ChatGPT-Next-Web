import { NextRequest, NextResponse } from "next/server";
import { requestLogin } from "../common";

async function makeRequest(req: NextRequest) {
  try {
    const api = await requestLogin(req);
    const res = new NextResponse(JSON.stringify(api.data));
    res.headers.set("Content-Type", "application/json");
    res.headers.set("Cache-Control", "no-cache");
    return res;
  } catch (e: any) {
    // console.error("[USER-LOGIN] ", req.body, e);
    return NextResponse.json(
      {
        error: true,
        msg: JSON.stringify(e?.response?.data?.message),
      },
      {
        status: e?.response?.status ?? 500,
      },
    );
  }
}

export async function POST(req: NextRequest) {
  console.log("[===================requestLogin=====================]", req);
  return makeRequest(req);
}
