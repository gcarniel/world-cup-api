import { addDays, formatISO } from 'date-fns';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const get = async (ctx) => {
  try {
    const currentDate = ctx.request.query.gameTime;

    const where = currentDate
      ? {
          gameTime: {
            gte: currentDate,
            lt: formatISO(addDays(new Date(currentDate), 1)),
          },
        }
      : {};

    const games = await prisma.game.findMany({
      where,
    });

    ctx.body = games;
    ctx.status = 200;
  } catch (error) {
    console.error(error);
    ctx.body = error;
    ctx.status = 500;
  }
};
