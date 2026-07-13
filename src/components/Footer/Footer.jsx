import React from "react";
import { Container, Logo } from "../index";
import { Separator } from "@/components/ui/separator";

function Footer() {
    return (
        <footer className="mt-20 border-t bg-white">
            <Container>
                <div className="py-6">

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <Logo width="38px" />
                        <div>
                            <h2 className="text-lg font-semibold">
                                SnapBlog
                            </h2>
                            <p className="text-xs text-slate-500">
                                Share ideas. Read stories.
                            </p>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">

                        {/* Social Links */}
                        <div className="flex items-center gap-6 text-sm">

                            <a
                                href="https://github.com/saniashinde28"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-500 transition-colors hover:text-black"
                            >
                                GitHub
                            </a>

                            <a
                                href="https://linkedin.com/in/YOUR_USERNAME"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-500 transition-colors hover:text-black"
                            >
                                LinkedIn
                            </a>

                        </div>

                        <p className="text-sm text-slate-500">
                            © {new Date().getFullYear()} Sania Shinde
                        </p>

                    </div>

                </div>
            </Container>
        </footer>
    );
}

export default Footer;