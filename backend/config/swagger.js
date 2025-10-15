const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Interview Experience Hub API',
      version: '1.0.0',
      description: 'A comprehensive API for managing and sharing interview experiences',
      contact: {
        name: 'API Support',
        email: 'support@interviewhub.com'
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.interviewhub.com',
        description: 'Production server',
      },
    ],
    components: {
      schemas: {
        Experience: {
          type: 'object',
          required: [
            'company', 'role', 'gotOffer', 'location', 'numberOfRounds',
            'numberOfCodingProblems', 'difficulty', 'interviewMode',
            'name', 'email', 'phone', 'degree', 'college', 'branch', 'cgpa', 'experience'
          ],
          properties: {
            _id: {
              type: 'string',
              description: 'Unique identifier for the experience',
              example: '64f2b1234567890abcdef123'
            },
            company: {
              type: 'string',
              description: 'Company name',
              example: 'Google'
            },
            role: {
              type: 'string',
              description: 'Job role',
              example: 'Software Engineer'
            },
            gotOffer: {
              type: 'boolean',
              description: 'Whether candidate received an offer',
              example: true
            },
            location: {
              type: 'string',
              description: 'Job location',
              example: 'Mountain View, CA'
            },
            referrerEmail: {
              type: 'string',
              description: 'Email of the person who referred',
              example: 'referrer@google.com'
            },
            numberOfRounds: {
              type: 'number',
              minimum: 1,
              description: 'Number of interview rounds',
              example: 5
            },
            numberOfCodingProblems: {
              type: 'number',
              minimum: 0,
              description: 'Number of coding problems asked',
              example: 3
            },
            difficulty: {
              type: 'string',
              enum: ['Easy', 'Medium', 'Hard'],
              description: 'Overall interview difficulty',
              example: 'Hard'
            },
            interviewMode: {
              type: 'string',
              enum: ['Remote', 'Onsite'],
              description: 'Interview mode',
              example: 'Remote'
            },
            name: {
              type: 'string',
              description: 'Candidate name',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Candidate email',
              example: 'john.doe@email.com'
            },
            phone: {
              type: 'string',
              description: 'Candidate phone number',
              example: '9876543210'
            },
            linkedinProfile: {
              type: 'string',
              description: 'LinkedIn profile URL',
              example: 'https://linkedin.com/in/johndoe'
            },
            degree: {
              type: 'string',
              enum: ['B.Tech', 'BCA', 'MCA', 'M.Tech'],
              description: 'Educational degree',
              example: 'B.Tech'
            },
            college: {
              type: 'string',
              description: 'College name',
              example: 'IIT Delhi'
            },
            branch: {
              type: 'string',
              description: 'Branch of study',
              example: 'Computer Science'
            },
            cgpa: {
              type: 'number',
              minimum: 0,
              maximum: 10,
              description: 'CGPA score',
              example: 9.2
            },
            experience: {
              type: 'string',
              enum: ['Fresher', '0-3 Years', '3+ Years'],
              description: 'Experience level',
              example: 'Fresher'
            },
            upvotes: {
              type: 'number',
              minimum: 0,
              description: 'Number of upvotes',
              example: 15
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Experience tags',
              example: ['Fresher', 'Remote']
            },
            codingQuestions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  question: {
                    type: 'string',
                    description: 'Coding question asked'
                  },
                  difficulty: {
                    type: 'string',
                    enum: ['Easy', 'Medium', 'Hard']
                  },
                  topic: {
                    type: 'string',
                    description: 'Topic of the question'
                  },
                  solved: {
                    type: 'boolean',
                    description: 'Whether the question was solved'
                  }
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        ExperienceInput: {
          type: 'object',
          required: [
            'company', 'role', 'gotOffer', 'location', 'numberOfRounds',
            'numberOfCodingProblems', 'difficulty', 'interviewMode',
            'name', 'email', 'phone', 'degree', 'college', 'branch', 'cgpa', 'experience'
          ],
          properties: {
            company: { type: 'string', example: 'Google' },
            role: { type: 'string', example: 'Software Engineer' },
            gotOffer: { type: 'boolean', example: true },
            location: { type: 'string', example: 'Mountain View, CA' },
            referrerEmail: { type: 'string', example: 'referrer@google.com' },
            numberOfRounds: { type: 'number', minimum: 1, example: 5 },
            numberOfCodingProblems: { type: 'number', minimum: 0, example: 3 },
            difficulty: { type: 'string', enum: ['Easy', 'Medium', 'Hard'], example: 'Hard' },
            interviewMode: { type: 'string', enum: ['Remote', 'Onsite'], example: 'Remote' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john.doe@email.com' },
            phone: { type: 'string', example: '9876543210' },
            linkedinProfile: { type: 'string', example: 'https://linkedin.com/in/johndoe' },
            degree: { type: 'string', enum: ['B.Tech', 'BCA', 'MCA', 'M.Tech'], example: 'B.Tech' },
            college: { type: 'string', example: 'IIT Delhi' },
            branch: { type: 'string', example: 'Computer Science' },
            cgpa: { type: 'number', minimum: 0, maximum: 10, example: 9.2 },
            experience: { type: 'string', enum: ['Fresher', '0-3 Years', '3+ Years'], example: 'Fresher' },
            codingQuestions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  question: { type: 'string' },
                  difficulty: { type: 'string', enum: ['Easy', 'Medium', 'Hard'] },
                  topic: { type: 'string' },
                  solved: { type: 'boolean' }
                }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            },
            status: {
              type: 'number',
              description: 'HTTP status code'
            }
          }
        },
        PaginatedExperiences: {
          type: 'object',
          properties: {
            experiences: {
              type: 'array',
              items: { $ref: '#/components/schemas/Experience' }
            },
            totalPages: {
              type: 'number',
              description: 'Total number of pages'
            },
            currentPage: {
              type: 'number',
              description: 'Current page number'
            },
            total: {
              type: 'number',
              description: 'Total number of experiences'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './server.js'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

module.exports = specs;