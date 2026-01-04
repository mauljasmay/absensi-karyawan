import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

// Allowed file types
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

// Max file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

// POST - Upload file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'avatar' or 'other'

    if (!file) {
      return NextResponse.json(
        { error: 'Tidak ada file yang diupload' },
        { status: 400 }
      )
    }

    // Check file type
    if (!file.type || !ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipe file tidak diizinkan. Gunakan JPG, PNG, GIF, atau WebP.' },
        { status: 400 }
      )
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Ukuran file terlalu besar. Maksimal 5MB.' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Create unique filename
    const fileExtension = file.name.split('.').pop()
    const uniqueFilename = `${uuidv4()}.${fileExtension}`
    const filePath = path.join(uploadsDir, uniqueFilename)

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Write file to disk
    await writeFile(filePath, buffer)

    // Return the file URL
    const fileUrl = `/uploads/${uniqueFilename}`

    console.log('File uploaded:', fileUrl)

    return NextResponse.json({
      success: true,
      fileUrl,
      filename: uniqueFilename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Gagal mengupload file' },
      { status: 500 }
    )
  }
}
