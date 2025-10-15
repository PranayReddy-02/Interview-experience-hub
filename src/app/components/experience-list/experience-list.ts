import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Experience, ExperienceService } from '../../services/experience';
import { ExperienceDetailComponent } from '../experience-detail/experience-detail';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-experience-list',
  imports: [CommonModule, ExperienceDetailComponent],
  templateUrl: './experience-list.html',
  styleUrl: './experience-list.scss'
})
export class ExperienceListComponent {
  @Input() experiences: Experience[] = [];
  @Output() upvote = new EventEmitter<string>();

  selectedExperience: Experience | null = null;
  showDetailModal = false;

  constructor(
    private experienceService: ExperienceService,
    private authService: AuthService,
    private router: Router
  ) {}

  onUpvote(experienceId: string) {
    this.experienceService.upvoteExperience(experienceId).subscribe({
      next: (response) => {
        const experience = this.experiences.find(exp => exp._id === experienceId);
        if (experience) {
          experience.upvotes = response.upvotes;
        }
        this.upvote.emit(experienceId);
      },
      error: (error) => {
        console.error('Error upvoting experience:', error);
      }
    });
  }

  getDifficultyBadgeClass(difficulty: string): string {
    switch (difficulty) {
      case 'Easy':
        return 'badge bg-success';
      case 'Medium':
        return 'badge bg-warning';
      case 'Hard':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  getOfferBadgeClass(gotOffer: boolean): string {
    return gotOffer ? 'badge bg-success' : 'badge bg-secondary';
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  showExperienceDetail(experience: Experience) {
    // Check if user is logged in before showing experience details
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: window.location.pathname + window.location.search }
      });
      return;
    }

    this.selectedExperience = experience;
    this.showDetailModal = true;
  }

  hideExperienceDetail() {
    this.selectedExperience = null;
    this.showDetailModal = false;
  }
}
