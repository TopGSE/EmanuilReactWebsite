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
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }
    
    // Find admin user
    const adminUser = await prisma.adminUser.findUnique({
      where: { email }
    });
    
    if (!adminUser || !adminUser.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, adminUser.passwordHash);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Update last login time
    await prisma.adminUser.update({
      where: { id: adminUser.id },
      data: { lastLoginAt: new Date() }
    });
    
    console.log('Admin login successful:', email);
    
    res.json({ 
      success: true, 
      admin: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email
      }
    });
    
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed' 
    });
  } finally {
    await prisma.$disconnect();
  }
}
