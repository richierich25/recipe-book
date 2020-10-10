import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';
import { Subscribable, Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  // @Output() featureSelected = new EventEmitter<string>();
  private userSub: Subscription;
  isAuthenticated = false;

  constructor(private recipeService: RecipeService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user
      .subscribe(user => {
        this.isAuthenticated = !user ? false : true;
        // this.isAuthenticated = !!user;
      }

      );
  }

  // onSelectFeature(feature: string) {
  //   console.log('checking header ' + feature);
  //   this.featureSelected.emit(feature);
  // }

  onSaveRecipes() {
    this.recipeService.storeRecipes();
  }
  onFetchRecipes() {
    // this.recipeService.getRecipes();
    this.recipeService.fetchRecipes().subscribe();
  }
  onLogout() {
    this.authService.logout();
  }
  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
