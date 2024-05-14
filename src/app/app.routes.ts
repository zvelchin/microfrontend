import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  {
    path: 'test',
    loadChildren: () => import('./test/test.module').then((m) => m.TestModule),
  },
  { path: '**', redirectTo: 'test' },
];

export const AppRoutingModule = RouterModule.forRoot(appRoutes);
