import { Injectable, signal, effect } from '@angular/core';
import { AppSettings, DEFAULT_SETTINGS } from '../../models/app.models';

@Injectable({providedIn:'root'})
export class SettingsService {
  readonly value=signal<AppSettings>(this.load());
  constructor(){ effect(()=>{ const v=this.value(); localStorage.setItem('typingapp.settings',JSON.stringify(v)); document.documentElement.dataset['theme']=v.theme; }); }
  update(p:Partial<AppSettings>){ this.value.update(v=>({...v,...p})); }
  private load():AppSettings { try{return {...DEFAULT_SETTINGS,...JSON.parse(localStorage.getItem('typingapp.settings') ?? '{}')}}catch{return DEFAULT_SETTINGS} }
}

