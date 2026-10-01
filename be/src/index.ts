import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import submissionRoutes from './routes/submission.routes';
import adminRoutes from './routes/admin.routes';
import configRoutes from './routes/config.routes';
import verificationRoutes from './routes/verification.routes';
import receiptRoutes from './routes/receipt.routes';
import { prisma } from './config/prisma';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiters
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // 5 attempts
  message: {
    success: false,
    error: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  max: 3, // 3 submissions per jam per IP
  message: {
    success: false,
    error: 'Anda sudah mengirim 3 karya dalam 1 jam terakhir'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (_req, res) => {
  res.json({ 
    success: true, 
    message: 'Backend Portal Sayembara Logo Mamuju Tengah aktif' 
  });
});

// Apply rate limiters
app.use('/api/auth/login', loginLimiter);
app.use('/api/submissions', submissionLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/config', configRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/receipt', receiptRoutes);

app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing server gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Self-ping Render (cegah sleep)
  if (process.env.RENDER_EXTERNAL_HOSTNAME) {
    const selfPingUrl = `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`;
    const pingInterval = 7 * 60 * 1000; // 7 menit
    
    console.log(`Self-ping aktif: ${selfPingUrl} setiap 7 menit`);
    
    setInterval(async () => {
      try {
        const response = await fetch(selfPingUrl);
        if (response.ok) {
          console.log(`[${new Date().toLocaleTimeString('id-ID')}] Self-ping sukses`);
        } else {
          console.warn(`[${new Date().toLocaleTimeString('id-ID')}] Self-ping gagal (${response.status})`);
        }
      } catch (error) {
        console.error(`[${new Date().toLocaleTimeString('id-ID')}] Error self-ping:`, 
          error instanceof Error ? error.message : 'Unknown');
      }
    }, pingInterval);
  }

  // DB keep-alive (cegah Supabase pause)
  const dbPingInterval = 12 * 60 * 60 * 1000; // 12 jam
  console.log('DB keep-alive aktif setiap 12 jam');
  
  setInterval(async () => {
    try {
      await prisma.$executeRaw`SELECT 1`;
      console.log(`[${new Date().toLocaleTimeString('id-ID')}] DB keep-alive sukses`);
    } catch (error) {
      console.error(`[${new Date().toLocaleTimeString('id-ID')}] DB keep-alive gagal:`, error);
    }
  }, dbPingInterval);
});
