import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { ExperienceService, Experience } from '../../services/experience';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: 'dashboard.component.html',
  styleUrl: 'dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  userExperiences: Experience[] = [];
  allExperiences: Experience[] = [];
  isLoading = true;
  adminLoading = true;
  errorMessage = '';
  successMessage = '';

  // Edit experience modal
  showEditModal = false;
  showAdminEditModal = false;
  editingExperience: Experience | null = null;
  adminEditingExperience: Experience | null = null;

  constructor(
    private authService: AuthService,
    private experienceService: ExperienceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadUserExperiences();
    if (this.isAdmin()) {
      this.loadAllExperiences();
    }
  }

  loadUserData(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log('Dashboard - Current user:', this.currentUser);
    if (!this.currentUser) {
      console.log('Dashboard - No user found, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }
  }

  loadUserExperiences(): void {
    this.isLoading = true;
    this.authService.getUserExperiences().subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.userExperiences = response.experiences || [];
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error loading experiences:', error);
        this.errorMessage = 'Failed to load experiences';
      }
    });
  }

  // Edit experience functionality
  openEditModal(experience: Experience): void {
    this.editingExperience = { ...experience };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingExperience = null;
  }

  saveExperience(): void {
    if (!this.editingExperience || !this.editingExperience._id) return;

    // Only send the fields that are editable in the modal
    const updatedFields: Partial<Experience> = {
      company: this.editingExperience.company,
      role: this.editingExperience.role,
      location: this.editingExperience.location,
      difficulty: this.editingExperience.difficulty,
      experience: this.editingExperience.experience,
      gotOffer: this.editingExperience.gotOffer
    };

    this.experienceService.updateExperience(this.editingExperience._id, updatedFields).subscribe({
      next: (response) => {
        this.successMessage = 'Experience updated successfully!';
        this.loadUserExperiences(); // Reload the list
        this.closeEditModal();

        // Notify home page to refresh
        this.refreshHomePageExperiences();

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error updating experience:', error);
        this.errorMessage = 'Failed to update experience';
      }
    });
  }

  deleteExperience(experienceId: string): void {
    if (confirm('Are you sure you want to delete this experience?')) {
      this.experienceService.deleteExperience(experienceId).subscribe({
        next: (response) => {
          this.successMessage = 'Experience deleted successfully!';
          this.loadUserExperiences(); // Reload the list

          // Notify home page to refresh
          this.refreshHomePageExperiences();

          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          console.error('Error deleting experience:', error);
          this.errorMessage = 'Failed to delete experience';
        }
      });
    }
  }

  formatDate(dateValue: string | Date | undefined): string {
    if (!dateValue) return 'N/A';

    try {
      const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  }

  getDifficultyBadgeClass(difficulty: string): string {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'badge bg-success';
      case 'medium': return 'badge bg-warning text-dark';
      case 'hard': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  getOfferStatusText(gotOffer: boolean): string {
    return gotOffer ? 'Got Offer' : 'No Offer';
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  loadAllExperiences(): void {
    this.adminLoading = true;
    this.experienceService.getExperiences().subscribe({
      next: (response: any) => {
        this.adminLoading = false;
        this.allExperiences = response.experiences || [];
        console.log('Admin loaded all experiences:', this.allExperiences.length);
      },
      error: (error: any) => {
        this.adminLoading = false;
        console.error('Error loading all experiences:', error);
        this.errorMessage = 'Failed to load all experiences';
      }
    });
  }

  // Admin edit experience functionality
  openAdminEditModal(experience: Experience): void {
    this.adminEditingExperience = { ...experience };
    this.showAdminEditModal = true;
  }

  closeAdminEditModal(): void {
    this.showAdminEditModal = false;
    this.adminEditingExperience = null;
  }

  saveAdminExperience(): void {
    if (!this.adminEditingExperience || !this.adminEditingExperience._id) return;

    // Only send the fields that are editable in the admin modal
    const updatedFields: Partial<Experience> = {
      company: this.adminEditingExperience.company,
      role: this.adminEditingExperience.role,
      location: this.adminEditingExperience.location,
      difficulty: this.adminEditingExperience.difficulty,
      experience: this.adminEditingExperience.experience,
      gotOffer: this.adminEditingExperience.gotOffer,
      upvotes: this.adminEditingExperience.upvotes
    };

    console.log('Admin saving experience:', updatedFields);
    this.experienceService.adminEditExperience(this.adminEditingExperience._id, updatedFields).subscribe({
      next: (response) => {
        console.log('Admin edit response:', response);
        this.successMessage = 'Experience updated successfully by admin!';
        this.loadAllExperiences(); // Reload the admin list
        this.closeAdminEditModal();

        // Also refresh the home page experiences if it's loaded
        this.refreshHomePageExperiences();

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error updating experience as admin:', error);
        this.errorMessage = `Failed to update experience as admin: ${error.error?.message || error.message || 'Unknown error'}`;
      }
    });
  }

  adminDeleteExperience(experienceId: string): void {
    const experience = this.allExperiences.find(exp => exp._id === experienceId);
    const experienceName = experience ? `${experience.company} - ${experience.role}` : 'this experience';

    if (confirm(`Are you sure you want to permanently delete ${experienceName}?`)) {
      this.experienceService.adminDeleteExperience(experienceId).subscribe({
        next: (response) => {
          this.successMessage = 'Experience deleted successfully by admin!';
          this.loadAllExperiences(); // Reload the admin list
          this.loadUserExperiences(); // Also reload user experiences in case it was theirs

          // Notify home page to refresh
          this.refreshHomePageExperiences();

          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          console.error('Error deleting experience as admin:', error);
          this.errorMessage = 'Failed to delete experience as admin';
        }
      });
    }
  }

  refreshHomePageExperiences(): void {
    // Emit a custom event that the home page can listen to
    console.log('Emitting refresh event for home page');
    window.dispatchEvent(new CustomEvent('adminExperienceUpdated', {
      detail: { timestamp: Date.now() }
    }));
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
