import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const create = async (ctx) => {
  const data = {
    name: ctx.request.body.name,
    username: ctx.request.body.username,
    email: ctx.request.body.email,
    password: ctx.request.body.password,
  };

  try {
    const user = await prisma.user.create({ data });
    ctx.body = user;
    ctx.status = 201;
  } catch (error) {
    console.error(error);
    ctx.body = error;
    ctx.status = 500;
  }
};

export const get = async (ctx) => {
  try {
    const users = await (
      await prisma.user.findMany()
    ).map((user) => {
      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      };
    });

    ctx.body = users;
    ctx.status = 200;
  } catch (error) {
    console.error(error);
    ctx.body = error;
    ctx.status = 500;
  }
};
