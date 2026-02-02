import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('http://localhost:8080/auth/session', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Session check response status:', response.status)

    if (response.ok) {
      const data = await response.json()
      console.log('Session check succeeded:', data)
      return NextResponse.json({ valid: true, user: data })
    } else {
      console.log('Session check failed')
      return NextResponse.json({ valid: false }, { status: 401 })
    }
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ valid: false, error: 'Failed to verify session' }, { status: 500 })
  }
}
