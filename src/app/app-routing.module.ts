import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  // implementing lazy loading for recipes
  // loadChildren ensures that the recipe module is loaded only when the user navigates to the /recipes path
  // we import the recipe module form its path(promise) and identify by giving its class name
  // this ensures that the recipe module along with all its declaration contents are put into a separate bundle which is loded lazily
  {
    path: 'recipes',
    loadChildren: () =>
      import('./recipes/recipes.module').then((module) => module.RecipesModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((module) => module.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
