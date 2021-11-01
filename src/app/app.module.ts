import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
import { MatSortModule } from '@angular/material/sort';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';

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
import { QrCodeCardComponent } from './components/qr-code-card/qr-code-card.component';
import { GuestGeneratedComponent } from './components/guest-generated/guest-generated.component';
import { environment } from 'src/environments/environment';

import * as firebase from 'firebase/app';
import { QrCodeInfoComponent } from './components/qr-code-info/qr-code-info.component';
import { VenderHomeComponent } from './pages/vender-home/vender-home.component';
import { MyFilterPipe } from './shared/myFilter.pipe';
import { sortRecordsPipe } from './shared/sortRecords.pipe';
import { filterRecordsPipe } from './shared/filterRecords.pipe';
import { RecordsComponent } from './components/records/records.component';
import { DeleteConfirmRecordsComponent } from './components/delete-confirm-records/delete-confirm-records.component';

firebase.initializeApp(environment.firebaseConfig);

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
    QrCodeCardComponent,
    GuestGeneratedComponent,
    QrCodeInfoComponent,
    VenderHomeComponent,
    MyFilterPipe,
    sortRecordsPipe,
    filterRecordsPipe,
    RecordsComponent,
    DeleteConfirmRecordsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,

    AngularFireModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,

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
    MatSortModule,
    FlexLayoutModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatRippleModule,
    MatTabsModule,
    MatExpansionModule,
    MatSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
