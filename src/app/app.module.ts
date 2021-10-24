import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { UsersComponent } from './components/users/users.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { DeleteConfirmComponent } from './components/delete-confirm/delete-confirm.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UsingComponent } from './pages/using/using.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { GuestPageComponent } from './pages/guest-page/guest-page.component';

// const firebaseConfig = {
//   apiKey: 'AIzaSyDKHGQEHRrgyDKjKqRI0ln7kNo-w_Tf8y4',
//   authDomain: 'airbus-900f9.firebaseapp.com',
//   projectId: 'airbus-900f9',
//   storageBucket: 'airbus-900f9.appspot.com',
//   messagingSenderId: '724959592736',
//   appId: '1:724959592736:web:7d2317ebf0f756a4c3d745',
//   measurementId: 'G-F0T88TK45L',
// };

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    UsersComponent,
    NewUserComponent,
    DeleteConfirmComponent,
    UsingComponent,
    SignUpComponent,
    GuestPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    // AngularFireModule.initializeApp(firebaseConfig),
    // AngularFirestoreModule,
    // AngularFireAuthModule,
    // AngularFireStorageModule,

    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatRadioModule,
    MatNativeDateModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
