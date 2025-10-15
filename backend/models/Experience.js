const mongoose = require('mongoose');

const CodingQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  topic: { type: String },
  solved: { type: Boolean, default: false }
}, { _id: false });

const ExperienceSchema = new mongoose.Schema({
  // Step 1: Basic Information
  company: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  difficulty: { type: String, required: true, enum: ['Easy', 'Medium', 'Hard'] },
  gotOffer: { type: Boolean, required: true },
  interviewMode: { type: String, enum: ['Remote', 'Onsite'] },
  numberOfRounds: { type: Number, min: 1 },

  // Step 2: Interview Details (Personal)
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  linkedinProfile: { type: String, trim: true },
  degree: { type: String, required: true },
  branch: { type: String, required: true },
  college: { type: String, required: true, trim: true },
  cgpa: { type: Number, min: 0, max: 10 },
  experience: { type: String, required: true, enum: ['Fresher', '0-3 Years', '3+ Years'] },

  // Step 3: Technical Questions
  codingQuestions: [CodingQuestionSchema],
  numberOfCodingProblems: { type: Number, default: 0 },
  systemDesignTopics: { type: String, trim: true },
  coreSkillsTopics: { type: String, trim: true },
  projectDiscussion: { type: String, trim: true },

  // Step 4: Preparation Journey (New Fields)
  preparationDuration: { type: String, trim: true },
  studyMaterials: [{ type: String }],
  keyTopics: [{ type: String }],
  practiceHours: { type: Number, min: 0 },
  mocksGiven: { type: Number, min: 0 },
  preparationTips: { type: String, trim: true },
  challenges: { type: String, trim: true },
  advice: { type: String, trim: true },
  problemsSolved: { type: Number, min: 0 },
  confidenceLevel: { type: String, trim: true },
  preparationApproach: { type: String, trim: true },
  timeManagement: { type: String, trim: true },
  resourcesHelpful: { type: String, trim: true },
  wouldChangeApproach: { type: String, trim: true },

  // Metadata
  upvotes: { type: Number, default: 0 },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Experience', ExperienceSchema);