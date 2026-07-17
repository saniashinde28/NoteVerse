import React, { useEffect, useState } from "react";
import service from "../../appwrite/config";
import { Container, Hero, PostCard } from "../components";
import { SkeletonCard } from "../components";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

function Home() {
  // const [posts, setPosts] = useState([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   service.getPosts().then((posts) => {
  //     if (posts) {
  //       setPosts(posts.documents);
  //     }
  //     setLoading(false);
  //   });
  // }, []);

  const { data: posts=[],
    isLoading,
    error,
    refetch } = useQuery({
      queryKey: ["posts"],
      queryFn: ()=>service.getPosts(),
      select: ((data) => data.documents),
    });


  if (isLoading) {
    return (
      <>
        <Hero />

        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </Container>
      </>
    );
  }

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

  return (
    <>
      <Hero />

      <Container>
        <section className="py-10">

          <div className="mb-10 flex items-center justify-between">
            <div>

              <h2 className="text-3xl font-bold text-foreground">
                Latest Stories
              </h2>

              <p className="mt-2 text-muted-foreground">
                Discover blogs written by our community.
              </p>

            </div>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-xl border border-border bg-card py-20 text-center">

              <h2 className="text-2xl font-semibold text-foreground">
                No posts yet
              </h2>

              <p className="mt-2 text-muted-foreground">
                Be the first one to publish a blog.
              </p>

            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard
                  key={post.$id}
                  {...post}
                />
              ))}
            </div>
          )}

        </section>
      </Container>
    </>
  );
}

export default Home;