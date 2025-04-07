import { prisma } from "@/app/libs/prisma";
import { NextResponse } from "next/server";

// Single Page View
export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;
    const response = await prisma.worker.findUnique({ where: { id } });
    if (!response) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Unable to fetch blog: " + error },
      { status: 500 }
    );
  }
}

// Delete Post
export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params; // Directly use `params` without `await`
    const response = await prisma.worker.delete({ where: { id } });
    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Unable to delete blog: " + error },
      { status: 500 }
    );
  }
}

// Update Post
export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params; // Directly use `params` without `await`
    const { name, email } = await req.json(); // Using req.json() to get the request body
    const response = await prisma.worker.update({
      where: { id },
      data: { name, email },
    });
    return NextResponse.json({
      success: true,
      message: "Blog updated successfully",
      data: response,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Unable to update blog: " + error },
      { status: 500 }
    );
  }
}
