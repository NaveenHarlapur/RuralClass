import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("assignments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GET Error:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    assignments: data,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      subject,
      dueDate,
      teacherName,
    } = body;

    const { data, error } = await supabase
      .from("assignments")
      .insert([
        {
          title,
          description,
          subject,
          due_date: dueDate,
          teacher_name: teacherName,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("POST Error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      assignment: data,
    });
  } catch (error) {
    console.error("Server Error:", error);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}
