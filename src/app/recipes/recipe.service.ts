import { Injectable, OnInit } from '@angular/core';
import { Recipe } from './recipes.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  recipeChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];
  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Bread Omlette',
  //     'Yummy Omlette!',
  //     '../../../assets/images/recipe1.jpg',
  //     [new Ingredient('Bread', 12), new Ingredient('Omlette', 2)]
  //   ),
  //   new Recipe(
  //     'Herbal Mix',
  //     'Healthy Food!',
  //     '../../../assets/images/recipe2.jpg',
  //     [
  //       new Ingredient('Min Leaves', 23),
  //       new Ingredient('Cumin Seeds', 20),
  //       new Ingredient('Soya', 11),
  //     ]
  //   ),
  // ];

  constructor(
    private shoppingListService: ShoppingListService,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getRecipes() {
    // returning this.recipes will send the reference to the recipes list defined here
    // therefore any modification will be reflected on this main list
    // we use the slice() method to return a new recipes array
    return this.recipes.slice();
  }

  getRecipe(id: number): Recipe {
    return this.getRecipes()[id];
    // return this.getRecipes().find((recipe: Recipe) => {
    //   return recipe.id === id;
    // });
  }

  addIngredientToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredientsList(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipeChanged.next(this.getRecipes());
  }
  updateRecipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;
    this.recipeChanged.next(this.getRecipes());
  }
  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.getRecipes());
  }

  // All HTTP relates methods

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipeChanged.next(this.getRecipes());
  }
  storeRecipes() {
    const recipes = this.getRecipes();
    this.http
      .put<Recipe[]>(
        'https://richards-72d43.firebaseio.com/recipes.json',
        recipes
      )
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>('https://richards-72d43.firebaseio.com/recipes.json')
      .pipe(
        map((recipes) => {
          return recipes.map((recipe) => {
            // trying to ensure that in case no ingredient[] is present in the incoming recipe, we explicitly proivide an ingredients key
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        tap((recipes) => {
          this.setRecipes(recipes);
        })
      );

    // the below code commented as we added logic in AuthInterceptorService
    // take gives the last 1 user and unsubscribes to the subscription
    // exhaust maps waits for the outer observable to complete and then it gets this user data
    // we return a new observable(inner observable) which replaces the user observable with the Http observable(outer observable)

    // return this.authService.user
    //   .pipe(
    //     take(1),
    //     exhaustMap((user) => {
    //       return this.http.get<Recipe[]>(
    //         'https://richards-72d43.firebaseio.com/recipes.json',
    //         {
    //           params: new HttpParams().set('auth', user.token)
    //         }
    //       );
    //     }),
    //     map((recipes) => {
    //       return recipes.map((recipe) => {
    //         // trying to ensure that in case no ingredient[] is present in the incoming recipe, we explicitly proivide an ingredients key
    //         return {
    //           ...recipe,
    //           ingredients: recipe.ingredients ? recipe.ingredients : [],
    //         };
    //       });
    //     }),
    //     tap((recipes) => {
    //       this.setRecipes(recipes);
    //     })
    //   );

    // the below code commented as we needed to append the user.token details and append into all outgoing requests
    // return this.http
    //   .get<Recipe[]>('https://richards-72d43.firebaseio.com/recipes.json')
    //   .pipe(
    //     map((recipes) => {
    //       return recipes.map((recipe) => {
    //         // trying to ensure that in case no ingredient[] is present in the incoming recipe, we explicitly proivide an ingredients key
    //         return {
    //           ...recipe,
    //           ingredients: recipe.ingredients ? recipe.ingredients : [],
    //         };
    //       });
    //     }),
    //     tap((recipes) => {
    //       this.setRecipes(recipes);
    //     })
    //   );
  }
}
