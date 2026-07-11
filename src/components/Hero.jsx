import { Button } from "@/components/ui/button";
import { ArrowRight, PenSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Hero() {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.status);

  return (
    <section className="border-b bg-white">
      <div className="mx-auto max-w-5xl px-6 py-24 text-center">

        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
          Welcome to SnapBlog
        </p>

        <h1 className="text-5xl font-bold tracking-tight text-slate-900 md:text-6xl">
          A place to write,
          <br />
          share, and discover stories.
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-600">
          Whether you're documenting your learning, sharing experiences,
          or exploring new ideas, SnapBlog gives your words a home.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-4">

          {authStatus ? (
            <Button
              size="lg"
              onClick={() => navigate("/add-post")}
            >
              <PenSquare className="mr-2 h-4 w-4" />
              Start Writing
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </Button>
          )}

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/all-posts")}
          >
            Explore Posts
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

        </div>
      </div>
    </section>
  );
}