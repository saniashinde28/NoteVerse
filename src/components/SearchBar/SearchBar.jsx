import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

function SearchBar() {
    const [query, setQuery] = useState("");

    const navigate = useNavigate();

    return (
        <div className="relative hidden lg:block w-72">

            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

            <Input
                placeholder="Search posts..."
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && query.trim()) {
                        navigate(`/search?q=${encodeURIComponent(query)}`);
                    }
                }}
            />

        </div>
    );
}

export default SearchBar;