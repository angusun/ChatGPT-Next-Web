import { NextRequest, NextResponse } from "next/server";
// import { getServerSideConfig } from "./app/config/server";
// import md5 from "spark-md5";
// import redisClient from "./redis";
// import { request } from "http";

export const config = {
  matcher: ["/api/openai", "/api/chat-stream"],
};

// const validateToken = async (authToken: string) => {
//   const token = await redisClient.get("access_token");
//   if (token) {
//     return true;
//   } else {
//     let user = null;
//     const host = process.env.AUTH_URL + "/auth/info";
//     try {
//       const user = await fetch(host, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       });
//       console.log(user);
//       return true;
//     } catch (err) {
//       console.log("error:", err);
//     }
//   }
//   return false;
// };

// const serverConfig = getServerSideConfig();

export function middleware(req: NextRequest) {
  // const accessCode = req.headers.get("access-code");
  // const token = req.headers.get("token");
  // const hashedCode = md5.hash(accessCode ?? "").trim();

  // console.log("[Auth] allowed hashed codes: ", [...serverConfig.codes]);
  // console.log("[Auth] got access code:", accessCode);
  // console.log("[Auth] hashed access code:", hashedCode);

  // if (serverConfig.needCode && !serverConfig.codes.has(hashedCode) && !token) {
  //   return NextResponse.json(
  //     {
  //       error: true,
  //       needAccessCode: true,
  //       msg: "Please go settings page and fill your access code.",
  //     },
  //     {
  //       status: 401,
  //     },
  //   );
  // }
  // 从请求头里获取token 并验证token有效性
  // const authToken = req.headers.get("authorization")?.replace("Bearer ", "");
  // if (!authToken) {
  //   return NextResponse.json(
  //     {
  //       error: true,
  //       needAccessCode: false,
  //       msg: "Please login.",
  //     },
  //     {
  //       status: 401,
  //     },
  //   );
  // }
  // const isValid = validateToken(authToken);
  // if (!isValid) {
  //   return NextResponse.json(
  //     {
  //       error: true,
  //       needAccessCode: false,
  //       msg: "Please login.",
  //     },
  //     {
  //       status: 401,
  //     },
  //   );
  // }

  // inject api key
  // if (!token) {
  //   const apiKey = serverConfig.apiKey;
  //   if (apiKey) {
  //     console.log("[Auth] set system token");
  //     req.headers.set("token", apiKey);
  //   } else {
  //     return NextResponse.json(
  //       {
  //         error: true,
  //         msg: "Empty Api Key",
  //       },
  //       {
  //         status: 401,
  //       },
  //     );
  //   }
  // } else {
  //   console.log("[Auth] set user token");
  // }

  return NextResponse.next({
    request: {
      headers: req.headers,
    },
  });
}
