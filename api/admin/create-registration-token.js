import { randomUUID } from 'crypto';

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

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
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
    
    // Check if we have origin in headers
    if (req.headers.origin) {
      baseUrl = req.headers.origin;
    } 
    // Check if we have referer header
    else if (req.headers.referer) {
      const url = new URL(req.headers.referer);
      baseUrl = `${url.protocol}//${url.host}`;
    }
    // Check for host header (for local development)
    else if (req.headers.host) {
      const protocol = req.headers.host.includes('localhost') ? 'http' : 'https';
      baseUrl = `${protocol}://${req.headers.host}`;
    }
    // Fallback to localhost for development
    else {
      baseUrl = 'http://localhost:5173';
    }
    
    const registrationLink = `${baseUrl}/admin-register?token=${token}`;

    console.log('Created registration token:', { 
      token, 
      email, 
      expiresAt, 
      baseUrl,
      headers: {
        origin: req.headers.origin,
        referer: req.headers.referer,
        host: req.headers.host
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Registration token created successfully',
      registrationLink: registrationLink,
      expiresAt: expiresAt.toISOString()
    });

  } catch (error) {
    console.error('Error creating registration token:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to create registration token' 
    });
  }
}

// Export the tokens map for use in other endpoints
export { registrationTokens };
