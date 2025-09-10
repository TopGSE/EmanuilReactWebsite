// Simple API server for handling database operations
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import stripeRoutes from './api/stripe.js';

// Load environment variables
dotenv.config();
dotenv.config({ path: '.env.local' });

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API server is running' });
});

// Submit contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message, language } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    // Determine if it's a prayer request
    const isPrayerRequest = subject.toLowerCase().includes('prayer') || 
                           message.toLowerCase().includes('pray');

    let result;
    
    if (isPrayerRequest) {
      // Save as prayer request
      result = await prisma.prayerRequest.create({
        data: {
          name,
          email: email || null,
          phone: phone || null,
          requestText: message,
          isAnonymous: !name || name.trim() === '',
          language: language || 'en',
          status: 'active'
        }
      });
      
      console.log('Prayer request saved:', result.id);
    } else {
      // Save as contact submission
      result = await prisma.contactSubmission.create({
        data: {
          name,
          email,
          phone: phone || null,
          subject,
          message,
          language: language || 'en',
          status: 'new'
        }
      });
      
      console.log('Contact submission saved:', result.id);
    }

    res.json({ 
      success: true, 
      id: result.id,
      type: isPrayerRequest ? 'prayer' : 'contact'
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save submission' 
    });
  }
});

// Submit prayer request
app.post('/api/prayer-requests', async (req, res) => {
  try {
    const { name, email, phone, message, language } = req.body;
    
    // Validate required fields
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Prayer request text is required' 
      });
    }

    const result = await prisma.prayerRequest.create({
      data: {
        name: name || null,
        email: email || null,
        phone: phone || null,
        requestText: message,
        isAnonymous: !name || name.trim() === '',
        language: language || 'en',
        status: 'active'
      }
    });
    
    console.log('Prayer request saved:', result.id);

    res.json({ 
      success: true, 
      id: result.id,
      type: 'prayer'
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save prayer request' 
    });
  }
});

// Get contact submissions
app.get('/api/contact', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit
    });
    res.json(submissions);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch contact submissions' });
  }
});

// Get prayer requests
app.get('/api/prayers', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const requests = await prisma.prayerRequest.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
    res.json(requests);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch prayer requests' });
  }
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    await prisma.$connect();
    
    // Count existing records
    const contactCount = await prisma.contactSubmission.count();
    const prayerCount = await prisma.prayerRequest.count();
    
    res.json({ 
      success: true, 
      message: 'Database connected successfully',
      counts: {
        contacts: contactCount,
        prayers: prayerCount
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Database connection failed',
      details: error.message
    });
  }
});

// === ADMIN MANAGEMENT ENDPOINTS ===

// Create registration token (for super admin only)
app.post('/api/admin/create-registration-token', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    
    // Generate unique token
    const token = crypto.randomUUID();
    
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
    
    // Create registration link
    const registrationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin-register?token=${token}`;
    
    console.log('Registration token created for:', email);
    
    res.json({ 
      success: true, 
      registrationLink,
      expiresAt: expiresAt.toISOString()
    });
    
  } catch (error) {
    console.error('Error creating registration token:', error);
    res.status(500).json({ success: false, message: 'Failed to create registration token' });
  }
});

// Verify registration token
app.get('/api/admin/verify-token', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is required' });
    }

    const registrationToken = await prisma.registrationToken.findUnique({
      where: { token }
    });

    if (!registrationToken) {
      return res.status(404).json({ success: false, message: 'Invalid token' });
    }

    if (registrationToken.isUsed) {
      return res.status(400).json({ success: false, message: 'Token already used' });
    }

    if (new Date() > registrationToken.expiresAt) {
      return res.status(400).json({ success: false, message: 'Token expired' });
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
    res.status(500).json({ success: false, message: 'Token verification failed' });
  }
});

// Register new admin user
app.post('/api/admin/register', async (req, res) => {
  try {
    const { token, name, email, password } = req.body;
    
    if (!token || !name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    // Verify token
    const registrationToken = await prisma.registrationToken.findUnique({
      where: { token }
    });
    
    if (!registrationToken || registrationToken.isUsed || new Date() > registrationToken.expiresAt) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }
    
    // Check if admin user already exists
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email }
    });
    
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Admin user already exists' });
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
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// Admin login authentication
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    
    // Find admin user
    const adminUser = await prisma.adminUser.findUnique({
      where: { email }
    });
    
    if (!adminUser || !adminUser.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, adminUser.passwordHash);
    
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
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
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Stripe payment routes
app.use('/api/stripe', stripeRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔧 Test database: http://localhost:${PORT}/api/test-db`);
});

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default app;
