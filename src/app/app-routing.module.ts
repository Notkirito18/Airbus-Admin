import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewUserComponent } from './components/new-user/new-user.component';
import { UsersComponent } from './components/users/users.component';
import { GuestPageComponent } from './pages/guest-page/guest-page.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { UsingComponent } from './pages/using/using.component';
import { VenderHomeComponent } from './pages/vender-home/vender-home.component';
import { AuthGuardGuard } from './shared/guards/auth-guard.guard';
import { SuperUserGuardGuard } from './shared/guards/super-user-guard.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth/logIn', pathMatch: 'full' },
  { path: 'auth', redirectTo: 'auth/logIn', pathMatch: 'full' },
  { path: 'auth/logIn', component: LoginComponent },
  { path: 'auth/signUp', component: SignUpComponent },
  {
    path: 'home',
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
