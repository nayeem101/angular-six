import { NgModule } from '@angular/core';
import { EmployeeRoutingModule } from './employee-routing.module';
import { SharedModule } from '../shared/shared.module';

import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { ListEmployeeComponent } from './list-employee/list-employee.component';

@NgModule({
  declarations: [CreateEmployeeComponent, ListEmployeeComponent],
  imports: [EmployeeRoutingModule, SharedModule],
  // exports: [CreateEmployeeComponent],
})
export class EmployeeModule {}
