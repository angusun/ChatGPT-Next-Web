import { NextRequest, NextResponse } from "next/server";

import { getServerSideConfig } from "../../config/server";
import { validateToken } from "../common";

const serverConfig = getServerSideConfig();

// Danger! Don not write any secret value here!
// 警告！不要在这里写入任何敏感信息！
const DANGER_CONFIG = {
  needCode: serverConfig.needCode,
};

declare global {
  type DangerConfig = typeof DANGER_CONFIG;
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
  return NextResponse.json({
    needCode: serverConfig.needCode,
  });
}
