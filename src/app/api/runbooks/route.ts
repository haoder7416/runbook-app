import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 取得全部 Runbook
export async function GET() {
  const runbooks = await prisma.runbook.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(runbooks);
}

// 新增一筆 Runbook
export async function POST(request: Request) {
  const body = await request.json();

  const { title, symptom, action, tags } = body;

  if (!title || !symptom || !action) {
    return NextResponse.json(
      { error: "title / symptom / action 為必填" },
      { status: 400 }
    );
  }

  const runbook = await prisma.runbook.create({
    data: {
      title,
      symptom,
      action,
      tags: Array.isArray(tags) ? tags : [],
    },
  });

  return NextResponse.json(runbook, { status: 201 });
}