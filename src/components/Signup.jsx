import React from "react";
import { useState } from "react";
import authService from "../../appwrite/auth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { login } from "../../store/authSlice";
import { Button, Input, Logo } from './index'
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import service from "../../appwrite/config";

function Signup() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [err, setErr] = useState(null)
    const { register, handleSubmit } = useForm()

    // Signup method
    const Signup = async (data) => {
        setErr("");
        try {
            const session = await authService.createAccount(data)
            if (session) {
                const userData = await authService.getCurrentUser()
                const profile = await service.getProfileByUserId(userData.$id);
                if (userData) {
                    dispatch(login({
                        userData,
                        profile
                    }))
                    navigate("/")
                }
            }

        }
        catch (err) {
            setErr(err.message);
        }

    }
    return (
        <div className="flex items-center justify-center">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>

                {/* Logo */}
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>

                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>

                {/* Redirect to login */}
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>

                {err && <p className="text-red-600 mt-8 text-center">{err}</p>}
                <form onSubmit={handleSubmit(Signup)}>
                    <div className='space-y-5'>
                        <Input
                            label="Full Name: "
                            placeholder="Enter your full name"
                            {...register("name", {
                                required: true,
                            })}
                        />

                        {/* username */}
                        <Input
                            label="Username:"
                            placeholder="Enter your username"
                            {...register("username", {
                                required: "Username is required",
                                minLength: {
                                    value: 3,
                                    message: "Minimum 3 characters"
                                },
                                pattern: {
                                    value: /^[a-z0-9_]+$/,
                                    message:
                                        "Only lowercase letters, numbers and underscores allowed"
                                }
                            })}
                        />


                        {/* Email */}
                        <Input
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be valid"
                                }
                            })}
                        />


                        {/* Password */}
                        <Input
                            label="Password: "
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: true,
                            })}
                        />

                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </div>
                </form>




            </div>

        </div>

    )
}

export default Signup