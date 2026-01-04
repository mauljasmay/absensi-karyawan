import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Get all employees
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const department = searchParams.get('department')

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { employeeNumber: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (department) {
      where.department = department
    }

    const employees = await db.employee.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      employees
    })

  } catch (error) {
    console.error('Get employees error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

// POST - Create new employee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { employeeNumber, name, email, phone, department, position, password } = body

    if (!employeeNumber || !name || !email || !department || !position || !password) {
      return NextResponse.json(
        { error: 'Semua field wajib harus diisi' },
        { status: 400 }
      )
    }

    // Check if employee number already exists
    const existingNumber = await db.employee.findUnique({
      where: { employeeNumber }
    })

    if (existingNumber) {
      return NextResponse.json(
        { error: 'Nomor karyawan sudah digunakan' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingEmail = await db.employee.findUnique({
      where: { email }
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email sudah digunakan' },
        { status: 400 }
      )
    }

    // Create employee
    const employee = await db.employee.create({
      data: {
        employeeNumber,
        name,
        email,
        phone,
        department,
        position,
        password
      }
    })

    // Return employee data without password
    const { password: _, ...employeeData } = employee

    return NextResponse.json({
      success: true,
      employee: employeeData
    }, { status: 201 })

  } catch (error) {
    console.error('Create employee error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
