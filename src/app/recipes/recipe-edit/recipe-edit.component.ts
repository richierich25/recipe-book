import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipes.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss'],
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  submitted = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    const idParam = 'id';
    const editParam = '';
    this.route.params.subscribe((params: Params) => {
      this.id = +params[idParam];
      this.editMode = params[idParam] != null;
      // /recipe/0/edit - checking whether a route param of id is present or not; if it is then it is always in edit mode
      // /recipe/new - if 'new' is provided then editMode is false as id is undefined
      this.initForm();
    });

  }
  private initForm() {
    let recipeName = '';
    let recipeDescription = '';
    let recipeImagePath = '';
    const recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeDescription = recipe.description;
      recipeImagePath = recipe.imagePath;
      if (recipe['ingredients']) {
        for (const ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ingredient.name, [Validators.required]),
              amount: new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/),
              ]),
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, [Validators.required]),
      description: new FormControl(recipeDescription, [Validators.required]),
      imagePath: new FormControl(recipeImagePath, [Validators.required]),
      ingredients: recipeIngredients,
    });
  }
  getControls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }
  onAddIngredient() {
    (this.recipeForm.get('ingredients') as FormArray).push(
      new FormGroup({
        name: new FormControl(null, [Validators.required]),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }
  onSubmit() {
    console.log(this.recipeForm);
    const newRecipe = new Recipe(
      this.recipeForm.value.name,
      this.recipeForm.value.description,
      this.recipeForm.value.imagePath,
      this.recipeForm.value.ingredients
    );

    if (this.editMode) {
      // be careful while you use this.recipeForm.value as the keys need to match exactly with Recipe keys
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
      // this.recipeService.updateRecipe(this.id, newRecipe); // allso works and is safer
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.submitted = true;
    this.onCancel();
  }
  onCancel() {
    this.recipeForm.reset();
    this.router.navigate(['../'], {relativeTo: this.route});
  }
  onDeleteIngredient(index: number) {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
        // (this.recipeForm.get('ingredients') as FormArray).clear(); to remove all the form array elements
  }
}
