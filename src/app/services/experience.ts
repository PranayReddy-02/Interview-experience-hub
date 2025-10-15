import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CodingQuestion {
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic?: string;
  solved: boolean;
}

export interface Experience {
  _id?: string;
  company: string;
  role: string;
  customRole?: string;
  gotOffer: boolean;
  location: string;
  referrerEmail?: string;
  numberOfRounds: number;
  numberOfCodingProblems: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  interviewMode: 'Remote' | 'Onsite';
  name: string;
  email: string;
  phone: string;
  linkedinProfile?: string;
  degree: 'B.Tech' | 'BCA' | 'MCA' | 'M.Tech';
  college: string;
  branch: string;
  cgpa: number;
  experience: 'Fresher' | '0-3 Years' | '3+ Years';
  codingQuestions?: CodingQuestion[];
  upvotes?: number;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  // Preparation Journey
  preparationDuration?: string;
  studyMaterials?: string[];
  keyTopics?: string[];
  practiceHours?: number;
  mocksGiven?: number;
  preparationTips?: string;
  challenges?: string;
  advice?: string;
  // Enhanced preparation fields
  problemsSolved?: number;
  confidenceLevel?: string;
  preparationApproach?: string;
  // Technical Questions
  systemDesignTopics?: string;
  coreSkillsTopics?: string;
  projectDiscussion?: string;
  timeManagement?: string;
  resourcesHelpful?: string;
  wouldChangeApproach?: string;
}

export interface ExperienceResponse {
  experiences: Experience[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface FilterParams {
  company?: string;
  role?: string;
  location?: string;
  difficulty?: string;
  sortBy?: 'latest' | 'popular';
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private apiUrl = 'http://localhost:3000/api/experiences';

  constructor(private http: HttpClient) { }

  getExperiences(filters: FilterParams = {}): Observable<ExperienceResponse> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      const value = filters[key as keyof FilterParams];
      if (value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<ExperienceResponse>(this.apiUrl, { params });
  }

  getExperienceById(id: string): Observable<Experience> {
    return this.http.get<Experience>(`${this.apiUrl}/${id}`);
  }

  createExperience(experience: Experience): Observable<Experience> {
    return this.http.post<Experience>(this.apiUrl, experience);
  }

  upvoteExperience(id: string): Observable<{upvotes: number}> {
    return this.http.put<{upvotes: number}>(`${this.apiUrl}/${id}/upvote`, {});
  }

  getPopularCompanies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/companies/popular`);
  }
}
