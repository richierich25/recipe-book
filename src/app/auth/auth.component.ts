import { Component, OnInit, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  errorData: string = null;
  private closeSub: Subscription; // subscription for the dynamic component
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective; // points to the first occurence of PlaceholderDirective in the DOM

  constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(): void {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
  closeAlert() {
    this.errorData = null;
  }
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      // log in mode
      authObs = this.authService.login(email, password);
    } else {
      // sign up mode
      authObs = this.authService.signUp(email, password);
    }

    authObs.subscribe(
      (response: AuthResponseData) => {
        this.isLoading = false;
        console.log(response);
        this.router.navigate(['/recipes']);
      },
      (errorMeessage) => {
        console.log(errorMeessage);
        this.errorData = errorMeessage;
        this.isLoading = false;
        // this.showErrorAlert(errorMeessage); // toggling the dynamic component; comment out for enabling dynamic component creation
      }
    );
    form.reset();
  }

  // generating Dynamic Alert Component programmatically
  private showErrorAlert(errorMessage: string) {

    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    // getting access to the ref in DOM
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);
    // works with IVY(Angular 9+ but requires entryComponent to be configured with AlertComponent in app.module for all lower version)
    componentRef.instance.message = errorMessage;
    this.closeSub = componentRef.instance.closeModal.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }

}
