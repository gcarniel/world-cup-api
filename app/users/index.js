import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const create = async (ctx) => {
  const password = await bcrypt.hash(ctx.request.body.password, 10);
  const data = {
    name: ctx.request.body.name,
    username: ctx.request.body.username,
    email: ctx.request.body.email,
    password,
  };

  try {
    const { password, ...user } = await prisma.user.create({ data });
    ctx.body = user;
    ctx.status = 201;
  } catch (error) {
    console.error(error);
    ctx.body = error;
    ctx.status = 500;
  }
};

export const update = async (ctx) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: ctx.request.query.id,
      },
      data: {
        ...prisma.user,
        ...ctx.request.body,
      },
    });

    ctx.body = user;
    ctx.status = 201;
  } catch (error) {
    console.error(error);
    ctx.body = error;
    ctx.status = 500;
  }
};

export const remove = async (ctx) => {
  try {
    await prisma.user.delete({
      where: {
        id: ctx.request.query.id,
      },
    });

    ctx.body = users;
    ctx.status = 204;
  } catch (error) {
    console.error(error);
    ctx.body = error;
    ctx.status = 500;
  }
};

export const get = async (ctx) => {
  try {
    const users = await prisma.user.findMany();

    ctx.body = users;
    ctx.status = 200;
  } catch (error) {
    console.error(error);
    ctx.body = error;
    ctx.status = 500;
  }
};
