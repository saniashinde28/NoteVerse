import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import service from "../../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [author, setAuthor] = useState(null);
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {

        async function postPage() {
            if (!slug) {
                navigate("/");
                return;
            }
            const post = await service.getPost(slug);
            if (!post) {
                navigate("/");
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
            }
        });
    };

    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                    <img
                        src={service.getFileView(post.featuredImage)}
                        alt={post.title}
                        className="rounded-xl"
                    />

                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500" className="mr-3">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full mb-6">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                </div>

                {author && (
                    <div className="mb-4">
                        <Link
                            to={`/profile/${author.username}`}
                            className="text-blue-600 font-medium hover:underline"
                        >
                            By @{author.username}
                        </Link>
                    </div>
                )}
                <div className="browser-css">
                    {parse(post.content)}
                </div>
            </Container>
        </div>
    ) : null;
}