import { selectAllService } from "@/actions/service";
import DataInfoRegister from "@/components/add/DataInfoRegister";

export default async function AddPage() {
  const services = await selectAllService();

  return (
    <main>
      <DataInfoRegister services={services} />
    </main>
  );
}
