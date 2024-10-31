"use client";

import { Home, Database, ChevronDown } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { ServiceWithId } from "@/utils/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import DLabLogo from "./icons/DLabLogo";
import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

const menu = [
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
  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();
  const [isClicked, setIsClicked] = useState(
    Object.fromEntries([
      ...menu.map((m) => [m.title, false]),
      ...(allServices?.map((service) => [service.id, false]) ?? []),
    ])
  );
  const pathname = usePathname();
  const params = useParams<{ serviceId: string; experimentId: string }>();

  const resetState = () => {
    return Object.keys(isClicked).reduce<Record<string, boolean>>(
      (obj, key) => {
        obj[key] = false;
        return obj;
      },
      {}
    );
  };
  useEffect(() => {
    if (pathname === "/dashboard") {
      const resetedClick = resetState();
      setIsClicked({ ...resetedClick, Home: true });
    } else if (pathname.endsWith("/data")) {
      const serviceId = params.serviceId;
      const resetedClick = resetState();
      setIsClicked({ ...resetedClick, [serviceId]: true });
    }
  }, [pathname]);
  console.log(isClicked);
  return (
    <Sidebar className="border-none ease-out bg-[#101010]" collapsible="icon">
      <SidebarHeader className="bg-[#101010]">
        <SidebarMenuButton asChild className="hover:bg-[#101010]">
          <Link href="/dashboard" className="flex flex-row items-center p-2">
            <DLabLogo
              className={`${open ? "!w-[35px] !h-[39.23px]" : "!w-[30px] !h-[33.62px]"} fill-[#101010] transition-all duration-100 -translate-x-2`}
            />
            <span className="text-[#E5E5E5] font-bold text-[20px] pl-1">
              D-Lab
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent className="bg-[#101010]">
        <SidebarGroup className="bg-[#101010]">
          <SidebarGroupContent>
            <SidebarMenu>
              {menu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`hover:bg-[#101010] hover:rounded-[10px] ${isClicked["Home"] && "bg-[#FFF] rounded-[10px] hover:bg-white"}`}
                  >
                    <Link href={item.url}>
                      <item.icon
                        className={`${isClicked["Home"] ? "text-[#3B82F6]" : "text-[#E5E5E5]"}`}
                      />
                      <span
                        className={`${isClicked["Home"] ? "text-[#212121]" : "text-[#E5E5E5]"}`}
                      >
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={`data-[state=open]:hover:bg-[#101010] data-[state=open]:hover:text-[#E5E5E5] data-[state=closed]:hover:bg-[#101010] data-[state=closed]:hover:text-[#E5E5E5]
                      ${isClicked["Home"] || "bg-[#FFF] rounded-[10px] data-[state=open]:hover:bg-[#FFF] data-[state=closed]:hover:bg-[#FFF]"}
                      `}
                    >
                      <Database
                        className={`${isClicked["Home"] ? "text-[#E5E5E5]" : "text-[#3B82F6]"}`}
                      />
                      <span
                        className={`${isClicked["Home"] ? "text-[#E5E5E5]" : "text-[#212121]"}`}
                      >
                        Data
                      </span>
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {allServices &&
                        allServices.map((service) => (
                          <SidebarMenuSubItem key={service.id}>
                            <SidebarMenuButton
                              asChild
                              className="hover:bg-[#101010] hover:rounded-[10px] p-0"
                            >
                              <Link href={`/dashboard/${service.id}/data`}>
                                <span
                                  className={`flex items-center pl-2 size-full ${isClicked[service.id] ? "bg-[#FFF] text-[#212121] rounded-[10px]" : "text-[#E5E5E5]"}`}
                                >
                                  {service.name}
                                </span>
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
