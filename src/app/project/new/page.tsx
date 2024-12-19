"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { request } from "@/utils/request"
import { useRouter } from "next/navigation"
import { useProtectedRoute } from "@/hooks/useProtectedRoute"
import { useAuthStore } from "@/store/auth"
import { useEffect } from "react"

const formSchema = z.object({
    name: z.string().min(2).max(20),
    description: z.string().max(100).optional(),
})

export default function NewProject() {
    const router = useRouter();
    const { user } = useProtectedRoute();

    const { isAuthenticated, refreshToken } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated) {
            refreshToken();
        }
    }, [isAuthenticated, refreshToken]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await request.post("/project", values);
            router.push(`/project/${response.data.id}`);
        } catch (e) {

        }
    }

    return (
        <div className="flex justify-center mt-10">
            <div className="w-1/2">
                <div className="py-2">
                    <div className="text-2xl font-bold">Create a new project</div>
                    <p className="text-sm text-muted-foreground">
                        A project includes tables, files, and other resources that you can use to create apps, automate workflows, and more.
                    </p>
                </div>
                <Separator />
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 w-full my-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project's Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-1/3"
                                            placeholder="project's name" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Keep the project name short and easy to remember.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description <span className="text-xs text-muted-foreground">(optional)</span></FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Keep the project name short and easy to remember.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            className="bg-sky-500 text-foreground"
                            type="submit">Create Project</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};