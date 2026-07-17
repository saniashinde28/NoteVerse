import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import service from "../../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export default function Post() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.userData);
    const queryClient = useQueryClient();

    const { data: post,
        isLoading,
        error
    } = useQuery({
        queryKey: ["post", slug],
        queryFn: (() => service.getPost(slug)),
        enabled: !!slug
    });

    const { data: author } = useQuery({
        queryKey: ["profile", post?.userId],
        queryFn: (() => service.getProfileByUserId(post.userId)),
        enabled: !!post

    });


    const deleteMutation = useMutation({
        mutationFn: (postId) => service.deletePost(postId),

        // 2. Runs immediately before mutationFn
        onMutate: async (postId) => {

            // Stop ongoing fetches so they don't overwrite
            // our optimistic cache update
            await queryClient.cancelQueries({
                queryKey: ["posts"],
            });
            await queryClient.cancelQueries({
                queryKey: ["user-posts", post.userId],
            });

            //save prev data
            const previousPost = queryClient.getQueryData(["posts"]);
            const previousUserPosts = queryClient.getQueryData(["user-posts", post.userId]);

            // Immediately remove post from all posts cache
            queryClient.setQueryData(
                ["posts"],
                (oldPosts) => {

                    if (!oldPosts) return oldPosts;
                    oldPosts=oldPosts.documents;

                    return oldPosts.filter(
                        (item) => item.$id !== postId
                    );
                }
            );

            // Immediately remove post from user's posts cache
            queryClient.setQueryData(
                ["user-posts", post.userId],
                (oldPosts) => {

                    if (!oldPosts) return oldPosts;
                    oldPosts=oldPosts.documents;

                    return oldPosts.filter(
                        (item) => item.$id !== postId
                    );
                }
            );

            return {
                previousPost,
                previousUserPosts
            };


        },
        // 3. Runs if server deletion fails
        onError: (error, postId, context) => {
            console.log("Mutation error:", error);
            console.log("Context:", context);

            // Restore old posts cache
            queryClient.setQueryData(
                ["posts"],
                context.previousPost
            );

            // Restore old user posts cache
            queryClient.setQueryData(
                ["user-posts", post.userId],
                context.previousUserPosts
            );

            toast.error("Failed to delete post");
        },

        // 4. Runs only after successful server deletion
        onSuccess: async () => {

            // Delete associated image
            await service.deleteFile(
                post.featuredImage
            );

            // Remove individual post cache
            queryClient.removeQueries({
                queryKey: ["post", slug],
            });

            // Remove edit-post cache
            queryClient.removeQueries({
                queryKey: ["edit-post", slug],
            });

            navigate("/");
            toast.success("Post deleted");
        },

        // 5. Runs after success OR failure
        onSettled: () => {

            // Make sure final data matches server
            queryClient.invalidateQueries({
                queryKey: ["posts"],
            });

            queryClient.invalidateQueries({
                queryKey: ["user-posts", post.userId],
            });
        },



    });

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    if (isLoading) {
        return (
            <Container>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                    {Array.from({ length: 8 }).map((_, index) => (
                        <Skeleton key={index} />
                    ))}

                </div>
            </Container>
        );
    };


    if (error || !post) {
        return (
            <Container>
                <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">

                    <h1 className="text-4xl font-bold text-foreground">
                        Post not found
                    </h1>

                    <p className="mt-3 text-muted-foreground">
                        This article doesn't exist or may have been deleted.
                    </p>

                    <Button
                        className="mt-6"
                        onClick={() => navigate("/")}
                    >
                        Back Home
                    </Button>

                </div>
            </Container>
        );
    }


    return post ? (
        <div className="py-12">
            <Container>
                <article className="mx-auto max-w-4xl">

                    {/* Title */}
                    <div className="mb-8">

                        <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
                            {post.title}
                        </h1>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">

                            {author && (
                                <Link
                                    to={`/profile/${author.username}`}
                                    className="text-base text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Written by{" "}
                                    <span className="font-semibold">
                                        @{author.username}
                                    </span>
                                </Link>
                            )}

                            {isAuthor && (
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            navigate(`/edit-post/${post.$id}`)
                                        }
                                    >
                                        Edit
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        onClick={() => deleteMutation.mutate(post.$id)}
                                        disabled={deleteMutation.isPending}
                                    >
                                        {deleteMutation.isPending ? "Deleting" : "Delete"}
                                    </Button>
                                </div>
                            )}

                        </div>

                    </div>

                    {/* Featured Image */}

                    <div className="mb-10 flex justify-center">
                        <img
                            src={service.getFileView(post.featuredImage)}
                            alt={post.title}
                            className="h-[350px] w-full max-w-3xl rounded-2xl object-cover shadow-md"
                        />
                    </div>

                    <hr className="mb-10 border-border" />

                    {/* Content */}

                    <div
                        className="
                            prose
                            prose-lg
                            max-w-none
                            prose-headings:text-foreground
                            prose-headings:font-bold
                            prose-p:text-foreground
                            prose-p:leading-8
                            prose-strong:text-foreground
                            prose-li:text-foreground
                            prose-blockquote:text-muted-foreground
                            prose-a:text-primary
                            prose-img:rounded-xl
                            prose-pre:rounded-xl
                            dark:prose-invert
                        "
                    >
                        {parse(post.content)}
                    </div>

                </article>
            </Container>
        </div>
    ) : null;
}

