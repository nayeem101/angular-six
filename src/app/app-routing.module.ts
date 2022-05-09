import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CustomPreloadingService } from './custom-preloading.service';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'employees',
    data: { preload: true }, //here the data is used in custom preloading stretegy
    loadChildren: () =>
      import('./employee/employee.module').then((m) => m.EmployeeModule),
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: CustomPreloadingService,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

// * preloading angular modules
/* 
  three ways: 
  1) eager loading => all the modules must downloaded before the app start. 
                    default statregy, for app module
  2) lazy loading => modules are lazy loaded on demand when user navigate to the module. 
                    for feature modules.
  3) preloading => also called eager lazy loading. modules config to preload are then 
                    downloaded in the background.
                    PlreloadAllModules is used in root RouterModule

*/
