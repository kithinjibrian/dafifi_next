import { MainHeader } from "@/components/home/main-header";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <MainHeader />
            {children}
        </>
    );
}