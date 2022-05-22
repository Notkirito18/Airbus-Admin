import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewUserComponent } from './components/new-user/new-user.component';
import { UsersComponent } from './components/users/users.component';
import { GuestPageComponent } from './pages/guest-page/guest-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { UsingComponent } from './pages/using/using.component';
import { VenderHomeComponent } from './pages/vender-home/vender-home.component';
import { AuthGuardGuard } from './shared/guards/auth-guard.guard';
import { SuperUserGuardGuard } from './shared/guards/super-user-guard.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'auth', redirectTo: 'auth/logIn', pathMatch: 'full' },
  { path: 'auth/logIn', component: LoginComponent },
  {
    path: 'auth/signUp',
    component: SignUpComponent,
    canActivate: [AuthGuardGuard, SuperUserGuardGuard],
  },
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'dashboard',
    component: HomeComponent,
    canActivate: [AuthGuardGuard, SuperUserGuardGuard],
  },
  {
    path: 'new-user/:id',
    component: NewUserComponent,
    canActivate: [AuthGuardGuard, SuperUserGuardGuard],
  },
  { path: 'using/:id', component: UsingComponent },
  { path: 'guest/:id', component: GuestPageComponent },
  {
    path: 'vhome',
    component: VenderHomeComponent,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

// add a guard to guest/:id page that takes the id of the user and pin code
// and compare the pin code to the pin of the guest with that id in the db
