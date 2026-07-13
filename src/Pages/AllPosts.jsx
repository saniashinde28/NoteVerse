import React from "react";
import service from "../../appwrite/config";
import { PostCard } from "../components";
import {Container} from "../components";
import { useState,useEffect } from "react";
import { SkeletonCard } from "../components";

function AllPosts(){
    const [posts,setPosts]=useState([])
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        service.getPosts([])
        .then((posts)=>{
            if(posts){
                setPosts(posts.documents)
            }
            setLoading(false);
        })

    },[])

    if (loading) {
        return (
            <Container>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    
                    {Array.from({ length: 8 }).map((_, index) => (
                        <SkeletonCard key={index} />
                    ))}
    
                </div>
            </Container>
        );
      };
    
    return(
        <div className="w-full py-8">
            <Container>
                <div className="flex flex-wrap">
                    {posts.map((post)=>(
                        <div key={post.$id} className="p-2 w-1/4">
                            <PostCard {...post}/>
                        </div>
                ))}
                </div>
            </Container>
        </div>

    )
}

export default AllPosts