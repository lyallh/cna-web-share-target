import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = request.nextUrl
    return NextResponse.redirect(
      new URL(`/shared?${searchParams.toString()}`, origin)
    )
  } catch (error) {
    console.error('Error processing share:', error)
    return NextResponse.redirect(
      new URL('/shared?error=1', request.nextUrl.origin)
    )
  }
}
