// scripts/seedDatabase.js
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Task = require('../models/Task');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sevaconnect';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create test volunteers
    const volunteers = await User.insertMany([
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        password: 'password123',
        phone: '9876543210',
        role: 'volunteer',
        skills: ['teaching', 'coding', 'mentoring'],
        availability: 'weekends',
        bio: 'Passionate about education and technology',
        isActive: true
      },
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        password: 'password123',
        phone: '9123456789',
        role: 'volunteer',
        skills: ['healthcare', 'nursing', 'first-aid'],
        availability: 'flexible',
        bio: 'Healthcare professional wanting to give back',
        isActive: true
      },
      {
        name: 'Arun Patel',
        email: 'arun@example.com',
        password: 'password123',
        phone: '8765432109',
        role: 'volunteer',
        skills: ['environment', 'agriculture', 'recycling'],
        availability: 'weekdays',
        bio: 'Environmental activist',
        isActive: true
      }
    ]);
    console.log(`✅ Created ${volunteers.length} test volunteers`);

    // Create test NGOs
    const ngos = await User.insertMany([
      {
        name: 'NGO Admin 1',
        email: 'ngo1@example.com',
        password: 'password123',
        phone: '9000000001',
        role: 'ngo',
        organizationName: 'Education for All',
        organizationDescription: 'Providing quality education to underprivileged children',
        registrationNumber: 'NGO/2020/001',
        address: '123 Education Street',
        city: 'Delhi',
        state: 'Delhi',
        zipCode: '110001',
        website: 'www.educationforall.org',
        isApproved: true,
        isActive: true
      },
      {
        name: 'NGO Admin 2',
        email: 'ngo2@example.com',
        password: 'password123',
        phone: '9000000002',
        role: 'ngo',
        organizationName: 'Healthcare Heroes',
        organizationDescription: 'Providing free healthcare services to rural areas',
        registrationNumber: 'NGO/2021/002',
        address: '456 Health Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        website: 'www.healthcareheroes.org',
        isApproved: true,
        isActive: true
      },
      {
        name: 'NGO Admin 3',
        email: 'ngo3@example.com',
        password: 'password123',
        phone: '9000000003',
        role: 'ngo',
        organizationName: 'Green Earth',
        organizationDescription: 'Environmental conservation and sustainability',
        registrationNumber: 'NGO/2022/003',
        address: '789 Green Avenue',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560001',
        website: 'www.greenearth.org',
        isApproved: false,
        isActive: true
      }
    ]);
    console.log(`✅ Created ${ngos.length} test NGOs`);

    // Create test tasks
    const tasks = await Task.insertMany([
      {
        title: 'Teach Mathematics to School Children',
        description: 'We need volunteers to teach mathematics to underprivileged children aged 8-12. Sessions will be held every Saturday and Sunday.',
        category: 'education',
        location: {
          address: '123 Education Street',
          city: 'Delhi',
          state: 'Delhi',
          zipCode: '110001'
        },
        postedBy: ngos[0]._id,
        skillsRequired: ['teaching', 'mathematics', 'patience'],
        volunteerCount: 3,
        duration: 'weekly',
        startDate: new Date('2026-05-01'),
        endDate: new Date('2026-12-31'),
        status: 'open',
        priority: 'high',
        isUrgent: false
      },
      {
        title: 'Medical Camp Organization',
        description: 'Help organize and execute a free medical camp in rural areas. We need volunteers for registration, patient assistance, and basic healthcare support.',
        category: 'healthcare',
        location: {
          address: '456 Health Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001'
        },
        postedBy: ngos[1]._id,
        skillsRequired: ['healthcare', 'communication', 'patience'],
        volunteerCount: 5,
        duration: 'one-time',
        startDate: new Date('2026-04-28'),
        endDate: new Date('2026-04-28'),
        status: 'open',
        priority: 'urgent',
        isUrgent: true
      },
      {
        title: 'Beach Cleanup Drive',
        description: 'Join us for a beach cleanup drive to remove plastic waste and maintain marine ecosystem health. Suitable for all ages and fitness levels.',
        category: 'environment',
        location: {
          address: '789 Green Avenue',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560001'
        },
        postedBy: ngos[2]._id,
        skillsRequired: ['environmental-awareness', 'teamwork'],
        volunteerCount: 10,
        duration: 'one-time',
        startDate: new Date('2026-05-15'),
        endDate: new Date('2026-05-15'),
        status: 'open',
        priority: 'medium',
        isUrgent: false
      }
    ]);
    console.log(`✅ Created ${tasks.length} test tasks`);

    // Update NGO's postedTasks
    await User.updateOne({ _id: ngos[0]._id }, { postedTasks: [tasks[0]._id] });
    await User.updateOne({ _id: ngos[1]._id }, { postedTasks: [tasks[1]._id] });
    await User.updateOne({ _id: ngos[2]._id }, { postedTasks: [tasks[2]._id] });
    console.log('✅ Updated NGO task references');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Test Credentials:');
    console.log('─────────────────────────────────────');
    console.log('VOLUNTEERS:');
    console.log('  Email: rajesh@example.com | Password: password123');
    console.log('  Email: priya@example.com | Password: password123');
    console.log('  Email: arun@example.com | Password: password123');
    console.log('\nNGOs:');
    console.log('  Email: ngo1@example.com | Password: password123 (APPROVED)');
    console.log('  Email: ngo2@example.com | Password: password123 (APPROVED)');
    console.log('  Email: ngo3@example.com | Password: password123 (PENDING)');
    console.log('\nADMIN:');
    console.log('  Email: admin@sevaconnect.com | Password: admin123');
    console.log('─────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

// Run seeding
connectDB().then(() => {
  seedDatabase();
});
