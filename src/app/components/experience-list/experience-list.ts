import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Experience, ExperienceService } from '../../services/experience';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-experience-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './experience-list.html',
  styleUrl: './experience-list.scss'
})
export class ExperienceListComponent {
  @Input() experiences: Experience[] = [];
  @Output() upvote = new EventEmitter<string>();
  @Output() experienceDeleted = new EventEmitter<string>();



  constructor(
    private experienceService: ExperienceService,
    private authService: AuthService,
    private router: Router
  ) {}

  onUpvote(experienceId: string | undefined) {
    if (!experienceId) return;
    
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

  getUpvoteCount(experience: Experience): number {
    return Array.isArray(experience.upvotes) ? experience.upvotes.length : 0;
  }

  navigateToExperience(experience: Experience) {
    if (!experience._id) return;

    this.router.navigate(['/experiences', experience._id]);
  }

  navigateToExperienceReviews(experienceId: string | undefined) {
    if (!experienceId) return;

    this.router.navigate(['/experience', experienceId]).then(() => {
      // Short delay to ensure navigation is complete
      setTimeout(() => {
        const reviewsSection = document.getElementById('reviewsSection');
        if (reviewsSection) {
          reviewsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
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



  addReview(experienceId: string) {
    // Prevent event bubbling
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/experiences/${experienceId}` }
      });
      return;
    }

    // Navigate to the experience detail page with review section opened
    this.router.navigate(['/experiences', experienceId], {
      queryParams: { openReviews: 'true' }
    });
  }

  isAdmin(): boolean {
    const isAdmin = this.authService.isAdmin();
    const currentUser = this.authService.getCurrentUser();
    console.log('Admin check:', {
      isAdmin,
      currentUser: currentUser ? {
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role
      } : null
    });
    return isAdmin;
  }

  deleteExperience(experience: Experience, event: Event) {
    event.stopPropagation(); // Prevent navigation to experience detail

    if (!experience._id) {
      console.error('Experience ID is undefined');
      return;
    }

    console.log('Attempting to delete experience:', experience._id);

    const confirmDelete = confirm(
      `Are you sure you want to permanently delete the experience for ${experience.company} - ${experience.role}?`
    );

    if (confirmDelete) {
      console.log('User confirmed deletion, calling API...');
      this.experienceService.adminDeleteExperience(experience._id!).subscribe({
        next: (response) => {
          console.log('Experience deleted successfully:', response);
          // Remove the experience from the local array
          this.experiences = this.experiences.filter(exp => exp._id !== experience._id);
          // Notify parent component
          this.experienceDeleted.emit(experience._id!);
          console.log('Experience removed from local array and parent notified');
        },
        error: (error) => {
          console.error('Error deleting experience:', error);
          console.error('Error details:', error.error, error.status, error.statusText);
          alert(`Error deleting experience: ${error.error?.message || error.message || 'Please try again.'}`);
        }
      });
    } else {
      console.log('User cancelled deletion');
    }
  }
}
