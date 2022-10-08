import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const create = async (ctx) => {
  if (!ctx.request.body.homeTeamScore && !ctx.request.body.awayTeamScore) {
    return (ctx.status = 400);
  }

  const { gameId } = ctx.request.body;
  const homeTeamScore = parseInt(ctx.request.body.homeTeamScore);
  const awayTeamScore = parseInt(ctx.request.body.awayTeamScore);

  try {
    const userId = 'cl8xulnx90000rmr06arg9uej';

    const existHunch = await prisma.hunch.findFirst({
      where: { userId, gameId },
    });

    if (existHunch) {
      return (ctx.body = await prisma.hunch.update({
        where: { id: existHunch.id },
        data: {
          homeTeamScore,
          awayTeamScore,
        },
      }));
    }

    console.log({ existHunch });

    return (ctx.body = await prisma.hunch.create({
      data: {
        userId,
        gameId,
        homeTeamScore,
        awayTeamScore,
      },
    }));
  } catch (error) {
    console.error('Erro ao criar palpite: ', error);
    ctx.body = error;
    ctx.status = 500;
  }
};
