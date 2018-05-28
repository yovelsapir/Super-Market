import { HomepageComponent } from './../components/homepage/homepage.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserhomeComponent } from '../components/userhome/userhome.component';
import { RegisterComponent } from '../components/register/register.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user', component: UserhomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
