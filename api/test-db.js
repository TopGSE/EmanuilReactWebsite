import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Test database connection
    await prisma.$connect();

    // Count existing records
    const contactCount = await prisma.contactSubmission.count();
    const prayerCount = await prisma.prayerRequest.count();
    const paymentCount = await prisma.payment.count();

    res.json({
      success: true,
      message: 'Database connected successfully',
      counts: {
        contacts: contactCount,
        prayers: prayerCount,
        payments: paymentCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      success: false,
      error: 'Database connection failed',
      details: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
}
