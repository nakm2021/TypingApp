import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import { AppSettings } from '../../models/app.models';

export interface SoundChoice { id: AppSettings['missSound']; label: string; description: string; }

@Injectable({providedIn:'root'})
export class SoundService {
  readonly choices: readonly SoundChoice[] = [
    {id:'soft',label:'ソフト',description:'控えめな短い音'},
    {id:'wood',label:'ウッド',description:'木を軽く叩く音'},
    {id:'digital',label:'デジタル',description:'明瞭な電子音'},
    {id:'bell',label:'ベル',description:'短く澄んだ音'},
    {id:'low',label:'ローパルス',description:'低く落ち着いた音'}
  ];
  private context?: AudioContext;
  constructor(private settings: SettingsService) {}
  playMiss(force=false, type=this.settings.value().missSound) {
    if (!force && !this.settings.value().sound) return;
    const AudioContextClass = window.AudioContext;
    if (!AudioContextClass) return;
    const ctx=this.context ??= new AudioContextClass();
    if(ctx.state==='suspended') void ctx.resume();
    const now=ctx.currentTime, gain=ctx.createGain(); gain.connect(ctx.destination);
    const tone=(frequency:number,start:number,duration:number,wave:OscillatorType,volume:number,endFrequency=frequency)=>{const o=ctx.createOscillator();o.type=wave;o.frequency.setValueAtTime(frequency,now+start);o.frequency.exponentialRampToValueAtTime(Math.max(30,endFrequency),now+start+duration);o.connect(gain);o.start(now+start);o.stop(now+start+duration)};
    gain.gain.setValueAtTime(.0001,now);
    const profiles:Record<AppSettings['missSound'],()=>void>={
      soft:()=>{gain.gain.exponentialRampToValueAtTime(.07,now+.006);gain.gain.exponentialRampToValueAtTime(.0001,now+.11);tone(240,0,.12,'sine',.07,180)},
      wood:()=>{gain.gain.exponentialRampToValueAtTime(.11,now+.003);gain.gain.exponentialRampToValueAtTime(.0001,now+.08);tone(170,0,.08,'triangle',.11,95)},
      digital:()=>{gain.gain.exponentialRampToValueAtTime(.055,now+.003);gain.gain.exponentialRampToValueAtTime(.0001,now+.14);tone(420,0,.06,'square',.055,310);tone(260,.065,.07,'square',.04,210)},
      bell:()=>{gain.gain.exponentialRampToValueAtTime(.06,now+.004);gain.gain.exponentialRampToValueAtTime(.0001,now+.28);tone(740,0,.28,'sine',.06,560);tone(1110,0,.18,'sine',.025,830)},
      low:()=>{gain.gain.exponentialRampToValueAtTime(.08,now+.008);gain.gain.exponentialRampToValueAtTime(.0001,now+.19);tone(125,0,.2,'sine',.08,72)}
    }; profiles[type]();
  }
}
