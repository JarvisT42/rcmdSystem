import { NextRequest, NextResponse } from "next/server";
import { createConnection } from "../../../lib/db"; // adjust path

export async function GET(req: NextRequest) {
  try {
    const pool = await createConnection(); // connect to SQL Server

    // Query the Users table
    const result = await pool.request().query("SELECT * FROM Users");

    console.log("✅ Users table result:", result.recordset); // prints in terminal

    return NextResponse.json({ success: true, users: result.recordset });
  } catch (err) {
    console.error("❌ Connection failed or query error:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
