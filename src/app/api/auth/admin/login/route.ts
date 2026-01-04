import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username dan password harus diisi' },
        { status: 400 }
      )
    }

    // Find admin by username
    const admin = await db.admin.findUnique({
      where: { username }
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      )
    }

    // Check password (in production, use bcrypt or similar hashing)
    if (admin.password !== password) {
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      )
    }

    // Return admin data without password
    const { password: _, ...adminData } = admin

    return NextResponse.json({
      success: true,
      admin: adminData
    })

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
