import { NextRequest } from "next/server";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { User } from "@/server/payload/payload-types";
import { Request } from "express";
import { SECRET_COOKIE_NAME } from "../models/constants";

export const getServerSideUser = async (
  cookies: NextRequest["cookies"] | ReadonlyRequestCookies,
) => {
  const token = cookies.get(SECRET_COOKIE_NAME)?.value;

  const meRes = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const { user } = (await meRes.json()) as { user: User | null };

  return { user };
};

export const getNestedField = <T>(
  collection: T | string,
  field: keyof T,
): string => {
  return typeof collection === "string"
    ? collection
    : (collection?.[field] as string);
};

export const validateAccess = async (request: Request) => {
  // validate
  const cookieStore = request.cookies;
  let token = "";
  if (SECRET_COOKIE_NAME in cookieStore) {
    const tokenCookie = cookieStore[SECRET_COOKIE_NAME];

    if (typeof tokenCookie !== "undefined") {
      token = tokenCookie;
    }
  }
  if (token.length === 0) {
    return undefined;
  }
  try {
    // Convert the string to a Uint8Array
    const encoder = new TextEncoder();
    const secretData = encoder.encode(process.env.PAYLOAD_SECRET!);

    // Create a hash of the secret
    const hashBuffer = await crypto.subtle.digest("SHA-256", secretData);

    // Convert the hash to a hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Slice the first 32 characters
    const secret = hashHex.slice(0, 32);

    const [headerB64, payloadB64, signatureB64] = token.split(".");
    const header = JSON.parse(atob(headerB64));
    const payload = JSON.parse(atob(payloadB64));
    return payload;

    // // console.log([headerB64, payloadB64].join("."));
    // console.log("payload:", payload);

    // const data = new TextEncoder().encode([headerB64, payloadB64].join("."));
    // const signature = Uint8Array.from(atob(signatureB64.trim()), (c) => c.charCodeAt(0));
  } catch (err) {
    console.error(err);
    return undefined;
  }
};
