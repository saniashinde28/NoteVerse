import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import service from "../../appwrite/config";
import { PostCard } from "../components";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

function Profile() {
    const { username } = useParams();

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function fetchProfile() {
            const profileData = await service.getProfile(username);

            if (profileData) {
                setProfile(profileData);

                const postData = await service.getPostsByUser(profileData.userId);

                setPosts(postData.documents);
            }
        }

        fetchProfile();

    }, [username]);
    if (!profile) {
        return <h1>User not found!</h1>
    }
    return (
        <div className="max-w-5xl mx-auto mt-10 mb-10">

            <div className="flex flex-col items-center text-center">

                <Avatar className="h-24 w-24 text-3xl mb-5">
                    <AvatarFallback>
                        {profile.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <h1 className="text-4xl font-bold">
                    {profile.name}
                </h1>

                <p className="text-slate-500 text-lg mt-2">
                    @{profile.username}
                </p>

            </div>

            <Separator className="my-10" />

            <div className="flex justify-between items-center mb-8">

                <h2 className="text-2xl font-semibold">
                    Posts
                </h2>

                <span className="text-slate-500">
                    {posts.length} {posts.length === 1 ? "Post" : "Posts"}
                </span>

            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

                {posts.map((post) => (
                    <PostCard
                        key={post.$id}
                        {...post}
                    />
                ))}

            </div>

        </div>

    )
}

export default Profile