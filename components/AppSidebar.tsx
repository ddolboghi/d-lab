import { Home, LayoutDashboard, Database } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Projects",
    url: "/", //생성한 서비스 id 목록 페치해서 sub 메뉴로 추가
    icon: LayoutDashboard,
  },
  {
    title: "Data",
    url: "/", //데이터 등록 페이지
    icon: Database,
  },
];

export default function AppSidebar() {
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
