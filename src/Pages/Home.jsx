import React, { useEffect, useState } from "react";
import service from "../../appwrite/config";
import { Container, Hero, PostCard } from "../components";
import { SkeletonCard } from "../components";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    service.getPosts().then((posts) => {
      if (posts) {
        setPosts(posts.documents);
      }
      setLoading(false);
    });
  }, []);
  if (loading) {
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

  return (
    <>
      <Hero />

      <Container>
        <section className="py-10">

          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">
                Latest Stories
              </h2>

              <p className="text-muted-foreground mt-2">
                Discover blogs written by our community.
              </p>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-xl border py-20 text-center">
              <h2 className="text-2xl font-semibold">
                No posts yet
              </h2>

              <p className="mt-2 text-gray-500">
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