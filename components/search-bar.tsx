// components/search-bar.tsx
"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value);
    };

    return (
        <div className="flex items-center border rounded p-2">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Search contests..."
                value={query}
                onChange={handleChange}
                className="border-none focus:ring-0"
            />
        </div>
    );
}
