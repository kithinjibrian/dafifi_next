import Link from "next/link";
import { ChevronsUpDown, Plus } from "lucide-react"

import {
    Card,
    CardContent,
    CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button"

export const Start = () => {
    return (
        <>
            <div className="w-full flex items-center justify-between text-xl font-bold my-4">
                <div>Start a new project</div>
                <div>
                    <Button variant="ghost">
                        Templates
                        <ChevronsUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="flex">
                <Link
                    href="/project/new">
                    <Card
                        className="w-52 h-52 hover:outline hover:outline-1">
                        <CardContent
                            className="flex h-32 items-center justify-center">
                            <Plus
                                className="h-16 w-16" />
                        </CardContent>
                        <CardFooter>
                            <p>New Project</p>
                        </CardFooter>
                    </Card>
                </Link>
            </div>
        </>
    )
}