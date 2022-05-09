import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { ListEmployeeComponent } from './list-employee/list-employee.component';

const routes: Routes = [
  { path: '', component: ListEmployeeComponent },
  {
    path: 'create',
    component: CreateEmployeeComponent,
  },
  {
    path: 'edit/:id',
    component: CreateEmployeeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
