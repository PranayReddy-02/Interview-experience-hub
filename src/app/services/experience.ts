import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CodingQuestion {
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic?: string;
  solved: boolean;
}

export interface Review {
  _id?: string;
  experienceId: string;
  userId: {
    _id: string;
    name: string;
  };
  content: string;
  rating: number;
  likes: string[];
  createdAt: Date;
  updatedAt: Date;
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
  // Review functionality
  reviews?: Review[];
  helpfulReviews?: number;
  reviewCount?: number;
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

  getExperience(id: string): Observable<Experience> {
    return this.http.get<Experience>(`${this.apiUrl}/${id}`);
  }

  private getAuthHeaders(): { [key: string]: string } {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

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
    return this.http.post<Experience>(this.apiUrl, experience, {
      headers: this.getAuthHeaders()
    });
  }

  updateExperience(id: string, experience: Partial<Experience>): Observable<Experience> {
    return this.http.put<Experience>(`${this.apiUrl}/${id}`, experience, {
      headers: this.getAuthHeaders()
    });
  }

  deleteExperience(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  adminDeleteExperience(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}/admin-delete`, {
      headers: this.getAuthHeaders()
    });
  }

  adminEditExperience(id: string, experience: Partial<Experience>): Observable<Experience> {
    return this.http.put<Experience>(`${this.apiUrl}/${id}/admin-edit`, experience, {
      headers: this.getAuthHeaders()
    });
  }

  upvoteExperience(id: string): Observable<{upvotes: number}> {
    return this.http.put<{upvotes: number}>(`${this.apiUrl}/${id}/upvote`, {});
  }

  getPopularCompanies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/companies/popular`);
  }

  // Review Methods
  getReviews(experienceId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`http://localhost:3000/api/reviews/${experienceId}`);
  }

  addReview(experienceId: string, content: string, rating: number): Observable<Review> {
    return this.http.post<Review>(
      `http://localhost:3000/api/reviews/${experienceId}`,
      { content, rating: Number(rating) },
      { headers: this.getAuthHeaders() }
    );
  }

  updateReview(reviewId: string, content: string, rating: number): Observable<Review> {
    return this.http.put<Review>(
      `http://localhost:3000/api/reviews/${reviewId}`,
      { content, rating: Number(rating) },
      { headers: this.getAuthHeaders() }
    );
  }

  deleteReview(reviewId: string): Observable<{ msg: string }> {
    return this.http.delete<{ msg: string }>(
      `http://localhost:3000/api/reviews/${reviewId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  adminDeleteReview(reviewId: string): Observable<{ msg: string }> {
    return this.http.delete<{ msg: string }>(
      `http://localhost:3000/api/reviews/${reviewId}/admin-delete`,
      { headers: this.getAuthHeaders() }
    );
  }

  likeReview(reviewId: string): Observable<string[]> {
    return this.http.post<string[]>(
      `http://localhost:3000/api/reviews/${reviewId}/like`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }
}
