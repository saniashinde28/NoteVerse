import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import service from "../../../appwrite/config";

import { Input } from "@/components/ui/input";

function SearchBar() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [results, setResults] = useState([]);

    const searchRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setOpen(false);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);

            const res = await service.searchPosts(query);

            if (res) {
                setResults(res.documents);
                setOpen(true);
            }

            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setOpen(false);
                setQuery("");
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    return (
        <div
            className="relative hidden w-72 lg:block"
            ref={searchRef}
        >
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <Input
                placeholder="Search posts..."
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {open && (
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-lg">

                    {loading ? (
                        <div className="p-4 text-sm text-muted-foreground">
                            Searching...
                        </div>
                    ) : results.length === 0 ? (
                        <div className="p-4 text-sm text-muted-foreground">
                            No posts found
                        </div>
                    ) : (
                        results.map((post) => (
                            <button
                                key={post.$id}
                                onClick={() => {
                                    navigate(`/post/${post.$id}`);
                                    setOpen(false);
                                    setQuery("");
                                }}
                                className="block w-full border-b border-border px-4 py-3 text-left transition-colors hover:bg-accent last:border-b-0"
                            >
                                <h3 className="font-medium text-foreground">
                                    {post.title}
                                </h3>
                            </button>
                        ))
                    )}

                </div>
            )}
        </div>
    );
}

export default SearchBar;

