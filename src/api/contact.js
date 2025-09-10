// API endpoint for handling contact form submissions
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function submitContactForm(formData) {
  try {
    // Save to database
    const submission = await prisma.contactSubmission.create({
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
        language: formData.language || 'en',
        status: 'new'
      }
    });

    console.log('Contact form saved to database:', submission.id);
    return { success: true, id: submission.id };
    
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to save contact submission');
  }
}

export async function submitPrayerRequest(formData) {
  try {
    // Save prayer request to database
    const prayerRequest = await prisma.prayerRequest.create({
      data: {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        requestText: formData.message,
        isAnonymous: !formData.name || formData.name.trim() === '',
        language: formData.language || 'en',
        status: 'active'
      }
    });

    console.log('Prayer request saved to database:', prayerRequest.id);
    return { success: true, id: prayerRequest.id };
    
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to save prayer request');
  }
}

// Get all contact submissions (for admin use later)
export async function getContactSubmissions(limit = 50) {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit
    });
    return submissions;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch contact submissions');
  }
}

// Get all prayer requests (for admin use later)
export async function getPrayerRequests(limit = 50) {
  try {
    const requests = await prisma.prayerRequest.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
    return requests;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch prayer requests');
  }
}
