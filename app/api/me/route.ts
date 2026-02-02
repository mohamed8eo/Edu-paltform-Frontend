import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('better-auth.session_token')?.value || ''
    const cookieHeader = `better-auth.session_token=${token}`
    console.log('Cookie header being sent:', cookieHeader)
    
    const response = await fetch('http://localhost:8080/me', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
    })

    console.log('Backend response status:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('Backend response data:', data)
      return NextResponse.json(data)
    } else {
      const error = await response.text()
      console.log('Backend error:', error)
      return NextResponse.json({ error: 'Failed to fetch user', details: error }, { status: response.status })
    }
  } catch (error) {
    console.error('User fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch user', message: String(error) }, { status: 500 })
  }
}
