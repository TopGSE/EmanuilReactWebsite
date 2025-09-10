// Simple test to verify database connection and functionality
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Test creating a contact submission
    const testSubmission = await prisma.contactSubmission.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Database Test',
        message: 'This is a test message to verify database functionality.',
        language: 'en',
        status: 'new'
      }
    });
    console.log('✅ Test contact submission created:', testSubmission.id);
    
    // Test creating a prayer request
    const testPrayer = await prisma.prayerRequest.create({
      data: {
        name: 'Prayer Test User',
        requestText: 'Please pray for successful database integration.',
        language: 'en',
        status: 'active',
        isAnonymous: false
      }
    });
    console.log('✅ Test prayer request created:', testPrayer.id);
    
    // Clean up test data
    await prisma.contactSubmission.delete({
      where: { id: testSubmission.id }
    });
    await prisma.prayerRequest.delete({
      where: { id: testPrayer.id }
    });
    console.log('✅ Test data cleaned up');
    
    console.log('🎉 All database tests passed!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testDatabase();
}

export default testDatabase;
