import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Experience, ExperienceService, CodingQuestion } from '../../services/experience';

@Component({
  selector: 'app-submit-experience',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './submit-experience.html',
  styleUrl: './submit-experience.scss'
})
export class SubmitExperienceComponent {
  currentStep = 1;
  totalSteps = 4;
  isSubmitting = false;

  experienceData: Experience = {
    company: '',
    role: '',
    customRole: '',
    gotOffer: false,
    location: '',
    referrerEmail: '',
    numberOfRounds: 1,
    numberOfCodingProblems: 0,
    difficulty: 'Medium',
    interviewMode: 'Remote',
    name: '',
    email: '',
    phone: '',
    linkedinProfile: '',
    degree: 'B.Tech',
    college: '',
    branch: '',
    cgpa: 0,
    experience: 'Fresher',
    codingQuestions: [],
    // Preparation Journey
    preparationDuration: '',
    studyMaterials: [],
    keyTopics: [],
    practiceHours: 0,
    mocksGiven: 0,
    preparationTips: '',
    challenges: '',
    advice: '',
    // Enhanced preparation fields
    problemsSolved: 0,
    confidenceLevel: '',
    preparationApproach: '',
    timeManagement: '',
    resourcesHelpful: '',
    wouldChangeApproach: ''
  };

  degreeOptions = ['B.Tech', 'BCA', 'MCA', 'M.Tech'];
  difficultyOptions = ['Easy', 'Medium', 'Hard'];
  interviewModeOptions = ['Remote', 'Onsite'];
  experienceOptions = ['Fresher', '0-3 Years', '3+ Years'];

  roleOptions = [
    'Software Engineer',
    'Software Developer',
    'SDE-1',
    'SDE-2',
    'SDE-3',
    'Senior Software Engineer',
    'Principal Software Engineer',
    'Staff Software Engineer',
    'Software Engineer Intern',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'React Developer',
    'Angular Developer',
    'Node.js Developer',
    'Python Developer',
    'Java Developer',
    'C++ Developer',
    'JavaScript Developer',
    'TypeScript Developer',
    'DevOps Engineer',
    'Site Reliability Engineer',
    'Platform Engineer',
    'Cloud Engineer',
    'Data Engineer',
    'Data Scientist',
    'Machine Learning Engineer',
    'AI Engineer',
    'Product Manager',
    'Technical Product Manager',
    'Engineering Manager',
    'Tech Lead',
    'Team Lead',
    'QA Engineer',
    'Test Engineer',
    'Automation Engineer',
    'Mobile Developer',
    'iOS Developer',
    'Android Developer',
    'React Native Developer',
    'Flutter Developer',
    'UI/UX Developer',
    'Frontend Engineer',
    'Backend Engineer',
    'Database Administrator',
    'System Administrator',
    'Network Engineer',
    'Security Engineer',
    'Cybersecurity Analyst',
    'Business Analyst',
    'Technical Writer',
    'Solution Architect',
    'Technical Architect',
    'Software Architect',
    'Others'
  ];

  showCustomRole = false;

  branchOptions = [
    'Computer Engineering',
    'Computer Science',
    'Information Technology',
    'Electronics and Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Biotechnology',
    'Aerospace Engineering'
  ];

  topicOptions = [
    'Arrays',
    'Strings',
    'Linked Lists',
    'Trees',
    'Graphs',
    'Dynamic Programming',
    'Recursion',
    'Sorting',
    'Searching',
    'Hash Tables',
    'Stacks',
    'Queues',
    'Heaps',
    'Greedy Algorithms',
    'Backtracking',
    'Two Pointers',
    'Sliding Window',
    'Binary Search',
    'DFS/BFS',
    'System Design',
    'Database',
    'SQL',
    'Others'
  ];

  preparationDurationOptions = [
    '1-2 weeks',
    '1 month',
    '2-3 months',
    '3-6 months',
    '6+ months',
    '1+ year'
  ];

  studyMaterialOptions = [
    'LeetCode',
    'GeeksforGeeks',
    'HackerRank',
    'CodeChef',
    'Codeforces',
    'InterviewBit',
    'Pramp',
    'Cracking the Coding Interview',
    'System Design Primer',
    'Elements of Programming Interviews',
    'YouTube Videos',
    'Online Courses (Coursera, Udemy)',
    'Company Blogs',
    'Mock Interviews',
    'Coding Bootcamp',
    'University Resources',
    'Books',
    'Glassdoor',
    'Blind (TeamBlind)',
    'Others'
  ];

  confidenceLevelOptions = [
    'Very Confident',
    'Confident',
    'Moderately Confident',
    'Somewhat Confident',
    'Not Confident'
  ];

  preparationApproachOptions = [
    'Self-study only',
    'Study group/partner',
    'Online courses + practice',
    'Coaching/Mentoring',
    'Mixed approach'
  ];

  constructor(
    private experienceService: ExperienceService,
    private router: Router
  ) {}

  nextStep() {
    if (this.validateCurrentStep()) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  validateCurrentStep(): boolean {
    // Helper function to check for required string fields
    const isRequired = (value: string | undefined) => !!value && value.trim().length > 0;

    if (this.currentStep === 1) {
      const roleValid = this.experienceData.role &&
        (this.experienceData.role !== 'Others' ||
         (this.experienceData.role === 'Others' && this.experienceData.customRole && this.experienceData.customRole.trim()));

      return !!(
        isRequired(this.experienceData.company) &&
        roleValid &&
        isRequired(this.experienceData.location) &&
        this.experienceData.difficulty &&
        typeof this.experienceData.gotOffer === 'boolean' &&
        this.experienceData.interviewMode
      );
    } else if (this.currentStep === 2) {
      return !!(
        this.experienceData.name &&
        this.isEmailValid() &&
        this.isPhoneValid() &&
        isRequired(this.experienceData.degree) &&
        isRequired(this.experienceData.branch) &&
        isRequired(this.experienceData.college)
      );
    } else if (this.currentStep === 3) {
      // Number of rounds is required, but coding questions are optional.
      return this.experienceData.numberOfRounds >= 1;
    } else if (this.currentStep === 4) {
      return true; // Preparation journey is optional
    }
    return false;
  }

  submitExperience() {
    if (!this.validateCurrentStep()) {
      return;
    }

    // Validate all required fields before submission
    const isStep1Valid = this.validateCurrentStepWith(1);
    const isStep2Valid = this.validateCurrentStepWith(2);

    if (!isStep1Valid) {
      alert('Please fill all required fields in Step 1 (Interview Role Details).');
      this.currentStep = 1;
      return;
    }
    if (!isStep2Valid) {
      alert('Please fill all required fields in Step 2 (Personal Details).');
      this.currentStep = 2;
      return;
    }

    this.isSubmitting = true;

    // Prepare the data for submission
    const {
      // Exclude fields not in the backend model
      customRole,
      ...submissionData
    } = this.experienceData;

    // If "Others" was selected and custom role is provided, use the custom role
    if (this.experienceData.role === 'Others' && this.experienceData.customRole) {
      submissionData.role = this.experienceData.customRole;
    }

    // Ensure numberOfCodingProblems matches the actual number of coding questions
    submissionData.numberOfCodingProblems = submissionData.codingQuestions?.length || 0;

    this.experienceService.createExperience(submissionData).subscribe({
      next: (response) => {
        console.log('Experience submitted successfully:', response);
        this.isSubmitting = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error submitting experience:', error);
        this.isSubmitting = false;
        alert('Error submitting experience. Please try again.');
      }
    });
  }

  getStepTitle(): string {
    switch (this.currentStep) {
      case 1:
        return 'Interview Role Details';
      case 2:
        return 'Personal Details';
      case 3:
        return 'Reference Questions';
      case 4:
        return 'Share Your Interview Preparation Journey';
      default:
        return '';
    }
  }

  // Helper to run validation for a specific step
  private validateCurrentStepWith(step: number): boolean {
    const originalStep = this.currentStep;
    this.currentStep = step;
    const isValid = this.validateCurrentStep();
    this.currentStep = originalStep;
    return isValid;
  }

  isEmailValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.experienceData.email);
  }

  isPhoneValid(): boolean {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(this.experienceData.phone);
  }

  onRoleChange() {
    this.showCustomRole = this.experienceData.role === 'Others';
    if (!this.showCustomRole) {
      // Clear custom role when a predefined role is selected
      if (this.experienceData.customRole) {
        this.experienceData.customRole = '';
      }
    }
  }

  addCodingQuestion() {
    if (!this.experienceData.codingQuestions) {
      this.experienceData.codingQuestions = [];
    }
    this.experienceData.codingQuestions.push({
      question: '',
      difficulty: 'Medium',
      topic: '',
      solved: false
    });
  }

  removeCodingQuestion(index: number) {
    if (this.experienceData.codingQuestions) {
      this.experienceData.codingQuestions.splice(index, 1);
    }
  }

  updateCodingQuestions() {
    // Update the numberOfCodingProblems based on the actual questions added
    if (this.experienceData.codingQuestions) {
      this.experienceData.numberOfCodingProblems = this.experienceData.codingQuestions.length;
    }
  }

  // Preparation Journey Helper Methods
  toggleStudyMaterial(material: string) {
    if (!this.experienceData.studyMaterials) {
      this.experienceData.studyMaterials = [];
    }
    const index = this.experienceData.studyMaterials.indexOf(material);
    if (index > -1) {
      this.experienceData.studyMaterials.splice(index, 1);
    } else {
      this.experienceData.studyMaterials.push(material);
    }
  }

  isStudyMaterialSelected(material: string): boolean {
    return this.experienceData.studyMaterials?.includes(material) || false;
  }

  toggleKeyTopic(topic: string) {
    if (!this.experienceData.keyTopics) {
      this.experienceData.keyTopics = [];
    }
    const index = this.experienceData.keyTopics.indexOf(topic);
    if (index > -1) {
      this.experienceData.keyTopics.splice(index, 1);
    } else {
      this.experienceData.keyTopics.push(topic);
    }
  }

  isKeyTopicSelected(topic: string): boolean {
    return this.experienceData.keyTopics?.includes(topic) || false;
  }
}
