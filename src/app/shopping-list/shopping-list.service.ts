import { Injectable, EventEmitter } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  ingredientChnaged = new Subject<Ingredient[]>();
  startedEditing   = new Subject<number>();
  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Oranges', 15),
  ];

  constructor() { }

  getIngredients() {
    return this.ingredients.slice();
    // since we are sending a new object of ingredients, any chnage in this will not automatically reflect in the shopping-list component
  }
  getIngredient(index: number) {
    return this.getIngredients()[index];
  }
  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientChnaged.next(this.getIngredients()); // on every change, emitting the updated ingredient[]
  }
  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientChnaged.next(this.getIngredients());
  }
  clearIngredient() {
    this.ingredients = [];
    this.ingredientChnaged.next(this.getIngredients());
  }
  addIngredientsList(ingredients: Ingredient[]) {
    // for (let ingredient of ingredients) {..    }
    this.ingredients.push(...ingredients); // pushing all the ingredients in one go in order to avoid multiple event emissions
    this.ingredientChnaged.next(this.getIngredients());
  }
  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.ingredientChnaged.next(this.getIngredients());

  }
}
