import { metadataFilter } from "@/lib/dataFilter";
import { Metadata } from "@/utils/types";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { data, metadatas }: { data: any[]; metadatas: Metadata[] } =
      await req.json();

    const filteredData = metadataFilter(data, metadatas);

    return NextResponse.json({ filteredData: filteredData });
  } catch (error) {
    console.error("[metadata-filter] Error: ", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
