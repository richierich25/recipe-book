import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { RecipesModule } from './recipes/recipes.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    // RecipesModule, // The recipe module; comemnting as lazy loading RecipesModule and avoid eager loading
    ShoppingListModule, // The shopping list module
    // AuthModule, // The auth feature module; comemnting as lazy loading AuthModule
    SharedModule, // the shared module having shared functionalities
    CoreModule, // the core module having interceptor services
  ],
  providers: [], // the Interceptor is defined in the core module
  bootstrap: [AppComponent],
})
export class AppModule {}
