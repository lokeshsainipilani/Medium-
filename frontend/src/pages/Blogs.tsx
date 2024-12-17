import { BlogCard } from "../components/BlogCard"
import { Appbar } from "../components/Appbar"
import {  useBlogs } from "../hooks"




export const Blogs = ()=>{
    
    const {loading, blogs} = useBlogs()

    if(loading){
        return <div>
            loading ...
        </div>
    }

    return <div>
        <div>
            <Appbar/>
        </div>
            <div className="flex justify-center">
                <div className=" max-w-xl">
                    {blogs.map(blog => <BlogCard
                    id={blog.id}
                    authorname={blog.author.name || "Anonomous"}
                    title={blog.title}
                    content={blog.content}
                    publishedDate={"1 Dec 2024"} />)}
                    

                  

                    
                </div>
        </div>
    </div>
}