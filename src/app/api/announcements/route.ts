import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(
  process.cwd(),
  "src/components/Header/components/announcements.json"
);

export async function GET() {
  const data = await fs.readFile(filePath, "utf-8");
  return NextResponse.json(JSON.parse(data));
}

export async function POST(request: NextRequest) {
  const newAnnouncements = await request.json();
  await fs.writeFile(
    filePath,
    JSON.stringify(newAnnouncements, null, 2),
    "utf-8"
  );
  return NextResponse.json({ success: true });
}
