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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token is required' 
      });
    }
    
    const registrationToken = await prisma.registrationToken.findUnique({
      where: { token }
    });
    
    if (!registrationToken) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    
    if (registrationToken.isUsed) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token already used' 
      });
    }
    
    if (new Date() > registrationToken.expiresAt) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    
    res.json({ 
      success: true, 
      tokenInfo: {
        email: registrationToken.email,
        expiresAt: registrationToken.expiresAt
      }
    });
    
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Token verification failed' 
    });
  } finally {
    await prisma.$disconnect();
  }
}
