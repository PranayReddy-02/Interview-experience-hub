import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Experience } from '../../services/experience';

@Component({
  selector: 'app-experience-detail',
  imports: [CommonModule],
  templateUrl: './experience-detail.html',
  styleUrl: './experience-detail.scss'
})
export class ExperienceDetailComponent {
  @Input() experience: Experience | null = null;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
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
      month: 'long',
      day: 'numeric'
    });
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
}