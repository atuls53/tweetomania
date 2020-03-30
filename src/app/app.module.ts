// Predifined modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';

//Custom modules
import { AppRoutingModule } from './app-routing.module';

// Declared components
import { AppComponent } from './app.component';
import { SearchBoardComponent } from './components/search-board/search-board.component';
import { AuthInterceptor } from './services/auth.service';
import { DatatableComponent, DatatableSortFieldComponent } from './components/datatable';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { MomentModule } from 'angular2-moment';
import { ConstService  } from "./services/const.service";
//Declared Services

@NgModule({
  declarations: [
    AppComponent,
    SearchBoardComponent,
    DatatableComponent,
    DatatableSortFieldComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    GooglePlaceModule,
    MomentModule
  ],
  providers: [ConstService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true} ],
  bootstrap: [AppComponent]
})
export class AppModule { }
