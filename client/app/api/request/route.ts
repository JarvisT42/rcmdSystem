import { NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db"; // adjust path if needed

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { details, action, id } = body;

    if (!details) {
      return NextResponse.json(
        { error: "Request details is required" },
        { status: 400 }
      );
    }

    const pool = await getDb();
    const request = pool.request();

    request.input("details", sql.NVarChar, details);

    // SAVE
    if (action === "save") {
      await request.query(`
        INSERT INTO request (request_details)
        VALUES (@details)
    `);
    }

    // UPDATE
    if (action === "update") {
      if (!id) {
        return NextResponse.json(
          { error: "ID is required for update" },
          { status: 400 }
        );
      }

      request.input("id", sql.Int, id);

      await request.query(`
        UPDATE requests
        SET request_details = @details
        WHERE id = @id
      `);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("API /request error:", error);

    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Database error", message },
      { status: 500 }
    );
  }
}
