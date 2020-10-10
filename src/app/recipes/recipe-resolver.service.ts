import { Injectable } from '@angular/core';
import { RecipeService } from './recipe.service';
import {
  ActivatedRoute,
  RouterStateSnapshot,
  Resolve,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Recipe } from './recipes.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeResolverService implements Resolve<Recipe[]> {
  constructor(private recipeService: RecipeService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Recipe[]> | Promise<Recipe[]> | Recipe[] {
    // the resolve function will automatically subscribe for us
    const recipes = this.recipeService.getRecipes();

    if (recipes.length === 0) {
      return this.recipeService.fetchRecipes();
    }
    return recipes;

  }
}
