import { Routes } from '@angular/router';
import { CarListComponent } from './pages/car-list/car-list.component';
import { CarDetailsComponent } from './pages/car-details/car-details.component';
import { CarFormComponent } from './pages/car-form/car-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'cars', pathMatch: 'full' }, // Default route
  { path: 'cars', component: CarListComponent }, // List of cars
  { path: 'cars/:id', component: CarDetailsComponent }, // Car details
  { path: 'car-form', component: CarFormComponent }, // Add or edit car
];