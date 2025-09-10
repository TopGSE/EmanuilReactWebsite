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
      // Get all contact submissions
      const contacts = await prisma.contactSubmission.findMany({
        orderBy: { createdAt: 'desc' }
      });
      
      res.status(200).json(contacts);
    } else if (req.method === 'POST') {
      // Create new contact submission
      const { name, email, phone, subject, message, language = 'en' } = req.body;
      
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields' 
        });
      }

      const contact = await prisma.contactSubmission.create({
        data: {
          name,
          email,
          phone: phone || null,
          subject,
          message,
          language,
          status: 'new'
        }
      });

      res.status(201).json({ success: true, contact });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Contact API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  } finally {
    await prisma.$disconnect();
  }
}
