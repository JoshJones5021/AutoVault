import { provideRouter, Routes } from '@angular/router';
import { CarListComponent } from './pages/car-list/car-list.component';
import { CarFormComponent } from './pages/car-form/car-form.component';
import { CarDetailsComponent } from './pages/car-details/car-details.component';

export const routes: Routes = [
  {
    path: 'cars',
    component: CarListComponent,
  },
  {
    path: 'cars/:id',
    component: CarDetailsComponent,
  },
  {
    path: 'car-form',
    component: CarFormComponent,
  },
  { path: '', redirectTo: '/cars', pathMatch: 'full' },
];