import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import {withAccelerate} from  '@prisma/extension-accelerate'
import {sign, verify} from 'hono/jwt'
import { createBlogInput, updateBlogInput } from '@lokeshsaini/medium-common'

export const  blogRouter = new Hono<{
    Bindings:{
      DATABASE_URL: string,
      JWT_SECRET: string
    },
    Variables:{
        authorId:string
        userId:string
    }
}>()

blogRouter.use("/*", async (c, next)=>{
    const authHeader = c.req.header("Authorization") || "";
    const user = await verify(authHeader, c.env.JWT_SECRET);
    if(user){
        const userId = user.id as string
        c.set("userId", userId)
        await next();
    }else{

    }
    
})

blogRouter.post('/', async (c) => {

    const body = await c.req.json();

    const {success} = createBlogInput.safeParse(body);
    if(!success){
        c.status(401);
        return c.json({
            messgae:"inputs are not correct"
        })
    }
    const authorId = c.get("userId")
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())

    
    
    
    const blog = await prisma.post.create({
        data:{
            title:body.title,
            content:body.content,
            authorId : Number(authorId)

        }
    })

    return c.json({
        id:blog.id
    })
  })
  
  blogRouter.put('/',async (c) => {

    const body = await c.req.json();

    const {success} = updateBlogInput.safeParse(body);
    if(!success){
        c.status(401);
        return c.json({
            message:"inputs are not correct"
        })
    }

    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())

    
    const blog = await prisma.post.update({
        where:{
            id:body.id
        },
        data:{
            title:body.title,
            content:body.content,
            

        }
    })

    return c.json({
        id:blog.id
    })
    
  })

  blogRouter.get('/bulk', async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())

 
    const blog = await prisma.post.findMany({
        select:{
            title:true,
            content:true,
            id:true,
            author:{
                select:{
                    name:true
                }
            }
        }
    })

    return c.json({
        blog
    })
    
  })
  
  blogRouter.get('/:id',async (c) => {
    const id = c.req.param("id")
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())

    
    const blog = await prisma.post.findUnique({
        where:{
            id:Number(id)
        },
        select:{
            id:true,
            title:true,
            content:true,
            author:{
                select:{
                    name:true
                }
            }

        }
        
    })

    return c.json({
        blog
    })
    
  })

  

  