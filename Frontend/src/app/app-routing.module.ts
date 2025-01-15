import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('../app/user-showroom-side/user-side-moudle.module').then(
        (m) => m.UserSideMoudleModule
      ),
  },

  {
    path: 'auth',
    loadChildren: () =>
      import('../app/user-authentication/user-atuhentication.module').then(
        (m) => m.UserAtuhenticationModule
      ),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('../app/admin-panel/admin-panel.module').then(
        (a) => a.AdminPanelModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
