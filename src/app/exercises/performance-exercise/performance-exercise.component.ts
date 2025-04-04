import {Component, ChangeDetectionStrategy, WritableSignal, signal} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-performance-exercise',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2>Exercice 3: Performance</h2>
      <p>Optimiser les calculs intensifs et éviter le blocage du thread principal.</p>

      <div class="controls">
        <button class="btn" (click)="startHeavyCalculation()">
          Démarrer le calcul intensif
        </button>
      </div>

      <div class="results">
        @if (calculating()) {
          <div class="loading-spinner"></div>
        }
        
        @if (results().length > 0) {
          <div class="data-grid">
            @for (result of results(); track result.id) {
              <div class="grid-item">
                {{ result.value }}
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .controls {
      margin-bottom: 20px;
    }
    .data-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 10px;
    }
    .grid-item {
      padding: 10px;
      background: #eee;
      text-align: center;
      border-radius: 4px;
    }
    .results {
      margin-top: 20px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PerformanceExerciseComponent {
  calculating: WritableSignal<boolean> = signal(false);
  results: WritableSignal<Array<{id: number, value: number}>> = signal([]);

  startHeavyCalculation() {
    this.calculating.set(true);
    const data = Array.from({ length: 1000 }, (_, i) => i);
    const chunkSize = 100; // Définir la taille de chaque chunk
    const totalChunks = Math.ceil(data.length / chunkSize);
    const results: Array<{id: number, value: number}> = [];

    const processChunk = (index: number) => {
      if (index >= totalChunks) {
        this.calculating.set(false);
        return;
      }

      const chunk = data.slice(index * chunkSize, (index + 1) * chunkSize);

      if (typeof Worker !== 'undefined') {
        const worker = new Worker(new URL('./performance.worker.ts', import.meta.url));

        worker.onmessage = ({ data }) => {
          results.push(...data); // Ajouter les résultats du chunk
          this.results.set(results); // Mettre à jour les résultats
          worker.terminate();
          processChunk(index + 1); // Traiter le chunk suivant
        };

        worker.onerror = (error) => {
          console.error('Worker error:', error);
          this.calculating.set(false); // Stop loading indicator
          worker.terminate();
        };

        worker.postMessage(chunk);
      } else {
        // Fallback pour les environnements sans Web Workers
        const chunkResults = this.heavyCalculation(chunk);
        results.push(...chunkResults); // Ajouter les résultats du chunk
        processChunk(index + 1); // Traiter le chunk suivant
      }
    };

    processChunk(0); // Démarrer le traitement avec le premier chunk
  }

  private heavyCalculation(data: number[]): Array<{id: number, value: number}> {
    return data.map((n, id) => {
      let value = n;
      for (let i = 1; i < 1000000; i++) {
        value = Math.sqrt(value * i);
      }
      return { id, value: Math.round(value) };
    });
  }
}