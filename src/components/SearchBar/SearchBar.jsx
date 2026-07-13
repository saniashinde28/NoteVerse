import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useEffect,useRef } from "react";
import service from "../../../appwrite/config";

import { Input } from "@/components/ui/input";

function SearchBar() {
    const [query, setQuery] = useState("");  //current query
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);   //dropdown visible
    const [results, setResults] = useState([]);  //matching results to query
    const searchRef=useRef(null);

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
        }, 300)

        return () => clearTimeout(timer);  //cleanup function
    }, [query]);

    useEffect(()=>{
        function handleClickOutside(event){
            if(searchRef.current && !searchRef.current.contains(event.target)){
                setOpen(false);
                setQuery("");
            }
        }
        document.addEventListener("mousedown",handleClickOutside);

        return()=>{
            document.removeEventListener("mousedown",handleClickOutside);
        }
    },[]);

    return (
        <div className="relative hidden lg:block w-72" ref={searchRef}>

            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

            <Input
                placeholder="Search posts..."
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}

            />

            {open && (
                <div className="absolute mt-2 w-full rounded-lg border bg-white shadow-lg z-50">

                    {loading ? (
                        <div className="p-4 text-sm text-slate-500">
                            Searching...
                        </div>
                    ) : results.length === 0 ? (
                        <div className="p-4 text-sm text-slate-500">
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
                                className="block w-full border-b px-4 py-3 text-left hover:bg-slate-100 last:border-b-0"
                            >
                                <h3 className="font-medium">{post.title}</h3>
                            </button>
                        ))
                    )}

                </div>
            )}

        </div>
    );
}

export default SearchBar;