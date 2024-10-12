import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json(
      {
        message: "ok",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An unexpected error occurred", error: error },
      { status: 500 }
    );
  }
}
