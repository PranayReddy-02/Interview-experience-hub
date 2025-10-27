const mongoose = require('mongoose');
const Experience = require('../models/Experience');
require('dotenv').config();

// Sample data for seeding
const sampleExperiences = [
  {
    company: 'Google',
    role: 'Software Engineer',
    gotOffer: true,
    location: 'Mountain View, CA',
    numberOfRounds: 5,
    numberOfCodingProblems: 3,
    difficulty: 'Hard',
    interviewMode: 'Remote',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '9876543210',
    degree: 'B.Tech',
    college: 'IIT Delhi',
    branch: 'Computer Science',
    cgpa: 9.2,
    experience: 'Fresher',
    userId: new mongoose.Types.ObjectId(),
    userEmail: 'john.doe@email.com',
    upvotes: 15,
    tags: ['Fresher'],
    codingQuestions: [
      {
        question: 'Given an array of integers, find two numbers such that they add up to a specific target number. Return indices of the two numbers.',
        difficulty: 'Easy',
        topic: 'Arrays',
        solved: true
      },
      {
        question: 'Design a data structure that supports insert, delete, getRandom operations in O(1) time complexity.',
        difficulty: 'Hard',
        topic: 'Hash Tables',
        solved: true
      },
      {
        question: 'Implement LRU (Least Recently Used) cache with get and put operations in O(1) time complexity.',
        difficulty: 'Medium',
        topic: 'Hash Tables',
        solved: false
      }
    ]
  },
  {
    company: 'Amazon',
    role: 'SDE-1',
    gotOffer: false,
    location: 'Seattle, WA',
    numberOfRounds: 4,
    numberOfCodingProblems: 2,
    difficulty: 'Medium',
    interviewMode: 'Onsite',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '9876543211',
    degree: 'B.Tech',
    college: 'DTU',
    branch: 'Computer Engineering',
    cgpa: 8.7,
    experience: '0-3 Years',
    userId: new mongoose.Types.ObjectId(),
    userEmail: 'jane.smith@email.com',
    upvotes: 8,
    tags: ['Experienced'],
    codingQuestions: [
      {
        question: 'Given a binary tree, return the zigzag level order traversal of its nodes\' values.',
        difficulty: 'Medium',
        topic: 'Trees',
        solved: true
      },
      {
        question: 'Design and implement a data structure for Least Frequently Used (LFU) cache.',
        difficulty: 'Hard',
        topic: 'Hash Tables',
        solved: false
      }
    ]
  },
  {
    company: 'Microsoft',
    role: 'Software Engineer Intern',
    gotOffer: true,
    location: 'Redmond, WA',
    numberOfRounds: 3,
    numberOfCodingProblems: 2,
    difficulty: 'Easy',
    interviewMode: 'Remote',
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '9876543212',
    degree: 'B.Tech',
    college: 'NSIT',
    branch: 'Information Technology',
    cgpa: 8.9,
    experience: 'Fresher',
    userId: new mongoose.Types.ObjectId(),
    userEmail: 'alex.johnson@email.com',
    upvotes: 12,
    tags: ['Fresher', 'Internship'],
    codingQuestions: [
      {
        question: 'Write a function to reverse a linked list iteratively and recursively.',
        difficulty: 'Easy',
        topic: 'Linked Lists',
        solved: true
      },
      {
        question: 'Given a string, find the length of the longest substring without repeating characters.',
        difficulty: 'Medium',
        topic: 'Sliding Window',
        solved: true
      }
    ]
  },
  {
    company: 'Meta',
    role: 'Software Engineer',
    gotOffer: true,
    location: 'Menlo Park, CA',
    numberOfRounds: 4,
    numberOfCodingProblems: 4,
    difficulty: 'Hard',
    interviewMode: 'Remote',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    phone: '9876543213',
    degree: 'M.Tech',
    college: 'IIT Bombay',
    branch: 'Computer Science',
    cgpa: 9.5,
    experience: '0-3 Years',
    userId: new mongoose.Types.ObjectId(),
    userEmail: 'sarah.wilson@email.com',
    upvotes: 20,
    tags: ['Experienced'],
    codingQuestions: [
      {
        question: 'Given a binary tree, find the maximum path sum. The path may start and end at any node in the tree.',
        difficulty: 'Hard',
        topic: 'Trees',
        solved: true
      },
      {
        question: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
        difficulty: 'Medium',
        topic: 'Hash Tables',
        solved: true
      },
      {
        question: 'Given an array of intervals, merge all overlapping intervals.',
        difficulty: 'Medium',
        topic: 'Arrays',
        solved: false
      },
      {
        question: 'Implement a trie (prefix tree) and use it to solve word search problems.',
        difficulty: 'Hard',
        topic: 'Trees',
        solved: true
      }
    ]
  },
  {
    company: 'Netflix',
    role: 'Senior Software Engineer',
    gotOffer: false,
    location: 'Los Gatos, CA',
    numberOfRounds: 5,
    numberOfCodingProblems: 3,
    difficulty: 'Hard',
    interviewMode: 'Onsite',
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    phone: '9876543214',
    degree: 'B.Tech',
    college: 'BITS Pilani',
    branch: 'Computer Science',
    cgpa: 8.8,
    experience: '3+ Years',
    userId: new mongoose.Types.ObjectId(),
    userEmail: 'mike.chen@email.com',
    upvotes: 5,
    tags: ['Senior'],
    codingQuestions: [
      {
        question: 'Design a distributed cache system that can handle millions of requests per second.',
        difficulty: 'Hard',
        topic: 'System Design',
        solved: false
      },
      {
        question: 'Find the median of two sorted arrays of different sizes in O(log(min(m,n))) time.',
        difficulty: 'Hard',
        topic: 'Binary Search',
        solved: true
      },
      {
        question: 'Implement a rate limiter using sliding window algorithm.',
        difficulty: 'Medium',
        topic: 'Sliding Window',
        solved: false
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Experience.deleteMany({});
    console.log('🧹 Cleared existing experiences');

    // Insert sample data
    const experiences = await Experience.insertMany(sampleExperiences);
    console.log(`🌱 Seeded ${experiences.length} experiences successfully`);

    // Display summary
    console.log('\\n📊 Seeding Summary:');
    console.log(`   • Total experiences: ${experiences.length}`);

    const companies = [...new Set(experiences.map(exp => exp.company))];
    console.log(`   • Companies: ${companies.join(', ')}`);

    const offerCount = experiences.filter(exp => exp.gotOffer).length;
    console.log(`   • Success rate: ${((offerCount / experiences.length) * 100).toFixed(1)}%`);

    // Close connection
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleExperiences };
