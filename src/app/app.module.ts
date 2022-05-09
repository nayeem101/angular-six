import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//user defined modules
import { AppRoutingModule } from './app-routing.module';

//services
import { EmployeeService } from './employee/employee.service';

//components
import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

//in imports the order is important for moules work correctly
@NgModule({
  declarations: [AppComponent, HomeComponent, PageNotFoundComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule],
  providers: [EmployeeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
