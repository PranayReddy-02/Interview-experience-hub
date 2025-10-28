import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Experience, ExperienceService, Review } from '../../services/experience';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-experience-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './experience-detail.html',
  styleUrl: './experience-detail.scss'
})
export class ExperienceDetailComponent implements OnInit {
  @Input() experience: Experience | null = null;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.router.navigate(['/']);
  }

  reviews: Review[] = [];
  currentUser: User | null = null;
  showReviewForm = false;
  isEditing = false;
  editingReview: Review | null = null;
  newReview = {
    content: '',
    rating: 0
  };
  hoverRating: number = 0;
  submitError: string | null = null;

  toggleReviewForm() {
    this.showReviewForm = !this.showReviewForm;
    if (this.showReviewForm && !this.isEditing) {
      this.newReview = { content: '', rating: 0 };
    }
    if (this.showReviewForm) {
      setTimeout(() => {
        const reviewForm = document.getElementById('reviewContent');
        if (reviewForm) {
          reviewForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }

  constructor(
    private experienceService: ExperienceService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  getDifficultyBadgeClass(difficulty: string | undefined): string {
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

  getOfferBadgeClass(gotOffer: boolean | undefined): string {
    return gotOffer ? 'badge bg-success' : 'badge bg-secondary';
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  hasItems<T>(array: T[] | undefined | null): boolean {
    return Array.isArray(array) && array.length > 0;
  }

  private scrollToReviews() {
    setTimeout(() => {
      const reviewsSection = document.getElementById('reviewsSection');
      if (reviewsSection) {
        reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    
    // Get experience ID from route if not provided as input
    const experienceId = this.route.snapshot.paramMap.get('id');
    if (experienceId && !this.experience) {
      this.experienceService.getExperience(experienceId).subscribe({
        next: (experience) => {
          this.experience = experience;
          this.loadReviews();
          
          // Check if reviews section should be opened
          this.route.queryParams.subscribe(params => {
            if (params['openReviews'] === 'true') {
              this.scrollToReviews();
            }
          });
        },
        error: (error) => {
          console.error('Error loading experience:', error);
        }
      });
    } else {
      this.loadReviews();
      
      // Check if reviews section should be opened
      this.route.queryParams.subscribe(params => {
        if (params['openReviews'] === 'true') {
          this.scrollToReviews();
        }
      });
    }
  }

  loadReviews() {
    if (!this.experience?._id) return;
    
    this.experienceService.getReviews(this.experience._id).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
      }
    });
  }

  submitReview() {
    this.submitError = null;

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      this.submitError = 'Please log in to submit a review.';
      return;
    }

    if (!this.experience?._id || !this.newReview.rating || !this.newReview.content) return;

    // Ensure rating is a valid number between 1 and 5
    const rating = Math.max(1, Math.min(5, Math.floor(this.newReview.rating)));

    if (this.isEditing && this.editingReview && this.editingReview._id) {
      this.experienceService.updateReview(
        this.editingReview._id,
        this.newReview.content,
        rating
      ).subscribe({
        next: (updatedReview) => {
          const index = this.reviews.findIndex(r => r._id === this.editingReview!._id);
          if (index !== -1) {
            this.reviews[index] = updatedReview;
          }
          this.resetForm();
        },
        error: (error) => {
          console.error('Error updating review:', error);
          this.submitError = 'Failed to update review. Please try again.';
        }
      });
    } else {
      this.experienceService.addReview(
        this.experience._id,
        this.newReview.content,
        rating
      ).subscribe({
        next: (review) => {
          this.reviews.unshift(review);
          this.resetForm();
        },
        error: (error) => {
          console.error('Error submitting review:', error);
          this.submitError = `Failed to submit review. Token is present but authentication failed. Please try logging out and logging back in. Error: ${error.status || 'Unknown'}`;
        }
      });
    }
  }

  private resetForm() {
    this.newReview = { content: '', rating: 0 };
    this.hoverRating = 0;
    this.isEditing = false;
    this.editingReview = null;
    this.showReviewForm = false;
  }

  editReview(review: Review) {
    this.isEditing = true;
    this.editingReview = review;
    this.newReview = {
      content: review.content,
      rating: review.rating
    };
    if (!this.showReviewForm) {
      this.showReviewForm = true;
    }
  }

  deleteReview(reviewId: string) {
    if (!confirm('Are you sure you want to delete this review?')) return;

    this.experienceService.deleteReview(reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r._id !== reviewId);
      },
      error: (error) => {
        console.error('Error deleting review:', error);
      }
    });
  }

  adminDeleteReview(reviewId: string) {
    if (!confirm('Are you sure you want to permanently delete this review as admin?')) return;

    this.experienceService.adminDeleteReview(reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r._id !== reviewId);
      },
      error: (error) => {
        console.error('Error deleting review as admin:', error);
      }
    });
  }

  likeReview(review: Review) {
    if (!review._id) return;

    this.experienceService.likeReview(review._id).subscribe({
      next: (likes) => {
        const updatedReview = this.reviews.find(r => r._id === review._id);
        if (updatedReview) {
          updatedReview.likes = likes;
        }
      },
      error: (error) => {
        console.error('Error liking review:', error);
      }
    });
  }

  isReviewLikedByCurrentUser(review: Review): boolean {
    return !!this.currentUser?._id && review.likes.includes(this.currentUser._id);
  }

  isReviewOwner(review: Review): boolean {
    return !!this.currentUser?._id && this.currentUser._id === review.userId._id;
  }

  hasPreparationJourney(): boolean {
    if (!this.experience) return false;

    return !!(
      this.experience.preparationDuration ||
      this.experience.studyMaterials?.length ||
      this.experience.keyTopics?.length ||
      this.experience.practiceHours ||
      this.experience.mocksGiven ||
      this.experience.preparationTips ||
      this.experience.challenges ||
      this.experience.advice
    );
  }

  setRating(rating: number) {
    this.newReview.rating = rating;
    this.hoverRating = 0; // Reset hover when clicking
  }

  onStarHover(star: number) {
    if (!this.isEditing) { // Only allow hover on new reviews, not when editing
      this.hoverRating = star;
    }
  }

  onStarLeave() {
    this.hoverRating = 0;
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
