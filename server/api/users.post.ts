import { users } from "../database/schema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const db = useDb();

  try {
    const result = await db
      .insert(users)
      .values({
        name: body.name,
        email: body.email,
      })
      .returning()
      .get();

    return result;
  } catch (e: any) {
    console.log("添加用户异常", e);
    throw createError({
      statusCode: 400,
      statusMessage: e.message,
    });
  }
});
