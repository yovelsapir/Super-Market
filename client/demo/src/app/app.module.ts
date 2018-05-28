import { CitiesService } from './services/cities.service';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { AppRoutingModule } from './routing/app-routing.module';
import { CategoryService } from './services/category.service';
import { HeaderService } from './services/header.service';
import { EnvService } from './services/env.service';
import { UserService } from './services/user.service';
import { ProductsService } from './services/products.service';
import { OrderComponent } from './components/order/order.component';
import { AboutComponent } from './components/about/about.component';
import { HeaderComponent } from './components/header/header.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { UserhomeComponent } from './components/userhome/userhome.component';
import { LoginComponent } from './components/login/login.component';
import '../polyfills';

import { MatNativeDateModule } from '@angular/material/core';
import { NavbarComponent } from './../../../src/navbars/navbar.component';
import { NavbarService } from './../../../src/navbars/navbar.service';
import { LogoComponent } from './../../../src/navbars/logo.component';
import { LinksComponent } from './../../../src/navbars/links.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { MDBBootstrapModule } from '../../../src';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule, } from '@angular/material/datepicker';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';


import { CdkTableModule } from '@angular/cdk/table';
import { RegisterComponent } from './components/register/register.component';
import { InfoComponent } from './components/info/info.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { CategoryComponent } from './components/category/category.component';
import { OrdersService } from './services/orders.service';
import { ShoppingCartService } from './services/shopping-cart.service';
import { CartItemService } from './services/cart-item.service';
import { SidenavService } from './services/sidenav.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserhomeComponent,
    HeaderComponent,
    HomepageComponent,
    AboutComponent,
    InfoComponent,
    SideNavComponent,
    CategoryComponent,
    OrderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CdkTableModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule.forRoot([]),
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    HttpClientModule,
    HttpClientJsonpModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
    ProductsService,
    EnvService,
    UserService,
    OrdersService,
    HeaderService,
    CategoryService,
    ShoppingCartService,
    SidenavService,
    CitiesService,
    CartItemService
  ],
  bootstrap: [AppComponent],
  exports: [NavbarComponent, LinksComponent, LogoComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);

