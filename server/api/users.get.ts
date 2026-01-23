import { users } from '../database/schema';

export default defineEventHandler(async (event) => {
  const db = useDb();
  try {
    const allUsers = await db.select().from(users).all();
    return allUsers;
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      statusMessage: e.message,
    });
  }
});
