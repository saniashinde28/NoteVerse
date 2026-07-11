import React from "react";
import { Link } from "react-router-dom";
import service from "../../appwrite/config";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

function PostCard({ $id, title, featuredImage }) {
  return (
    <Link to={`/post/${$id}`}>
      <Card className="group overflow-hidden rounded-2xl border-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

        {/* Image */}

        <div className="overflow-hidden">
          <img
            src={service.getFileView(featuredImage)}
            alt={title}
            className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <CardContent className="space-y-3 p-6">

          <span className="text-sm text-slate-500">
            Story
          </span>

          <h2 className="line-clamp-2 text-2xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-blue-600">
            {title}
          </h2>

          <p className="line-clamp-2 text-sm leading-6 text-slate-500">
            Click to read this article.
          </p>

        </CardContent>

      </Card>
    </Link>
  );
}

export default PostCard;