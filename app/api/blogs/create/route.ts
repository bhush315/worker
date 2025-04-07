 

import { prisma } from "@/app/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    if (name.length > 15) {
      return NextResponse.json(
        { success: false, error: "Name must be less than 15 characters" },
        { status: 400 }
      );
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }
    const existingEmail = await prisma.worker.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: "Email already exists" },
        { status: 400 }
      );
    }

    await prisma.worker.create({ data: { name, email } });
    // revalidatePath("/blogs");
    return NextResponse.json(
      { success: true, message: "Data created" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating data:", error);
    return NextResponse.json(
      { success: false, error: "Unable to create data" },
      { status: 500 }
    );
  }
}

// This is a GET request handler that fetches all workers from the database
// and returns them in JSON format. It orders the workers by their creation date in descending order.

export async function GET(request: Request) {
  try {
    const data = await prisma.worker.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { success: false, error: "Unable to fecth data" },
      { status: 500 }
    );
  }
}
