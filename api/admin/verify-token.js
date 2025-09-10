// Import the shared registrationTokens map
import { registrationTokens } from './create-registration-token.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
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

    console.log('Token verified successfully:', { token, email: tokenData.email });

    return res.status(200).json({
      success: true,
      message: 'Token is valid',
      tokenInfo: {
        email: tokenData.email,
        expiresAt: tokenData.expiresAt.toISOString()
      }
    });

  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to verify token' 
    });
  }
}
