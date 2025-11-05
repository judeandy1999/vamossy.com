import { getMemory, setMemory, clearMemory } from '@/lib/memory';

export async function GET() {
  try {
    const testUserId = 'test-user-123';
    const testAgent = 'test-agent';
    
    console.log('🧪 Starting Redis functionality test...');
    
    // Test write
    await setMemory(testUserId, testAgent, 'user', 'Hello Redis!');
    console.log('✅ Redis WRITE successful');
    
    // Test read
    const memory = await getMemory(testUserId, testAgent);
    console.log('✅ Redis READ successful:', memory);
    
    // Test multiple writes
    await setMemory(testUserId, testAgent, 'assistant', 'Hello back from Redis!');
    const updatedMemory = await getMemory(testUserId, testAgent);
    console.log('✅ Redis MULTI-WRITE successful:', updatedMemory);
    
    // Test delete
    await clearMemory(testUserId, testAgent);
    const clearedMemory = await getMemory(testUserId, testAgent);
    console.log('✅ Redis DELETE successful, should be empty:', clearedMemory);
    
    return Response.json({
      success: true,
      message: 'Redis is working perfectly! 🚀',
      testResults: {
        initialWrite: 'SUCCESS',
        read: 'SUCCESS',
        multipleWrites: 'SUCCESS', 
        delete: 'SUCCESS',
        data: {
          afterFirstWrite: memory,
          afterSecondWrite: updatedMemory,
          afterDelete: clearedMemory
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Redis test failed:', error);
    return Response.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}