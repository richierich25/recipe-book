import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appPlaceholder]'
})
export class PlaceholderDirective {

  // allows to get information about the place where this directive sits
  // can be used to add some content
  constructor(public viewContainerRef: ViewContainerRef) { }

}
