import { Link } from "react-router-dom";
interface BlogCardProps {
    authorname: string;
    title:string;
    content: string;
    publishedDate: string;
    id:number
}

export const BlogCard = ({authorname, title, content, publishedDate,id}: BlogCardProps)=>{
    return <Link to={`/blog/${id}`}>
       <div className="border-b border-slate-200 pb-4 w-screen max-w-screen-md cursor-pointer">
        <div className="flex mt-4">
            <div className="flex justify-center flex-col">
                <Avatar name={authorname}/>
            </div>
            
            <div className="font-extralight pl-2 flex justify-center flex-col">
                {authorname}
            </div> 
            <div className="flex justify-center flex-col pl-4">
                <Circle/>
            </div>
            <div className="pl-2 font-thin text-slate-400">
             {publishedDate}
            </div>
           
        </div>
        <div className="text-xl font-semibold">
            {title}
        </div>
        <div className="text-md font-thin">
            {content.slice(0,100)+ "..."}
        </div>
        <div className="text-slate-500 text-sm font-thin">
            {`${Math.ceil(content.length/100)} minute(s) read`}
        </div>

    </div>
    </Link>

}

 export function Avatar({name}: {name:string}){
        
    return <div className="relative inline-flex items-center justify-center w-6 h-6 overflow-hidden bg-gray-600 rounded-full dark:bg-gray-600">
        <span className="text-xs font-extralight text-gray-100 dark:text-gray-300">{name[0]}</span>
    </div>

}

function Circle(){
    return <div className="h-1 w-1 rounded-full bg-slate-500 ">

    </div>
}