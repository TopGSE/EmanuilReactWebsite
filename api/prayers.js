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
    if (req.method === 'GET') {
      // Get all prayer requests
      const prayers = await prisma.prayerRequest.findMany({
        orderBy: { createdAt: 'desc' }
      });
      
      res.status(200).json(prayers);
    } else if (req.method === 'POST') {
      // Create new prayer request
      const { name, email, phone, requestText, isAnonymous = false, language = 'en' } = req.body;
      
      if (!requestText) {
        return res.status(400).json({ 
          success: false, 
          message: 'Prayer request text is required' 
        });
      }

      const prayer = await prisma.prayerRequest.create({
        data: {
          name: isAnonymous ? null : name,
          email: isAnonymous ? null : email,
          phone: isAnonymous ? null : phone,
          requestText,
          isAnonymous,
          language,
          status: 'active'
        }
      });

      res.status(201).json({ success: true, prayer });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Prayer requests API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  } finally {
    await prisma.$disconnect();
  }
}
