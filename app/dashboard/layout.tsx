import { selectAllService } from "@/actions/service";
import { auth } from "@/auth";
import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const allServices = await selectAllService();

  const userEmail: string | undefined | null = session?.user?.email;
  const userName: string | undefined | null = session?.user?.name;
  return (
    <SidebarProvider>
      <AppSidebar allServices={allServices} />
      <main className="bg-[#101010]">
        <Navbar userName={userName} userEmail={userEmail} />
        {children}
      </main>
    </SidebarProvider>
  );
}
