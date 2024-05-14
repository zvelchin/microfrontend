import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from './test.component';

const testRoutes: Routes = [
  {
    path: '',
    component: TestComponent,
    pathMatch: 'full',
  },
];

export const TestRoutingModule = RouterModule.forChild(testRoutes);
