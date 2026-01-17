import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDb();

    const result = await db
      .request()
      .query("SELECT mis_id, mis_name FROM misName");

    return NextResponse.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch mis name" },
      { status: 500 }
    );
  }
}
