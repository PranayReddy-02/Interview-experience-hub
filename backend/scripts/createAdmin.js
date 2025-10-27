const mongoose = require('mongoose');
const User = require('../models/User');

const createAdminUser = async () => {
  try {
    // Connect to MongoDB directly
    await mongoose.connect('mongodb://localhost:27017/interview-experience-hub');
    console.log('✅ Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@company.com' });
    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists');
      if (existingAdmin.role !== 'admin') {
        // Update existing user to admin role
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Updated existing user to admin role');
      } else {
        console.log('✅ Admin user already has admin role');
      }
    } else {
      // Create new admin user
      const adminUser = new User({
        name: 'System Administrator',
        email: 'admin@company.com',
        password: 'admin123', // In production, this should be hashed
        role: 'admin',
        phone: '9999999999',
        degree: 'B.Tech',
        branch: 'Computer Science',
        college: 'System Admin University',
        experience: '3+ Years',
        isActive: true
      });

      await adminUser.save();
      console.log('✅ Created new admin user successfully');
    }

    // Verify admin user
    const admin = await User.findOne({ email: 'admin@company.com' });
    console.log('\\n📋 Admin User Details:');
    console.log(`   • Name: ${admin.name}`);
    console.log(`   • Email: ${admin.email}`);
    console.log(`   • Role: ${admin.role}`);
    console.log(`   • Active: ${admin.isActive}`);
    console.log(`   • Created: ${admin.createdAt}`);

    // Close connection
    await mongoose.connection.close();
    console.log('\\n🔒 Database connection closed');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

// Run the script
if (require.main === module) {
  createAdminUser();
}

module.exports = { createAdminUser };
