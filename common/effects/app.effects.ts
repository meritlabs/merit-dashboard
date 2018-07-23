import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppReducerActionType, UpdateAppAction } from '@dashboard/common/reducers/app.reducer';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { filter, tap } from 'rxjs/operators';

@Injectable()
export class AppEffects {}
