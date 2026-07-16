import { useSearchParams } from "react-router-dom";
import service from "../../appwrite/config";
import Container from "@mui/material/Container";
import { PostCard } from "@/components";
import { useQuery } from "@tanstack/react-query";

function Search() {
    const [searchParams] = useSearchParams();  //everything after ? come in the query parameter q=React
    const query = searchParams.get("q") || "";

    const { data: posts = [],
        isLoading,
        error } = useQuery({
            queryKey: ["search", query],
            queryFn: (() => service.searchPosts(query)),
            enabled: !!query.trim(),
            select: ((data) => data.documents)

        });


if (isLoading) {
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
};

export default Search