import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-modal-exercise',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2>Exercice 1: Modal et Z-index</h2>
      <p>Corriger les problèmes de z-index du modal et améliorer son animation.</p>
      
      <button class="btn" (click)="showModal = true">Ouvrir le Modal</button>
      
      @if (showModal) {
        <div class="modal-container">
          <div class="overlay" (click)="showModal = false"></div>
          <div class="modal" @fadeInOut>
            <h3>Contenu du Modal</h3>
            <p>Ce modal doit apparaître au-dessus de tous les autres éléments.</p>
            <button class="btn" (click)="showModal = false">Fermer</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .modal-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
    }
    .modal {
      position: relative;
      z-index: 1001;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    }
  `],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void <=> *', animate(300))
    ])
  ]
})
export class ModalExerciseComponent {
  showModal = false;
}