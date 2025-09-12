import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const timestamp = new Date().toISOString();
  const environment = process.env.NODE_ENV || 'production';

  try {
    // Test database connection
    await prisma.$connect();

    // Count existing records
    const contactCount = await prisma.contactSubmission.count();
    const prayerCount = await prisma.prayerRequest.count();
    const paymentCount = await prisma.payment.count();

    res.json({
      status: 'OK',
      message: 'API server and database are running',
      timestamp,
      environment,
      database: {
        connected: true,
        counts: {
          contacts: contactCount,
          prayers: prayerCount,
          payments: paymentCount
        }
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(200).json({
      status: 'PARTIAL',
      message: 'API server is running but database connection failed',
      timestamp,
      environment,
      database: {
        connected: false,
        error: error.message
      }
    });
  } finally {
    await prisma.$disconnect();
  }
}
