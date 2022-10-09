import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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

export const login = async (ctx) => {
  const [type, token] = ctx.headers.authorization.split(' ');
  const [email, passwordHash] = atob(token).split(':');

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return (ctx.status = 404);

    const passwordMatch = await bcrypt.compare(passwordHash, user.password);

    if (!passwordMatch) {
      return (ctx.status = 404);
    }

    const { password, ...dataUser } = user;

    const jwtToken = jwt.sign(
      {
        data: { sub: user.id, name: user.name },
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );

    ctx.body = {
      user: dataUser,
      accessToken: jwtToken,
    };
  } catch (error) {
    console.error('Login: ' + error);
  }
};

export const hunches = async (ctx) => {
  const username = ctx.request.params.username;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return (ctx.status = 404);

    const hunches = await prisma.hunch.findMany({
      where: { userId: user.id },
    });

    ctx.body = {
      name: user.name,
      hunches,
    };
  } catch (error) {
    console.error(error);
  }
};
