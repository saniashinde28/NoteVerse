import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import service from "../../appwrite/config";
import { PostCard } from "../components";

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

            <h1 className="text-4xl font-bold">
                {profile.name}
            </h1>

            <p className="text-gray-500">
                @{profile.username}
            </p>

            <hr className="my-8" />

            <h2 className="text-2xl font-semibold mb-5">
                Posts
            </h2>

            <div className="grid grid-cols-3 gap-6">
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