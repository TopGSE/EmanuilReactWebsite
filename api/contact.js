import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const contacts = await prisma.contactSubmission.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json({
        success: true,
        contacts
      });
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch contacts'
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, email, phone, subject, message, language } = req.body;

      // Validate required fields
      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          error: 'Name, email, and message are required'
        });
      }

      const contact = await prisma.contactSubmission.create({
        data: {
          name,
          email,
          phone: phone || '',
          subject: subject || '',
          message,
          language: language || 'en'
        }
      });

      res.json({
        success: true,
        contact,
        message: 'Contact form submitted successfully'
      });
    } catch (error) {
      console.error('Error creating contact:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to submit contact form'
      });
    }
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  await prisma.$disconnect();
}