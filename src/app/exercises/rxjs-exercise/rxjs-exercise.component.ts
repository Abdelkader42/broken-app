import {Component, inject, WritableSignal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DataService, User} from './data.service';

@Component({
  selector: 'app-rxjs-exercise',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2>Exercice 2: Optimisation RxJS</h2>
      <p>Corriger les fuites mémoire et optimiser la gestion d'état.</p>

      <div class="users-list">
        <h3>Liste des Utilisateurs</h3>
        @if (users().length) {
          <ul>
            @for (user of users(); track user.id) {
              <li>
                {{ user.name }} - Score: {{ user.score }}
                <button class="btn" (click)="updateUserScore(user.id)">
                  Mettre à jour le score
                </button>
              </li>
            }
          </ul>
        } @else {
          <p>Chargement des utilisateurs...</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .users-list {
      margin-top: 20px;
    }
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
  `]
})
export class RxjsExerciseComponent {
  private dataService = inject(DataService);
  users: WritableSignal<User[]> = this.dataService.users;

  updateUserScore(userId: number) {
    const newScore = Math.floor(Math.random() * 1000);
    this.dataService.updateScore(userId, newScore);
  }
}