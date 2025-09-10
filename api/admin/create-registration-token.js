import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }
    
    // Generate unique token
    const token = randomUUID();
    
    // Set expiration to 24 hours from now
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    // Create token in database
    const registrationToken = await prisma.registrationToken.create({
      data: {
        token,
        email,
        expiresAt
      }
    });
    
    // Create registration link - use the current domain
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.FRONTEND_URL || 'http://localhost:5173';
    
    const registrationLink = `${baseUrl}/admin-register?token=${token}`;
    
    console.log('Registration token created for:', email);
    
    res.json({ 
      success: true, 
      registrationLink,
      expiresAt: expiresAt.toISOString()
    });
    
  } catch (error) {
    console.error('Error creating registration token:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create registration token' 
    });
  } finally {
    await prisma.$disconnect();
  }
}
