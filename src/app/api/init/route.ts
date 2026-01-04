import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Check if admin already exists
    const existingAdmin = await db.admin.findFirst({
      where: { username: 'admin' }
    })

    let admin
    if (!existingAdmin) {
      // Create default admin
      admin = await db.admin.create({
        data: {
          username: 'admin',
          password: 'admin123',
          name: 'Administrator'
        }
      })
    } else {
      admin = existingAdmin
    }

    // Check if sample employee exists
    const existingEmployee = await db.employee.findFirst({
      where: { email: 'employee@example.com' }
    })

    let employee
    if (!existingEmployee) {
      // Create sample employee
      employee = await db.employee.create({
        data: {
          employeeNumber: 'EMP001',
          name: 'Budi Santoso',
          email: 'employee@example.com',
          phone: '08123456789',
          department: 'IT',
          position: 'Software Engineer',
          password: 'employee123'
        }
      })
    } else {
      employee = existingEmployee
    }

    // Generate today's QR code
    const today = new Date().toISOString().split('T')[0]
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase()
    const qrCodeString = `QR-${today}-${randomString}`

    let dailyQR = await db.dailyQR.findUnique({
      where: { date: today }
    })

    if (!dailyQR) {
      dailyQR = await db.dailyQR.create({
        data: {
          date: today,
          qrCode: qrCodeString,
          isActive: true
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      data: {
        admin: {
          username: admin.username,
          password: admin.password,
          name: admin.name
        },
        employee: {
          employeeNumber: employee.employeeNumber,
          name: employee.name,
          email: employee.email,
          password: employee.password
        },
        qrCode: dailyQR
      }
    })

  } catch (error) {
    console.error('Init database error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menginisialisasi database' },
      { status: 500 }
    )
  }
}
