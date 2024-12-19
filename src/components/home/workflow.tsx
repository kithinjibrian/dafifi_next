export const WorkflowShowcase = () => {
    return (
        <div className="container mx-auto px-4 py-10 lg:py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
                    Transform Complex Processes
                    <span className="block text-primary">Into Simple Flows</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Visualize, connect, and automate your entire business logic with our intuitive drag-and-drop flow builder. Connect apps, database tables, and APIs seamlessly.
                </p>
            </div>

            <div className="grid lg:grid-cols-1 gap-12 items-center">
                {/* Workflow Visualization */}
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/5 rounded-xl -z-10 transform -rotate-2"></div>
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-2 border">
                        <img
                            src="/flow.png"
                            alt="Dafifi logomark"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};