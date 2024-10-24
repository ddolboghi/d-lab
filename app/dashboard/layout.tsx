import { selectAllService } from "@/actions/service";
import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  const allServices = await selectAllService();

  const userName: string | undefined = user?.user_metadata.full_name;
  const userEmail: string | undefined = user?.email;
  return (
    <SidebarProvider>
      <AppSidebar allServices={allServices} />
      <main className="bg-[#F1F1F1] w-full">
        <Navbar userName={userName} userEmail={userEmail} />
        {children}
      </main>
    </SidebarProvider>
  );
}
