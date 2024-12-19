'use client'

import { useAuthStore } from "@/store/auth";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useProjectStore } from "@/store/project";
import { Header } from "@/components/app/header";
import { PanelProps, RenderPanels } from "@/components/app/render-panels";
import { StatusBar } from "@/components/app/status-bar";
import { NavBar } from "@/components/app/nav-bar";
import { MainArea } from "@/components/app/main-area";

const panels: PanelProps[] = [
    {
        id: 1,
        content: NavBar,
        defaultSize: 22,
        minSize: 10,
        maxSize: 70,
        collapsible: true,
        collapsedSize: 4.4,
    },
    {
        id: 2,
        direction: 'vertical',
        children: [
            {
                id: 3,
                content: MainArea
            }
        ]
    }
];


export default function ProjectApp() {
    const params = useParams<any>()
    const { user } = useProtectedRoute();
    const { isAuthenticated, refreshToken } = useAuthStore();
    const { project, fetchProject } = useProjectStore();

    useEffect(() => {
        if (isAuthenticated) {
            refreshToken();
        }
    }, [isAuthenticated, refreshToken]);

    useEffect(() => {
        if (isAuthenticated)
            fetchProject(params.slug);
    }, [params, isAuthenticated]);

    return (
        <>
            {project ? (
                <>
                    <Header />
                    <RenderPanels panels={panels} direction="horizontal" />
                    <StatusBar />
                </>
            ) : (
                <h1>Could not find project</h1>
            )}
        </>
    );
}