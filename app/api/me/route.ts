import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const token =
      request.cookies.get('better-auth.session_token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const response = await fetch('http://localhost:8080/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `better-auth.session_token=${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        { error },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (err) {
    return NextResponse.json(
      { error: 'Internal error', details: String(err) },
      { status: 500 }
    )
  }
}
