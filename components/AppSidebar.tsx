import { Home, Database, ChevronDown } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { ServiceWithId } from "@/utils/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
    hasSub: false,
  },
];

type AppSidebarProps = {
  allServices: ServiceWithId[] | null;
};

export default function AppSidebar({ allServices }: AppSidebarProps) {
  return (
    <Sidebar className="bg-white border-none ease-out" collapsible="icon">
      <SidebarContent className="bg-white">
        <SidebarGroup className="bg-white">
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Database />
                      <span>Data</span>
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {allServices &&
                        allServices.map((service) => (
                          <SidebarMenuSubItem key={service.id}>
                            <SidebarMenuButton asChild>
                              <Link href={`/dashboard/${service.id}/data`}>
                                <span>{service.name}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
