import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SignupComponent,
    LoginComponent,
    UserProfileComponent,
    UserDashboardComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MatDialogModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
    MatDialogModule
  ]
})
export class UserModule { }
