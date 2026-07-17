import conf from "../conf/conf";

import { Client, Databases, ID, Storage, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client)

    }

    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug, //document ID
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId
                }
            )

        } catch (err) {
            console.log("Appwrite create post Error", err)
        }

    }

    async updatePost(slug, { title, content, featuredImage, status, userId }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status
                }
            )

        } catch (err) {
            console.log("Appwrite service Update post Error:", err)
        }

    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
            )
            return true;

        } catch (err) {
            console.log("Appwrite service Delete post Error:", err)
            return false;

        }

    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
            )

        } catch (err) {
            console.log("Appwrite service Get post Error:", err)
            return false;

        }
    }

    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
            )

        } catch (err) {
            console.log("Appwrite service Get post Error:", err)
            return false;

        }

    }

    async searchPosts(query) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [
                    Query.equal("status", "active"),
                    Query.search("title", query)
                ]
            );

        } catch (err) {
            console.log("Appwrite Search Error:", err);
            return false;

        }

    }

    async createProfile({ userId, username, name }) {
        try {
            const response = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.profileCollectionId,
                ID.unique(),
                {
                    userId,
                    username,
                    name
                }
            );

            console.log("Profile created:", response);
            return response;
        } catch (err) {
            console.log("Create Profile Error:", err);
            console.error("CREATE PROFILE FAILED");
            throw err;
        }
    }

    async getProfile(username) {
        try {
            const result = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.profileCollectionId,
                [
                    Query.equal("username", username)
                ]
            )

            return result.documents[0]
        } catch (err) {
            console.log("Get Profile Error:", err)
        }
    }

    async getProfileByUserId(userId) {
        try {
            const result = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.profileCollectionId,
                [
                    Query.equal("userId", userId)
                ]
            )

            return result.documents[0] || null;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async getPostsByUser(userId) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [
                    Query.equal("userId", userId),
                    Query.equal("status", "active")
                ]
            )
        } catch (err) {
            console.log(err)
        }
    }

    //file upload services
    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file

            )

        } catch (err) {
            console.log("File Upload Error:", err)
            return false;

        }

    }


    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true;

        } catch (err) {
            console.log("File Upload Error:", err)
            return false;

        }

    }

    getFileView(fileId) {
        return this.bucket.getFileView(
            conf.appwriteBucketId,
            fileId
        );
    }
}

const service = new Service();
export default service;