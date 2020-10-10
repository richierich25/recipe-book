import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { AlertComponent } from './alert/alert.component';
import { PlaceholderDirective } from './placeholder.directive';
import { DropdownDirective } from './directives/dropdown.directive';
import { Dropdown2Directive } from './directives/dropdown2.directive';



@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    AlertComponent,
    PlaceholderDirective,
    DropdownDirective,
    Dropdown2Directive,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingSpinnerComponent,
    AlertComponent,
    PlaceholderDirective,
    DropdownDirective,
    Dropdown2Directive,
    CommonModule // exporting the module to be imported in all the other modules and need not be redeclared
  ]
})
export class SharedModule { }
