import { Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export const AiTab = () => {
    return (
        <div
            className="h-full p-4">
            <ScrollArea style={{ height: "95%" }}>
                <div className="flex flex-col gap-4">
                    Welcome to Ava, an advanced virtual assistant, to help you create faster.
                </div>
            </ScrollArea>
            <div className="mb-4">
                <div className="relative">
                    <Input
                        className="pl-10 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter prompt..."
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Send />
                    </div>
                </div>
            </div>
        </div>
    )
}