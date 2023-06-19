import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'home/:translation',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'settings/:translation',
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/sign-up/sign-up.module').then(m => m.SignUpPageModule),
  },
  {
    path: 'confirmation',
    loadChildren: () => import('./pages/confirmation/confirmation.module').then(m => m.ConfirmationPageModule),
  },
  {
    path: 'translation',
    loadChildren: () => import('./pages/translation/translation.module').then(m => m.TranslationPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
