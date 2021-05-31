import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxsModule } from '@ngxs/store';
import { AppState } from './state/app.state';
import { environment } from '../environments/environment';
import { ChartsModule, ThemeService } from 'ng2-charts';
import { Daterangepicker } from 'ng2-daterangepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    Daterangepicker,
    AppRoutingModule,
    NgxsModule.forRoot([AppState], {
      developmentMode: !environment.production
    }),
    ChartsModule 
  ],
  providers: [ThemeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
