import {HttpClient} from '@angular/common/http';
import {DestroyRef, Injectable, inject, signal, WritableSignal} from '@angular/core';
import {Observable, interval, of, catchError} from 'rxjs';
import {map, shareReplay, tap} from 'rxjs/operators';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

export interface User {
    id: number;
    name: string;
    score: number;
}

@Injectable({
    providedIn: 'root',
})
export class DataService {
    private destroyRef = inject(DestroyRef);
    private cache$: Observable<User[]> | null = null;

    users: WritableSignal<User[]> = signal<User[]>([]);

    constructor(private http: HttpClient) {
        // Mise à jour automatique toutes les 5 secondes
        interval(5000)
            .pipe(
                tap(() => this.refreshUsers),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();

        // Chargement initial
        this.refreshUsers();
    }

  refreshUsers(): void {
    // Appelle loadUsers et met à jour l'état avec les résultats
    this.loadUsers()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((users) => {
          this.users.set(users);
        });
  }

    loadUsers(): Observable<User[]> {

        // Si les données ne sont pas dans le cache, effectuer l'appel API
        if (!this.cache$) {
            this.cache$ = this.http.get<User[]>('assets/data/users.data.json').pipe(
                map((users) => users.sort((a, b) => b.score - a.score)),
                shareReplay({bufferSize: 1, refCount: true}),
                catchError(error => {
                    console.error('Erreur lors de la récupération des utilisateurs:', error);
                    this.cache$ = null; // Réinitialise le cache en cas d'erreur
                    return of([]);
                })
            );
        }

        return this.cache$
    }

    updateScore(userId: number, newScore: number): void {
        this.users.update((users) =>
            users.map((user) =>
                user.id === userId ? {...user, score: newScore} : user
            )
        );
    }
}
