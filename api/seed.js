import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Serve the HTML interface
    try {
      const htmlPath = path.join(__dirname, '..', 'public', 'seed-db.html');
      const html = fs.readFileSync(htmlPath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(html);
    } catch (error) {
      console.error('Error serving seed-db page:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    return;
  }

  if (req.method === 'POST') {
    // Handle database seeding
    try {
      console.log('🌱 Starting production database seeding...');

      // Check if admin user already exists
      const existingAdmin = await prisma.adminUser.findFirst();
      if (existingAdmin) {
        return res.json({
          success: true,
          message: 'Admin user already exists',
          admin: { email: existingAdmin.email, name: existingAdmin.name }
        });
      }

      // Create default admin user
      const hashedPassword = await bcrypt.hash('admin123', 12);

      const adminUser = await prisma.adminUser.create({
        data: {
          name: 'Administrator',
          email: 'admin@emanuelchurchbg.be',
          passwordHash: hashedPassword,
          isActive: true
        }
      });

      console.log('✅ Created admin user:', adminUser.email);

      // Add sample contact for testing
      await prisma.contactSubmission.create({
        data: {
          name: 'Welcome Visitor',
          email: 'welcome@emanuelchurchbg.be',
          phone: '+32 123 456 789',
          subject: 'Welcome to Christian Center Emmanuel',
          message: 'Thank you for visiting our website. We hope to see you at our services!',
          language: 'en'
        }
      });

      res.json({
        success: true,
        message: 'Production database seeded successfully',
        admin: {
          email: adminUser.email,
          name: adminUser.name,
          password: 'admin123'
        },
        note: 'Please change the default password after first login!'
      });

    } catch (error) {
      console.error('❌ Error seeding database:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to seed database',
        details: error.message
      });
    } finally {
      await prisma.$disconnect();
    }
    return;
  }

  // Method not allowed
  res.status(405).json({ error: 'Method not allowed' });
}