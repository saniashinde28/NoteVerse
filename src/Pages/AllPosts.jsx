import React from "react";
import service from "../../appwrite/config";
import { PostCard } from "../components";
import {Container} from "../components";
import { SkeletonCard } from "../components";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

function AllPosts(){
    const { data: posts,
    isLoading,
    error,
    refetch } = useQuery({
      queryKey: ["posts"],
      queryFn: ()=>service.getPosts(),
      select: ((data) => data.documents),
    });
   

    if (isLoading) {
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

      if (error) {
          return (
            <Container>
              <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold">
                    Something went wrong
                  </h2>
      
                  <p className="mt-2 text-muted-foreground">
                    Couldn't load posts.
                  </p>
      
                  <Button onClick={() => refetch()}>
                    Retry
                  </Button>
                </div>
              </div>
            </Container>
          );
      
        }
    
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