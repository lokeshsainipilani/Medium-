import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import {withAccelerate} from  '@prisma/extension-accelerate'
import {sign} from 'hono/jwt'
import { signupInput, signinInput } from '@lokeshsaini/medium-common'






export const userRouter = new Hono<{
  Bindings:{
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>()

userRouter.post('/signup', async (c) => {

  const body = await c.req.json()
  const {success} = signupInput.safeParse(body);
  if(!success){
    c.status(401);
    return c.json({
      message:"input is not correct"
    })
  }



  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  

  const user = await prisma.user.create({
    data:{
      email: body.email,
      password:body.password

    }
  })

  const token = await sign({id:user.id}, c.env.JWT_SECRET);

  return c.json(
    token
  )
})

userRouter.post('/signin', async (c) => {
  const body = await c.req.json();

  const {success} = signinInput.safeParse(body);
  if(!success){
    c.status(401);
    return c.json({
      message:"inputs are not correct"
    })
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate())

  
  const user = await prisma.user.findUnique({
    where:{
      email:body.email,
      password:body.password
    }
  })

  if(!user){
    c.status(403);
    return c.json({
      msg:"user not exist in database"
    })
  }
  const token = await sign({id:user.id}, c.env.JWT_SECRET)

  return c.json(
    token
  )
})