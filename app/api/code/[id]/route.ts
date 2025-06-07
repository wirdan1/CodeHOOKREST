import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const client = await clientPromise
    const db = client.db("codeshare")
    const collection = db.collection("codes")

    const codeDocument = await collection.findOne({ shareId: id })

    if (!codeDocument) {
      return NextResponse.json({ error: "Code not found" }, { status: 404 })
    }

    // Increment view count
    await collection.updateOne({ shareId: id }, { $inc: { views: 1 } })

    return NextResponse.json({
      title: codeDocument.title,
      category: codeDocument.category,
      code: codeDocument.code,
      description: codeDocument.description,
      createdAt: codeDocument.createdAt,
    })
  } catch (error) {
    console.error("Error fetching code:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
