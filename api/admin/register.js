import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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
    const { token, name, email, password } = req.body;
    
    if (!token || !name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }
    
    // Verify token
    const registrationToken = await prisma.registrationToken.findUnique({
      where: { token }
    });
    
    if (!registrationToken || registrationToken.isUsed || new Date() > registrationToken.expiresAt) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
    
    // Check if admin user already exists
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email }
    });
    
    if (existingAdmin) {
      return res.status(400).json({ 
        success: false, 
        message: 'Admin user already exists' 
      });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Create admin user
    const adminUser = await prisma.adminUser.create({
      data: {
        name,
        email,
        passwordHash
      }
    });
    
    // Mark token as used
    await prisma.registrationToken.update({
      where: { token },
      data: { isUsed: true }
    });
    
    console.log('New admin user registered:', email);
    
    res.json({ 
      success: true, 
      message: 'Admin user registered successfully',
      adminId: adminUser.id
    });
    
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed' 
    });
  } finally {
    await prisma.$disconnect();
  }
}
