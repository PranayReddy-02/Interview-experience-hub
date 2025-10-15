import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ExperienceService, Experience, FilterParams } from '../../services/experience';
import { ExperienceListComponent } from '../experience-list/experience-list';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterModule, ExperienceListComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  experiences: Experience[] = [];
  popularCompanies = [
    { name: 'Amazon', logo: 'A', color: '#FF9900' },
    { name: 'Google', logo: 'G', color: '#4285F4' },
    { name: 'Microsoft', logo: 'M', color: '#00A1F1' },
    { name: 'CRED', logo: 'C', color: '#0052CC' },
    { name: 'Flipkart', logo: 'F', color: '#047BD6' },
    { name: 'Zomato', logo: 'Z', color: '#E23744' },
    { name: 'Swiggy', logo: 'S', color: '#FC8019' },
    { name: 'PayTM', logo: 'P', color: '#00BAF2' }
  ];

  companyOptions = [
    'Amazon',
    'Google',
    'Microsoft',
    'Apple',
    'Meta',
    'Netflix',
    'Tesla',
    'Uber',
    'Airbnb',
    'Spotify',
    'CRED',
    'Flipkart',
    'Zomato',
    'Swiggy',
    'PayTM',
    'Razorpay',
    'Ola',
    'BookMyShow',
    'Byju\'s',
    'Unacademy',
    'PhonePe',
    'Paytm',
    'Zerodha',
    'Groww',
    'CAMS',
    'Jio',
    'Samsung',
    'IBM',
    'Accenture',
    'TCS',
    'Infosys',
    'Wipro',
    'HCL',
    'Tech Mahindra',
    'Mindtree',
    'Capgemini',
    'Others'
  ];

  locationOptions = [
    'Bangalore',
    'Mumbai',
    'Delhi',
    'Hyderabad',
    'Chennai',
    'Pune',
    'Kolkata',
    'Noida',
    'Gurgaon',
    'Ahmedabad',
    'Kochi',
    'Coimbatore',
    'Indore',
    'Jaipur',
    'Lucknow',
    'Nagpur',
    'Surat',
    'Vadodara',
    'Visakhapatnam',
    'Bhubaneswar',
    'Chandigarh',
    'Mysore',
    'Thiruvananthapuram',
    'Mangalore',
    // International locations
    'San Francisco',
    'Seattle',
    'New York',
    'London',
    'Toronto',
    'Vancouver',
    'Dublin',
    'Amsterdam',
    'Berlin',
    'Singapore',
    'Sydney',
    'Remote',
    'Others'
  ];

  popularRoles = [
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

  filters: FilterParams = {
    company: '',
    role: '',
    location: '',
    difficulty: '',
    sortBy: 'latest'
  };

  totalPages = 0;
  currentPage = 1;
  total = 0;
  loading = false;
  currentUser: User | null = null;
  showCustomCompany = false;
  customCompanyName = '';
  showCustomLocation = false;
  customLocationName = '';

  constructor(
    private experienceService: ExperienceService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadExperiences();
    // Subscribe to auth state changes
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  loadExperiences() {
    this.loading = true;
    this.experienceService.getExperiences({ ...this.filters, page: this.currentPage })
      .subscribe({
        next: (response) => {
          this.experiences = response.experiences;
          this.totalPages = response.totalPages;
          this.total = response.total;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading experiences:', error);
          this.loading = false;
        }
      });
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadExperiences();
  }

  onSortChange() {
    this.currentPage = 1;
    this.loadExperiences();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadExperiences();
  }

  clearFilters() {
    this.filters = {
      company: '',
      role: '',
      location: '',
      difficulty: '',
      sortBy: 'latest'
    };
    this.currentPage = 1;
    this.loadExperiences();
  }

  onCompanyClick(company: string) {
    // Allow company filtering without login - just filter the experiences
    this.filters.company = company;
    this.onFilterChange();
  }

  logout() {
    this.authService.logout();
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  onCompanySelectChange() {
    this.showCustomCompany = this.filters.company === 'Others';
    if (!this.showCustomCompany) {
      this.customCompanyName = '';
      this.onFilterChange();
    }
  }

  onCustomCompanyChange() {
    if (this.customCompanyName.trim()) {
      this.filters.company = this.customCompanyName.trim();
      this.onFilterChange();
    }
  }

  onLocationSelectChange() {
    this.showCustomLocation = this.filters.location === 'Others';
    if (!this.showCustomLocation) {
      this.customLocationName = '';
      this.onFilterChange();
    }
  }

  onCustomLocationChange() {
    if (this.customLocationName.trim()) {
      this.filters.location = this.customLocationName.trim();
      this.onFilterChange();
    }
  }

  getEffectiveCompanyName(): string {
    return this.showCustomCompany ? this.customCompanyName : (this.filters.company || '');
  }

  getEffectiveLocationName(): string {
    return this.showCustomLocation ? this.customLocationName : (this.filters.location || '');
  }
}
