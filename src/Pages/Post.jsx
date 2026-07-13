import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import service from "../../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function Post() {
    const [author, setAuthor] = useState(null);
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();
    const [notFound, setNotFound] = useState(false);

    const userData = useSelector((state) => state.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {

        async function postPage() {
            if (!slug) {
                setNotFound(true);
                return;
            }
            const post = await service.getPost(slug);
            if (!post) {
                setNotFound(true);
                return;
            }
            setPost(post);

            const profile = await service.getProfileByUserId(post.userId);
            setAuthor(profile);



        }
        postPage();
    }, [slug, navigate]);

    const deletePost = () => {
        service.deletePost(post.$id).then((status) => {  //if deleted, status returns TRUE
            if (status) {
                service.deleteFile(post.featuredImage);
                navigate("/");
                toast.success("Post deleted");
            }
        });
    };

    if (notFound) {
        return (
            <Container>
                <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">

                    <h1 className="text-4xl font-bold">
                        Post not found
                    </h1>

                    <p className="mt-3 text-slate-500">
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

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-slate-900">
                            {post.title}
                        </h1>

                        <div className="mt-5 flex items-center justify-between flex-wrap gap-4">

                            {author && (
                                <Link
                                    to={`/profile/${author.username}`}
                                    className="text-base text-slate-600 hover:text-black transition"
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
                                        onClick={() => navigate(`/edit-post/${post.$id}`)}
                                    >
                                        Edit
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        onClick={deletePost}
                                    >
                                        Delete
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
                            className="w-full max-w-3xl h-[350px] rounded-2xl object-cover shadow-md"
                        />
                    </div>

                    <hr className="mb-10" />

                    {/* Content */}

                    <div
                        className="
            prose
            prose-lg
            max-w-none
            prose-headings:font-bold
            prose-img:rounded-xl
            prose-pre:rounded-xl
            prose-a:text-blue-600
            prose-p:text-slate-700
            prose-p:leading-8
          "
                    >
                        {parse(post.content)}
                    </div>

                </article>
            </Container>
        </div>
    ) : null;
}