import { generateIdFromEntropySize, Lucia, Session, User } from "lucia";
import { db } from "../db/db";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { passwordResetToken, sessionTable, userTable } from "../db/schema";
import { cookies } from "next/headers";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import { createDate, TimeSpan } from "oslo";

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      username: attributes.username,
    };
  },
});

export async function createPasswordResetToken(
  userId: string,
): Promise<string> {
  try {
    await db
      .delete(passwordResetToken)
      .where(eq(passwordResetToken.userId, userId));
    const tokenId = generateIdFromEntropySize(25); // 40 character
    const tokenHash = encodeHex(
      await sha256(new TextEncoder().encode(tokenId)),
    );
    await db.insert(passwordResetToken).values({
      tokenHash,
      userId,
      expiresAt: createDate(new TimeSpan(2, "h")).getTime(),
    });
    return tokenId;
  } catch (e) {
    console.error(e);
    return "";
  }
}

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);
    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {}
    return result;
  },
);

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
interface DatabaseUserAttributes {
  username: string;
}
