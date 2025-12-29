import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ResumeService } from './resume.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class AppComponent implements OnInit, OnDestroy {
  private resumeService = inject(ResumeService);
  resumeData = this.resumeService.getResumeData;

  // State for the summary carousel
  currentSummaryIndex = signal(0);
  totalSummaryPoints = computed(() => this.resumeData().summary.length);

  // State for the main experience carousel
  currentExperienceIndex = signal(0);
  totalExperiences = computed(() => this.resumeData().experience.length);

  // State for the nested description carousel
  currentDescriptionIndex = signal(0);
  totalDescriptions = computed(() => {
    const experience = this.resumeData().experience[this.currentExperienceIndex()];
    return experience ? experience.description.length : 0;
  });

  private descriptionInterval?: number;

  ngOnInit(): void {
    this.startDescriptionCarousel();
  }

  ngOnDestroy(): void {
    this.stopDescriptionCarousel();
  }

  private startDescriptionCarousel(): void {
    this.stopDescriptionCarousel();
    if (this.totalDescriptions() > 1) {
      this.descriptionInterval = window.setInterval(() => {
        this.nextDescription();
      }, 5000);
    }
  }

  private stopDescriptionCarousel(): void {
    if (this.descriptionInterval) {
      window.clearInterval(this.descriptionInterval);
    }
  }

  nextSummary(): void {
    this.currentSummaryIndex.update(i => (i + 1) % this.totalSummaryPoints());
  }

  previousSummary(): void {
    this.currentSummaryIndex.update(i => (i - 1 + this.totalSummaryPoints()) % this.totalSummaryPoints());
  }

  nextExperience(): void {
    this.currentExperienceIndex.update(i => (i + 1) % this.totalExperiences());
    this.currentDescriptionIndex.set(0); // Reset description index
    this.startDescriptionCarousel();
  }

  previousExperience(): void {
    this.currentExperienceIndex.update(i => (i - 1 + this.totalExperiences()) % this.totalExperiences());
    this.currentDescriptionIndex.set(0); // Reset description index
    this.startDescriptionCarousel();
  }

  goToExperience(index: number): void {
    this.currentExperienceIndex.set(index);
    this.currentDescriptionIndex.set(0); // Reset description index
    this.startDescriptionCarousel();
  }

  nextDescription(): void {
    this.currentDescriptionIndex.update(i => (i + 1) % this.totalDescriptions());
  }

  previousDescription(): void {
    this.currentDescriptionIndex.update(i => (i - 1 + this.totalDescriptions()) % this.totalDescriptions());
  }

  nextDescriptionManual(): void {
    this.nextDescription();
    this.startDescriptionCarousel();
  }

  previousDescriptionManual(): void {
    this.previousDescription();
    this.startDescriptionCarousel();
  }
}
