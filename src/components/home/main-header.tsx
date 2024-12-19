import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { NavigationBar } from "./main-nav-bar";

export const MainHeader = () => {
    return (
        <div className="flex items-center justify-between border-b px-2">
            <div className="flex items-center">
                <Link className="flex items-center" href="/">
                    <Image
                        src="/logo.svg"
                        alt="Dafifi logomark"
                        width={50}
                        height={50}
                    />
                    <div className="font-bold text-xl ml-4 mr-4">
                        Dafifi
                    </div>
                </Link>
                <NavigationBar />
            </div>
            <div>
                <Link href="/user/login">
                    <Button
                        className="bg-sky-500 text-foreground mr-4">Log in</Button>
                </Link>
                <Link href="/user/signup">
                    <Button
                        variant="outline"
                        className="text-sky-500">Sign up</Button>
                </Link>
            </div>
        </div>
    )
}