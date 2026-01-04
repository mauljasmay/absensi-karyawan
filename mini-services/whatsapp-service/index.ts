import { create } from 'baileys'
import { z } from 'zod'

// Configuration
const WHATSAPP_PORT = process.env.WHATSAPP_PORT || 3001
const WHATSAPP_BASE_URL = process.env.WHATSAPP_BASE_URL || 'https://wa.me'

// WhatsApp instance
let waInstance: any = null

// Initialize WhatsApp
async function initializeWhatsApp() {
  try {
    // Check if instance already exists
    if (waInstance) {
      console.log('WhatsApp instance already initialized')
      return waInstance
    }

    // Create new instance
    waInstance = create({
      auth: {
        username: process.env.WHATSAPP_USERNAME,
        password: process.env.WHATSAPP_PASSWORD,
        server: process.env.WHATSAPP_SERVER || 'wa.gw.msg',
        port: process.env.WHATSAPP_SERVER_PORT || '443',
      },
      qrTimeout: 60000,
      authTimeout: 60000,
    })

    // Start the instance
    await waInstance.connect()

    // Event handlers
    waInstance.on('connection.update', (data: any) => {
      console.log('Connection update:', data)
    })

    waInstance.on('qr', async (qr: string) => {
      console.log('QR Code received:', qr)
      // QR code will be displayed in admin panel
    })

    waInstance.on('connection.close', () => {
      console.log('Connection closed')
      waInstance = null
    })

    waInstance.on('creds.update', () => {
      console.log('Credentials updated')
    })

    waInstance.on('ready', () => {
      console.log('WhatsApp instance is ready!')
    })

    return waInstance
  } catch (error) {
    console.error('Error initializing WhatsApp:', error)
    throw error
  }
}

// Send message to WhatsApp
async function sendWhatsAppMessage(phone: string, message: string) {
  try {
    if (!waInstance) {
      await initializeWhatsApp()
    }

    // Format phone number (remove +62 if present, add country code)
    let formattedPhone = phone.replace(/[^0-9]/g, '')
    
    // Add Indonesia country code if not present
    if (!formattedPhone.startsWith('62')) {
      formattedPhone = '62' + formattedPhone
    }

    const jid = formattedPhone + '@s.whatsapp.net'

    // Check if number exists on WhatsApp
    const exists = await waInstance.onWhatsApp(jid)
    if (!exists) {
      console.log('Phone number not found on WhatsApp:', jid)
      throw new Error('Nomor telepon tidak terdaftar di WhatsApp')
    }

    // Send message
    const result = await waInstance.sendMessage(jid, message)

    console.log('WhatsApp message sent:', result)
    return {
      success: true,
      messageId: result?.id,
      timestamp: new Date().toISOString()
    }
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error)
    return {
      success: false,
      error: error.message || 'Gagal mengirim pesan WhatsApp'
    }
  }
}

// Send attendance notification
async function sendAttendanceNotification(
  phone: string,
  employeeName: string,
  type: 'check-in' | 'check-out',
  time: string,
  date: string
) {
  try {
    const messages: Record<string, string> = {
      'check-in': `✅ *Berhasil Check-In*\n\n👤 *Karyawan:* ${employeeName}\n⏰ *Waktu:* ${time}\n📅 *Tanggal:* ${date}\n\nSelamat bekerja! Semoga hari yang produktif. 🌟`,
      'check-out': `✅ *Berhasil Check-Out*\n\n👤 *Karyawan:* ${employeeName}\n⏰ *Waktu:* ${time}\n📅 *Tanggal:* ${date}\n\nTerima kasih atas kerja hari ini! Sampai jumpa besok. 🙏`
    }

    const message = messages[type]

    const result = await sendWhatsAppMessage(phone, message)

    console.log(`Attendance notification (${type}) sent to ${phone}:`, result)
    return result
  } catch (error: any) {
    console.error('Error sending attendance notification:', error)
    return {
      success: false,
      error: error.message || 'Gagal mengirim notifikasi absensi'
    }
  }
}

// Send employee notification (for other purposes)
async function sendEmployeeNotification(
  phone: string,
  employeeName: string,
  title: string,
  message: string
) {
  try {
    const fullMessage = `📢 *${title}*\n\n👤 *Karyawan:* ${employeeName}\n\n${message}`

    const result = await sendWhatsAppMessage(phone, fullMessage)

    console.log(`Employee notification sent to ${phone}:`, result)
    return result
  } catch (error: any) {
    console.error('Error sending employee notification:', error)
    return {
      success: false,
      error: error.message || 'Gagal mengirim notifikasi karyawan'
    }
  }
}

// Send bulk notifications
async function sendBulkNotifications(recipients: Array<{
  phone: string
  employeeName: string
  type: 'check-in' | 'check-out'
  time: string
  date: string
}>) {
  const results = []

  for (const recipient of recipients) {
    const result = await sendAttendanceNotification(
      recipient.phone,
      recipient.employeeName,
      recipient.type,
      recipient.time,
      recipient.date
    )
    results.push(result)

    // Add delay between messages to avoid being blocked (100ms delay)
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  return {
    success: true,
    total: recipients.length,
    sent: results.filter(r => r.success).length,
    failed: results.filter(r => r.success === false).length,
    results
  }
}

// Check connection status
function getConnectionStatus() {
  return {
    connected: waInstance?.state === 'open',
    qrCode: waInstance?.state === 'qr',
    connecting: waInstance?.state === 'connecting',
    error: !waInstance
  }
}

// Get current QR code (for admin panel)
function getCurrentQR() {
  return waInstance?.qr || null
}

// Disconnect WhatsApp
async function disconnectWhatsApp() {
  try {
    if (waInstance) {
      await waInstance.logout()
      waInstance = null
      console.log('WhatsApp disconnected')
    }
  } catch (error) {
    console.error('Error disconnecting WhatsApp:', error)
  }
}

// Health check
function healthCheck() {
  return {
    service: 'whatsapp-service',
    status: waInstance ? 'active' : 'inactive',
    connectionStatus: getConnectionStatus(),
    port: WHATSAPP_PORT,
    timestamp: new Date().toISOString()
  }
}

// API Server
async function startServer() {
  const express = require('express')
  const cors = require('cors')
  const app = express()

  // Middleware
  app.use(cors())
  app.use(express.json())

  // Initialize WhatsApp on startup
  await initializeWhatsApp()

  // Routes
  app.get('/health', (req: any, res: any) => {
    res.json(healthCheck())
  })

  app.get('/status', (req: any, res: any) => {
    res.json(getConnectionStatus())
  })

  app.get('/qr', (req: any, res: any) => {
    const qr = getCurrentQR()
    if (qr) {
      res.json({ success: true, qr })
    } else {
      res.status(404).json({ success: false, message: 'QR code not available' })
    }
  })

  app.post('/send', async (req: any, res: any) => {
    try {
      const { phone, message, type, employeeName, time, date } = req.body

      if (!phone) {
        return res.status(400).json({ success: false, message: 'Nomor telepon wajib diisi' })
      }

      let result

      if (type === 'attendance') {
        result = await sendAttendanceNotification(
          phone,
          employeeName,
          req.body.attendanceType || 'check-in',
          time || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        )
      } else if (type === 'custom') {
        result = await sendEmployeeNotification(phone, employeeName, req.body.title || '', message)
      } else {
        result = await sendWhatsAppMessage(phone, message)
      }

      res.json(result)
    } catch (error: any) {
      console.error('Error in /send endpoint:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  })

  app.post('/bulk-send', async (req: any, res: any) => {
    try {
      const { recipients } = req.body

      if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({ success: false, message: 'Recipients harus berupa array' })
      }

      const result = await sendBulkNotifications(recipients)
      res.json(result)
    } catch (error: any) {
      console.error('Error in /bulk-send endpoint:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  })

  app.post('/disconnect', async (req: any, res: any) => {
    try {
      await disconnectWhatsApp()
      res.json({ success: true, message: 'WhatsApp berhasil didisconnect' })
    } catch (error: any) {
      console.error('Error disconnecting WhatsApp:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  })

  app.post('/reconnect', async (req: any, res: any) => {
    try {
      await disconnectWhatsApp()
      await initializeWhatsApp()
      res.json({ success: true, message: 'WhatsApp berhasil di-reconnect' })
    } catch (error: any) {
      console.error('Error reconnecting WhatsApp:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  })

  // Start server
  const server = app.listen(WHATSAPP_PORT, () => {
    console.log(`WhatsApp Service running on port ${WHATSAPP_PORT}`)
    console.log(`Health check: http://localhost:${WHATSAPP_PORT}/health`)
    console.log(`API endpoints:`)
    console.log(`  - POST /send - Send message`)
    console.log(`  - POST /bulk-send - Send bulk messages`)
    console.log(`  - POST /disconnect - Disconnect WhatsApp`)
    console.log(`  - POST /reconnect - Reconnect WhatsApp`)
    console.log(`  - GET /health - Health check`)
    console.log(`  - GET /status - Connection status`)
    console.log(`  - GET /qr - Get QR code`)
  })

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...')
    await disconnectWhatsApp()
    server.close(() => {
      console.log('Server closed')
      process.exit(0)
    })
  })

  process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully...')
    await disconnectWhatsApp()
    server.close(() => {
      console.log('Server closed')
      process.exit(0)
    })
  })

  return server
}

// Start server if this file is run directly
if (require.main === module) {
  startServer()
}

export {
  startServer,
  sendWhatsAppMessage,
  sendAttendanceNotification,
  sendBulkNotifications,
  getConnectionStatus,
  getCurrentQR,
  disconnectWhatsApp,
  healthCheck
}
