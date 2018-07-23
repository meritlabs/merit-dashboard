import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StoreModule } from '@ngrx/store';
import { reducer } from '@dashboard/common/reducers';
import { EffectsModule } from '@ngrx/effects';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '@dashboard/desktop/app/app-routing.module';
import { AppComponent } from '@dashboard/desktop/app/app.component';
import { LoggerService } from '@dashboard/common/services/logger.service';
import { RanksService } from '@dashboard/common/services/rank.service.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n');
}

export function loadConfigs() {
  return () => console.log('app initialization goes here');
}

export function getProviders() {
  return [LoggerService, RanksService];
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    StoreModule.forRoot(reducer),
    ReactiveFormsModule,
  ],
  providers: [
    ...getProviders(),
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfigs,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
