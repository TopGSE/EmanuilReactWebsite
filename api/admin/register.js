// Import the shared registrationTokens map
import { registrationTokens } from './create-registration-token.js';
import bcrypt from 'bcrypt';

// In-memory storage for admins (in production, use a database)
let admins = new Map();

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
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
      // Remove expired token
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
    if (admins.has(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'An admin with this email already exists' 
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const adminId = `admin_${Date.now()}`;
    const newAdmin = {
      id: adminId,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      role: 'admin'
    };

    // Store admin
    admins.set(email, newAdmin);

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
        role: newAdmin.role,
        createdAt: newAdmin.createdAt
      }
    });

  } catch (error) {
    console.error('Error registering admin:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to create admin account' 
    });
  }
}

// Export the admins map for use in other endpoints
export { admins };
