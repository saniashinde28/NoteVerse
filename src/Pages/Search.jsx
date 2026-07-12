import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import service from "../../appwrite/config";
import Container from "@mui/material/Container";
import { PostCard } from "@/components";

function Search() {
    const [searchParams] = useSearchParams();  //everything after ? come in the query parameter q=React
    const query = searchParams.get("q") || "";

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function searchPosts() {
            const res = await service.getPosts();
            if (res) {
                const filtered = res.documents.filter((post) => (
                    post.title.toLowerCase().includes(query.toLowerCase())
                ));
                setPosts(filtered);
            }
            setLoading(false);

        }
        searchPosts();
    }, [query]);

    if (loading) {
        return (
            <Container>
                <h1 className="py-10 text-center text-lg">
                    Searching...
                </h1>
            </Container>
        );
    }
    return (
        <Container className="py-10">

            <h1 className="text-3xl font-bold mb-8">
                Search results for "{query}"
            </h1>

            {posts.length === 0 ? (
                <p className="text-slate-500">
                    No posts found.
                </p>
            ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <PostCard key={post.$id} {...post} />
                    ))}
                </div>
            )}

        </Container>
    )
}

export default Search