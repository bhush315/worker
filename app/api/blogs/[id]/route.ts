import { prisma } from "@/app/libs/prisma";
import { NextResponse } from "next/server";

/// Single Page View
export async function GET(
  Req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    // Implement your logic here to fetch a blog by its ID
    const response = await prisma.worker.findUnique({ where: { id } });
    if (!response) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    // console.error("Error fetching blog:", error);
    return NextResponse.json(
      { success: false, error: "Unable to fetch blog" + error },
      { status: 500 }
    );
  }
}

// Delete POst

export async function DELETE(
  Req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const response = await prisma.worker.delete({ where: { id } });
    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Unable to delete blog" + error },
      { status: 500 }
    );
  }
}

// Update Post
export async function PUT(
  Req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { name, email } = await Req.json();
    const response = await prisma.worker.update({
      where: { id },
      data: { name, email },
    });
    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
      data: response,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Unable to update blog" + error },
      { status: 500 }
    );
  }
}
