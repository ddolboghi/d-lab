import { booleanFilter, numberFilter } from "@/lib/dataFilter";
import { Condition } from "@/utils/types";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { data, condition }: { data: any[]; condition: Condition } =
      await req.json();

    const filteredData = booleanFilter(data, condition);

    return NextResponse.json({ filteredData: filteredData });
  } catch (error) {
    console.error("[boolean-filter] Error: ", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
