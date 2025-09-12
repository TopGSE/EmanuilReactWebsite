import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    // Get total payments count
    const totalPayments = await prisma.payment.count();

    // Get total amount (sum of all payments in cents, convert to euros)
    const payments = await prisma.payment.findMany({
      select: {
        amount: true,
        type: true,
        status: true
      }
    });

    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0) / 100; // Convert cents to euros

    // Get payments by type
    const paymentsByType = payments.reduce((acc, payment) => {
      acc[payment.type] = (acc[payment.type] || 0) + 1;
      return acc;
    }, {});

    // Get payments by status
    const paymentsByStatus = payments.reduce((acc, payment) => {
      acc[payment.status] = (acc[payment.status] || 0) + 1;
      return acc;
    }, {});

    // Get recent payments (last 10)
    const recentPayments = await prisma.payment.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 10,
      select: {
        id: true,
        amount: true,
        type: true,
        donorName: true,
        donorEmail: true,
        status: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      stats: {
        totalPayments,
        totalAmount,
        paymentsByType,
        paymentsByStatus,
        recentPayments
      }
    });
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment statistics'
    });
  } finally {
    await prisma.$disconnect();
  }
}