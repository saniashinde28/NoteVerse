import React from "react";
import { useEffect,useState } from "react";
import { Container } from "../components";
import {PostForm} from "../components";
import service from "../../appwrite/config";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

function EditPost(){
    const {slug}=useParams()   //used to get slug value from URL
    const navigate=useNavigate()

    const {data:post,
        isLoading,
        error
    }=useQuery({
        queryKey:["edit-post",slug],
        queryFn:(()=>service.getPost(slug)),
        enabled:!!slug
    });

    return post?(
        <div className="py-8">
            <Container>
                <PostForm post={post}/>
            </Container>
        </div>
    ):null
}

export default EditPost