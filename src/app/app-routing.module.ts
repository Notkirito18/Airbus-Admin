import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewUserComponent } from './components/new-user/new-user.component';
import { UsersComponent } from './components/users/users.component';
import { GuestPageComponent } from './pages/guest-page/guest-page.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { UsingComponent } from './pages/using/using.component';
import { AuthGuardGuard } from './shared/auth-guard.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth/logIn', pathMatch: 'full' },
  { path: 'auth', redirectTo: 'auth/logIn', pathMatch: 'full' },
  { path: 'auth/logIn', component: LoginComponent },
  { path: 'auth/signUp', component: SignUpComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuardGuard],
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', component: UsersComponent },
      { path: 'new-user/:id', component: NewUserComponent },
    ],
  },
  { path: 'using/:id', component: UsingComponent },
  { path: 'guest/:id', component: GuestPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
