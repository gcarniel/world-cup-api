import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const create = async (ctx) => {
  if (!ctx.headers.authorization) return (ctx.status = 401);

  const [type, token] = ctx.headers.authorization.split(' ');
  let decoded = '';

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return (ctx.status = 401);
  }

  if (!ctx.request.body.homeTeamScore && !ctx.request.body.awayTeamScore) {
    return (ctx.status = 400);
  }

  const { gameId } = ctx.request.body;
  const homeTeamScore = parseInt(ctx.request.body.homeTeamScore);
  const awayTeamScore = parseInt(ctx.request.body.awayTeamScore);

  try {
    const userId = decoded.data.sub;

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
