import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Get employee by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await db.employee.findUnique({
      where: { id: params.id }
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Karyawan tidak ditemukan' },
        { status: 404 }
      )
    }

    // Return employee data without password
    const { password: _, ...employeeData } = employee

    return NextResponse.json({
      success: true,
      employee: employeeData
    })

  } catch (error) {
    console.error('Get employee error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

// PUT - Update employee
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { employeeNumber, name, email, phone, department, position, password } = body

    // Check if employee exists
    const existingEmployee = await db.employee.findUnique({
      where: { id: params.id }
    })

    if (!existingEmployee) {
      return NextResponse.json(
        { error: 'Karyawan tidak ditemukan' },
        { status: 404 }
      )
    }

    // Check if employee number is used by another employee
    if (employeeNumber && employeeNumber !== existingEmployee.employeeNumber) {
      const duplicateNumber = await db.employee.findUnique({
        where: { employeeNumber }
      })

      if (duplicateNumber) {
        return NextResponse.json(
          { error: 'Nomor karyawan sudah digunakan' },
          { status: 400 }
        )
      }
    }

    // Check if email is used by another employee
    if (email && email !== existingEmployee.email) {
      const duplicateEmail = await db.employee.findUnique({
        where: { email }
      })

      if (duplicateEmail) {
        return NextResponse.json(
          { error: 'Email sudah digunakan' },
          { status: 400 }
        )
      }
    }

    // Update employee
    const updateData: any = {}
    if (employeeNumber) updateData.employeeNumber = employeeNumber
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (phone !== undefined) updateData.phone = phone
    if (department) updateData.department = department
    if (position) updateData.position = position
    if (password) updateData.password = password

    const employee = await db.employee.update({
      where: { id: params.id },
      data: updateData
    })

    // Return employee data without password
    const { password: _, ...employeeData } = employee

    return NextResponse.json({
      success: true,
      employee: employeeData
    })

  } catch (error) {
    console.error('Update employee error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

// DELETE - Delete employee
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if employee exists
    const employee = await db.employee.findUnique({
      where: { id: params.id }
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Karyawan tidak ditemukan' },
        { status: 404 }
      )
    }

    // Delete employee (cascade delete will handle attendance records)
    await db.employee.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Karyawan berhasil dihapus'
    })

  } catch (error) {
    console.error('Delete employee error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
