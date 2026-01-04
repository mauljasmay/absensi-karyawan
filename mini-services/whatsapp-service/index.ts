import { makeCacheableSignal } from '@whiskeysockets/baileys'
import { useMultiFileAuthState } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import pino from 'pino'
import makeWASocket from '@whiskeysockets/baileys'

// Configuration
const WHATSAPP_PORT = process.env.WHATSAPP_PORT || 3001
const WHATSAPP_BASE_URL = process.env.WHATSAPP_BASE_URL || 'https://wa.me'

// Logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname'
    }
  }
})

// WhatsApp instance
let waInstance: any = null

// Auth state with file persistence
const { state, saveCreds } = useMultiFileAuthState('baileys_auth_info')

// Initialize WhatsApp (Baileys v7)
async function initializeWhatsApp() {
  try {
    // Check if instance already exists
    if (waInstance) {
      logger.info('WhatsApp instance already initialized')
      return waInstance
    }

    logger.info('Initializing WhatsApp instance (Baileys v7)...')

    // Create new instance with v7 API
    waInstance = makeWASocket({
      auth: state.creds,
      printQRInTerminal: true,
      logger,
      browser: ['Chrome (Linux)', '', ''],
    })

    // Event handlers
    waInstance.ev.on('connection.update', async (data: any) => {
      const { connection, lastDisconnect, qr } = data

      if (qr) {
        logger.info('QR Code received:', qr.substring(0, 20) + '...')
        // QR code will be displayed in admin panel
      }

      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error instanceof Boom
          && lastDisconnect.error.output?.statusCode !== DisconnectReason.loggedOut
        logger.info('Connection closed. Reconnect:', shouldReconnect)
        if (shouldReconnect) {
          initializeWhatsApp()
        }
      }

      if (connection === 'open') {
        logger.info('WhatsApp connection opened!')
      }
    })

    waInstance.ev.on('creds.update', saveCreds)

    waInstance.ev.on('messages.upsert', async ({ messages, type }: any) => {
      for (const msg of messages) {
        if (type === 'notify') {
          for (const recipient of msg.key.remoteJid!) {
            await waInstance!.readMessages(recipient, msg.key.id!)
          }
        }
      }
    })

    return waInstance
  } catch (error: any) {
    logger.error('Error initializing WhatsApp:', error)
    throw error
  }
}

// Send message to WhatsApp (v7 API)
async function sendWhatsAppMessage(phone: string, message: string) {
  try {
    if (!waInstance) {
      await initializeWhatsApp()
    }

    // Wait for connection
    if (!waInstance.user) {
      logger.info('Waiting for connection...')
      await new Promise(resolve => {
        const timeout = setTimeout(resolve, 30000)
        waInstance!.ev.once('connection.open', () => {
          clearTimeout(timeout)
          resolve(true)
        })
      })
    }

    // Format phone number (remove +62 if present, add country code)
    let formattedPhone = phone.replace(/[^0-9]/g, '')

    // Add Indonesia country code if not present
    if (!formattedPhone.startsWith('62')) {
      formattedPhone = '62' + formattedPhone
    }

    const jid = formattedPhone + '@s.whatsapp.net'

    // Send message
    const result = await waInstance.sendMessage(jid, {
      text: message
    })

    logger.info({ msg: 'WhatsApp message sent', jid, messageId: result.key.id })

    return {
      success: true,
      messageId: result.key.id,
      timestamp: new Date().toISOString()
    }
  } catch (error: any) {
    logger.error({ msg: 'Error sending WhatsApp message', error })
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

    logger.info({ msg: `Attendance notification (${type}) sent to ${phone}`, result })
    return result
  } catch (error: any) {
    logger.error({ msg: 'Error sending attendance notification', error })
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

    logger.info({ msg: `Employee notification sent to ${phone}`, result })
    return result
  } catch (error: any) {
    logger.error({ msg: 'Error sending employee notification', error })
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
    connected: waInstance?.user ? true : false,
    qrCode: null,
    connecting: !waInstance?.user,
    error: !waInstance
  }
}

// Get current QR code (for admin panel)
function getCurrentQR() {
  return null // QR code v7 is displayed in terminal, use web-based version for display
}

// Disconnect WhatsApp
async function disconnectWhatsApp() {
  try {
    if (waInstance) {
      await waInstance.logout()
      waInstance = null
      logger.info('WhatsApp disconnected')
    }
  } catch (error: any) {
    logger.error({ msg: 'Error disconnecting WhatsApp', error })
  }
}

// Health check
function healthCheck() {
  return {
    service: 'whatsapp-service',
    version: '7.0.0',
    status: waInstance?.user ? 'active' : 'inactive',
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
      logger.error({ msg: 'Error in /send endpoint', error })
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
      logger.error({ msg: 'Error in /bulk-send endpoint', error })
      res.status(500).json({ success: false, error: error.message })
    }
  })

  app.post('/disconnect', async (req: any, res: any) => {
    try {
      await disconnectWhatsApp()
      res.json({ success: true, message: 'WhatsApp berhasil didisconnect' })
    } catch (error: any) {
      logger.error({ msg: 'Error disconnecting WhatsApp', error })
      res.status(500).json({ success: false, error: error.message })
    }
  })

  app.post('/reconnect', async (req: any, res: any) => {
    try {
      await disconnectWhatsApp()
      await initializeWhatsApp()
      res.json({ success: true, message: 'WhatsApp berhasil di-reconnect' })
    } catch (error: any) {
      logger.error({ msg: 'Error reconnecting WhatsApp', error })
      res.status(500).json({ success: false, error: error.message })
    }
  })

  app.post('/update', async (req: any, res: any) => {
    try {
      logger.info('Updating WhatsApp service...')
      await disconnectWhatsApp()
      await new Promise(resolve => setTimeout(resolve, 2000))
      await initializeWhatsApp()
      res.json({ success: true, message: 'WhatsApp service berhasil di-update' })
    } catch (error: any) {
      logger.error({ msg: 'Error updating WhatsApp service', error })
      res.status(500).json({ success: false, error: error.message })
    }
  })

  // Start server
  const server = app.listen(WHATSAPP_PORT, () => {
    logger.info(`WhatsApp Service running on port ${WHATSAPP_PORT}`)
    logger.info(`Health check: http://localhost:${WHATSAPP_PORT}/health`)
    logger.info(`API endpoints:`)
    logger.info(`  - POST /send - Send message`)
    logger.info(`  - POST /bulk-send - Send bulk messages`)
    logger.info(`  - POST /update - Update/restart service`)
    logger.info(`  - POST /disconnect - Disconnect WhatsApp`)
    logger.info(`  - POST /reconnect - Reconnect WhatsApp`)
    logger.info(`  - GET /health - Health check`)
    logger.info(`  - GET /status - Connection status`)
    logger.info(`  - GET /qr - Get QR code`)
  })

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully...')
    await disconnectWhatsApp()
    server.close(() => {
      logger.info('Server closed')
      process.exit(0)
    })
  })

  process.on('SIGINT', async () => {
    logger.info('SIGINT received, shutting down gracefully...')
    await disconnectWhatsApp()
    server.close(() => {
      logger.info('Server closed')
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
