import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const title = searchParams.get("title") || ""
    const text = searchParams.get("text") || ""
    const url = searchParams.get("url") || ""

    // Redirect to share page with data as URL params
    const params = new URLSearchParams()
    if (title) params.set("title", title)
    if (text) params.set("text", text)
    if (url) params.set("url", url)

    const baseUrl = request.nextUrl.origin
    return NextResponse.redirect(
      new URL(`/shared?${params.toString()}`, baseUrl)
    )
  } catch (error) {
    console.error("Error processing share:", error)
    const baseUrl = request.nextUrl.origin
    return NextResponse.redirect(new URL("/shared?error=1", baseUrl))
  }
}
