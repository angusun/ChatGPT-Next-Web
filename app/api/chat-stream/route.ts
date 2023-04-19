import { createParser } from "eventsource-parser";
import { NextRequest, NextResponse } from "next/server";
import { requestOpenai, validateToken } from "../common";
// import jwt from "jsonwebtoken";
// const jwtSecret = "mySecret";

async function createStream(req: NextRequest) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await requestOpenai(req);

  const contentType = res.headers.get("Content-Type") ?? "";
  if (!contentType.includes("stream")) {
    const content = await (
      await res.text()
    ).replace(/provided:.*. You/, "provided: ***. You");
    console.log("[Stream] error ", content);
    return "```json\n" + content + "```";
  }

  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: any) {
        if (event.type === "event") {
          const data = event.data;
          // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      }

      const parser = createParser(onParse);
      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk, { stream: true }));
      }
    },
  });
  return stream;
}

export async function POST(req: NextRequest) {
  try {
    console.log("[PSOT======================]", req.body);

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

    const stream = await createStream(req);
    return new Response(stream);
  } catch (error) {
    console.error("[Chat Stream]", error);
    return new Response(
      ["```json\n", JSON.stringify(error, null, "  "), "\n```"].join(""),
    );
  }
}

export const config = {
  runtime: "nodejs",
};
