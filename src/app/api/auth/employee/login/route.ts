import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password harus diisi' },
        { status: 400 }
      )
    }

    // Find employee by email
    const employee = await db.employee.findUnique({
      where: { email }
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      )
    }

    // Check password (in production, use bcrypt or similar hashing)
    if (employee.password !== password) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      )
    }

    // Return employee data without password
    const { password: _, ...employeeData } = employee

    return NextResponse.json({
      success: true,
      employee: employeeData
    })

  } catch (error) {
    console.error('Employee login error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
