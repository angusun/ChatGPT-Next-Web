import { NextRequest, NextResponse } from "next/server";
import { requestAuth, validateToken } from "../common";

async function makeRequest(req: NextRequest) {
  try {
    const api = await requestAuth(req);
    console.log("api.data", api.data);
    const res = new NextResponse(JSON.stringify(api.data));
    res.headers.set("Content-Type", "application/json");
    res.headers.set("Cache-Control", "no-cache");
    return res;
  } catch (e: any) {
    console.error("[AUTH] ", req.body, e);
    return NextResponse.json(
      {
        error: true,
        msg: JSON.stringify(e),
      },
      {
        status: e?.response?.status ?? 500,
      },
    );
  }
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
