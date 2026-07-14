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
        return (
            <div className="mt-20 text-center">
                <h1 className="text-3xl font-bold text-foreground">
                    User not found!
                </h1>

                <p className="mt-2 text-muted-foreground">
                    The profile you're looking for doesn't exist.
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto mt-10 mb-10 max-w-5xl">

            <div className="flex flex-col items-center text-center">

                <Avatar className="mb-5 h-24 w-24 text-3xl">
                    <AvatarFallback>
                        {profile.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <h1 className="text-4xl font-bold text-foreground">
                    {profile.name}
                </h1>

                <p className="mt-2 text-lg text-muted-foreground">
                    @{profile.username}
                </p>

            </div>

            <Separator className="my-10" />

            <div className="mb-8 flex items-center justify-between">

                <h2 className="text-2xl font-semibold text-foreground">
                    Posts
                </h2>

                <span className="text-muted-foreground">
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
    );
}

export default Profile;