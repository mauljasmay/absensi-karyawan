import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'admin'

    if (type === 'admin') {
      // Admin dashboard stats
      const today = new Date().toISOString().split('T')[0]

      const totalEmployees = await db.employee.count()
      const todayAttendance = await db.attendance.findMany({
        where: { date: today },
        include: { employee: true }
      })

      const todayPresent = todayAttendance.filter(a => a.status === 'present').length
      const todayLate = todayAttendance.filter(a => a.status === 'late').length
      const todayAbsent = totalEmployees - todayAttendance.length

      const totalAttendance = await db.attendance.count()

      // Get recent attendance
      const recentAttendance = await db.attendance.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { employee: true }
      })

      return NextResponse.json({
        success: true,
        stats: {
          totalEmployees,
          todayPresent,
          todayLate,
          todayAbsent,
          totalAttendance
        },
        recentAttendance: recentAttendance.map(a => ({
          id: a.id,
          name: a.employee.name,
          department: a.employee.department,
          checkIn: a.checkInTime,
          status: a.status.charAt(0).toUpperCase() + a.status.slice(1)
        }))
      })
    } else if (type === 'employee') {
      // Employee dashboard stats
      const employeeId = searchParams.get('employeeId')

      if (!employeeId) {
        return NextResponse.json(
          { error: 'Employee ID is required' },
          { status: 400 }
        )
      }

      const today = new Date().toISOString().split('T')[0]

      // Get employee data
      const employee = await db.employee.findUnique({
        where: { id: employeeId }
      })

      if (!employee) {
        return NextResponse.json(
          { error: 'Employee not found' },
          { status: 404 }
        )
      }

      // Get today's attendance
      const todayAttendance = await db.attendance.findUnique({
        where: {
          employeeId_date: {
            employeeId,
            date: today
          }
        }
      })

      // Get recent attendance history
      const recentAttendance = await db.attendance.findMany({
        where: { employeeId },
        take: 5,
        orderBy: { date: 'desc' }
      })

      return NextResponse.json({
        success: true,
        employee,
        todayAttendance,
        recentAttendance
      })
    }

    return NextResponse.json(
      { error: 'Invalid type' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
