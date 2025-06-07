import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { nanoid } from "nanoid"

export async function POST(request: NextRequest) {
  try {
    const { title, category, code, description } = await request.json()

    if (!title || !category || !code) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("codeshare")
    const collection = db.collection("codes")

    const shareId = nanoid(10)

    const codeDocument = {
      shareId,
      title,
      category,
      code,
      description: description || "",
      createdAt: new Date().toISOString(),
      views: 0,
    }

    await collection.insertOne(codeDocument)

    return NextResponse.json({ shareId })
  } catch (error) {
    console.error("Error sharing code:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
