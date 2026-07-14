import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index";
import service from "../../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";

function PostForm({ post }) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        getValues,
    } = useForm({
        defaultValues: {
            title: post ? post.title : "",
            slug: post ? post.slug : "",
            content: post ? post.content : "",
            status: post ? post.status : "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.userData);

    const submit = async (data) => {
        if (post) {
            const file = data.image[0]
                ? await service.uploadFile(data.image[0])
                : null;

            if (file) {
                service.deleteFile(post.featuredImage);
            }

            const dbPost = await service.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
            });

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
                toast.success("Post edited");
            } else {
                toast.error("Something went wrong");
            }
        } else {
            const file = data.image[0]
                ? await service.uploadFile(data.image[0])
                : null;

            if (file) {
                data.featuredImage = file.$id;

                const dbPost = await service.createPost({
                    ...data,
                    userId: userData.$id,
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                    toast.success("Post published");
                } else {
                    toast.error("Something went wrong");
                }
            } else {
                toast.error("Failed to upload image");
            }
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string") {
            return value
                .trim()
                .toLowerCase()
                .replace(/[^\w\s]/g, "")
                .replace(/\s+/g, "-");
        }

        return "";
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue(
                    "slug",
                    slugTransform(value.title),
                    {
                        shouldValidate: true,
                    }
                );
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="flex flex-wrap"
        >
            {/* Left */}
            <div className="w-2/3 px-2">

                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", {
                        required: true,
                    })}
                />

                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", {
                        required: true,
                    })}
                    onInput={(e) =>
                        setValue(
                            "slug",
                            slugTransform(e.currentTarget.value),
                            {
                                shouldValidate: true,
                            }
                        )
                    }
                />

                <RTE
                    label="Content :"
                    name="content"
                    control={control}
                    defaultValue={getValues("content")}
                />

            </div>

            {/* Right */}
            <div className="w-1/3 px-2">

                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", {
                        required: !post,
                    })}
                />

                {post && (
                    <div className="mb-4 w-full">
                        <img
                            src={service.getFileView(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg border border-border"
                        />
                    </div>
                )}

                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", {
                        required: true,
                    })}
                />

                <Button
                    type="submit"
                    className={`w-full ${
                        post
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : ""
                    }`}
                >
                    {post ? "Update" : "Submit"}
                </Button>

            </div>
        </form>
    );
}

export default PostForm;

