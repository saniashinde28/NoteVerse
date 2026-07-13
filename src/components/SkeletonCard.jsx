import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function SkeletonCard() {
    return (
        <Card className="overflow-hidden rounded-2xl border shadow-sm">

            <Skeleton className="h-56 w-full" />

            <CardContent className="space-y-4 p-6">

                <Skeleton className="h-3 w-14" />

                <Skeleton className="h-7 w-4/5" />

                <Skeleton className="h-4 w-2/3" />

            </CardContent>

        </Card>
    );
}

export default SkeletonCard;