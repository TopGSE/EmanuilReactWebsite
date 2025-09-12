// Consolidated Admin API endpoints
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

// In-memory storage for registration tokens (in production, use a database)
let registrationTokens = new Map();

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname.replace('/api/admin', '');

    // Route to appropriate handler based on path
    if (path === '/login' && req.method === 'POST') {
      return await handleLogin(req, res);
    } else if (path === '/register' && req.method === 'POST') {
      return await handleRegister(req, res);
    } else if (path === '/create-registration-token' && req.method === 'POST') {
      return await handleCreateToken(req, res);
    } else if (path === '/verify-token' && req.method === 'GET') {
      return await handleVerifyToken(req, res);
    } else {
      return res.status(404).json({ success: false, message: 'Endpoint not found' });
    }
  } catch (error) {
    console.error('Admin API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function handleLogin(req, res) {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Check if admin exists in database
  const admin = await prisma.adminUser.findUnique({
    where: { email: email }
  });

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Check if admin is active
  if (!admin.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account is deactivated'
    });
  }

  // Verify password
  const passwordValid = await bcrypt.compare(password, admin.passwordHash);

  if (!passwordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  console.log('Admin login successful:', { email });

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: 'admin',
      createdAt: admin.createdAt
    }
  });
}

async function handleRegister(req, res) {
  const { name, email, password, token } = req.body;

  // Validate required fields
  if (!name || !email || !password || !token) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  // Validate email format
  if (!email.includes('@')) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  // Check if token exists
  const tokenData = registrationTokens.get(token);

  if (!tokenData) {
    return res.status(400).json({
      success: false,
      message: 'Invalid registration token'
    });
  }

  // Check if token has expired
  if (new Date() > tokenData.expiresAt) {
    registrationTokens.delete(token);
    return res.status(400).json({
      success: false,
      message: 'Registration token has expired'
    });
  }

  // Check if token has already been used
  if (tokenData.used) {
    return res.status(400).json({
      success: false,
      message: 'Registration token has already been used'
    });
  }

  // Check if email matches the token
  if (email !== tokenData.email) {
    return res.status(400).json({
      success: false,
      message: 'Email does not match the registration token'
    });
  }

  // Check if admin already exists
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: email }
  });

  if (existingAdmin) {
    return res.status(400).json({
      success: false,
      message: 'An admin with this email already exists'
    });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create admin in database
  const newAdmin = await prisma.adminUser.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
      isActive: true
    }
  });

  // Mark token as used
  tokenData.used = true;
  registrationTokens.set(token, tokenData);

  console.log('Admin registered successfully:', { email, name });

  return res.status(201).json({
    success: true,
    message: 'Admin account created successfully',
    admin: {
      id: newAdmin.id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: 'admin',
      createdAt: newAdmin.createdAt
    }
  });
}

async function handleCreateToken(req, res) {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  // Generate a unique token
  const token = randomUUID();

  // Store token with expiration (1 hour from now)
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  registrationTokens.set(token, {
    email: email,
    expiresAt: expiresAt,
    used: false
  });

  // Create registration link - build the proper URL
  let baseUrl;

  if (req.headers.origin) {
    baseUrl = req.headers.origin;
  } else if (req.headers.referer) {
    const url = new URL(req.headers.referer);
    baseUrl = `${url.protocol}//${url.host}`;
  } else if (req.headers.host) {
    const protocol = req.headers.host.includes('localhost') ? 'http' : 'https';
    baseUrl = `${protocol}://${req.headers.host}`;
  } else {
    baseUrl = 'http://localhost:5173';
  }

  const registrationLink = `${baseUrl}/admin-register?token=${token}`;

  console.log('Created registration token:', {
    token,
    email,
    expiresAt,
    baseUrl
  });

  return res.status(200).json({
    success: true,
    message: 'Registration token created successfully',
    registrationLink: registrationLink,
    expiresAt: expiresAt.toISOString()
  });
}

async function handleVerifyToken(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Token is required'
    });
  }

  // Check if token exists
  const tokenData = registrationTokens.get(token);

  if (!tokenData) {
    return res.status(400).json({
      success: false,
      message: 'Invalid registration token'
    });
  }

  // Check if token has expired
  if (new Date() > tokenData.expiresAt) {
    registrationTokens.delete(token);
    return res.status(400).json({
      success: false,
      message: 'Registration token has expired'
    });
  }

  // Check if token has already been used
  if (tokenData.used) {
    return res.status(400).json({
      success: false,
      message: 'Registration token has already been used'
    });
  }

  console.log('Token verified successfully:', { token, email: tokenData.email });

  return res.status(200).json({
    success: true,
    message: 'Token is valid',
    tokenInfo: {
      email: tokenData.email,
      expiresAt: tokenData.expiresAt.toISOString()
    }
  });
}