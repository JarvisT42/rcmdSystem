import { NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { details, action, id, branchId, departmentId, misId } = body;

    if (!details) {
      return NextResponse.json(
        { error: "Request details is required" },
        { status: 400 }
      );
    }

    const pool = await getDb();
    const request = pool.request();

    request.input("details", sql.NVarChar, details);

    // Add branchId input
    if (branchId) {
      request.input("branchId", sql.Int, parseInt(branchId));
    } else {
      request.input("branchId", sql.Int, null);
    }
    if (departmentId) {
      request.input("departmentId", sql.Int, parseInt(departmentId));
    } else {
      request.input("departmentId", sql.Int, null);
    }

    // misId
    if (misId) {
      request.input("misId", sql.Int, parseInt(misId));
    } else {
      request.input("misId", sql.Int, null);
    }
    // SAVE
    if (action === "save") {
      await request.query(`
        INSERT INTO request (request_details, branch_id, department_id, mis_id)
        VALUES (@details, @branchId, @departmentId, @misId)
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
        SET request_details = @details, branch_id = @branchId, department_id = @departmentId, mis_id = @misId
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

export async function GET() {
  try {
    const db = await getDb();

    const result = await db.request().query("SELECT * FROM request");

    return NextResponse.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch request" },
      { status: 500 }
    );
  }
}
