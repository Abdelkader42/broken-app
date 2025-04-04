import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalExerciseComponent } from './exercises/modal-exercise/modal-exercise.component';
import { PerformanceExerciseComponent } from './exercises/performance-exercise/performance-exercise.component';
import { RxjsExerciseComponent } from './exercises/rxjs-exercise/rxjs-exercise.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ModalExerciseComponent,
    RxjsExerciseComponent,
    PerformanceExerciseComponent,
  ],
  template: `
    <div class="container">
      <h1>Test Technique Angular 19</h1>
      <p class="intro">
        Ce test technique comporte trois exercices pour évaluer vos compétences
        en Angular. Temps estimé : 45 minutes.
      </p>

<!--    <app-modal-exercise />-->
<!--      <app-rxjs-exercise />-->
      <app-performance-exercise /> 
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      .intro {
        margin-bottom: 30px;
        color: #666;
      }
      h1 {
        color: #333;
        margin-bottom: 20px;
      }
    `,
  ],
})
export class App {}
