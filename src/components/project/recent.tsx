import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import { request } from "@/utils/request";

import { ProjectBox } from "./project-box";

const tabs = [
    {
        name: "Recent",
        content: ({ projects, setProjects }) => {
            const update = async (id, data) => {
                try {
                    const response = await request.patch(`/project/${id}`, data)
                    const index = projects.findIndex(project => project.id == id);
                    projects[index] = response.data;
                    setProjects([...projects]);
                } catch (e) {

                }
            }
            return (
                <div className="flex justify-center m-4">
                    <div className="grid grid-cols-4 gap-4">
                        {projects.map((project) => (
                            <ProjectBox
                                key={project.id}
                                project={project}
                                onUpdate={update} />
                        ))}
                    </div>
                </div>
            )
        }
    },
    {
        name: "Pinned",
        content: ({ projects, setProjects }) => {
            const update = async (id, data) => {
                try {
                    const response = await request.patch(`/project/${id}`, data)
                    const index = projects.findIndex(project => project.id == id);
                    projects[index] = response.data;
                    setProjects([...projects]);
                } catch (e) {

                }
            }
            return (
                <div className="flex justify-center m-4">
                    <div className="grid grid-cols-4 gap-4">
                        {projects
                            .filter(project => project.pinned)
                            .map((project) => (
                                <ProjectBox
                                    key={project.id}
                                    project={project}
                                    onUpdate={update} />
                            ))}
                    </div>
                </div>
            )
        }
    }
]

export const Recent = (props) => {
    return (
        <div className="my-4 w-full bg-card pb-4">
            <Tabs
                defaultValue="Recent">
                <TabsList
                    className="bg-card h-10">
                    {tabs.map((tab, index) => (
                        <TabsTrigger
                            key={index}
                            value={tab.name}
                            className={`
                                    text-xl
                                    ring-0
                                    w-32
                                    border-b-2
                                    border-y-transparent
                                    data-[state=active]:bg-card 
                                    data-[state=active]:border-b-sky-500
                                    data-[state=active]:shadow-none
                                    relative group z-10`}>
                            {tab.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {tabs.map((tab, index) => (
                    <TabsContent
                        value={tab.name}
                        key={index}>
                        {tab.content && <tab.content {...props} />}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}