import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Test database with a simple query
    const contactCount = await prisma.contactSubmission.count();
    const prayerCount = await prisma.prayerRequest.count();
    const adminCount = await prisma.adminUser.count();
    const tokenCount = await prisma.registrationToken.count();

    res.status(200).json({
      success: true,
      message: 'Database connection successful',
      data: {
        contacts: contactCount,
        prayers: prayerCount,
        admins: adminCount,
        tokens: tokenCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
}
