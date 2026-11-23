import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import { AppSettings } from '../../models/app.models';

export interface SoundChoice { id: AppSettings['missSound']; label: string; description: string; }
export interface CorrectSoundChoice { id: AppSettings['correctSound']; label: string; description: string; }

@Injectable({providedIn:'root'})
export class SoundService {
  readonly choices: readonly SoundChoice[] = [
    {id:'soft',label:'ソフト',description:'控えめな短い音'},
    {id:'wood',label:'ウッド',description:'木を軽く叩く音'},
    {id:'digital',label:'デジタル',description:'明瞭な電子音'},
    {id:'bell',label:'ベル',description:'短く澄んだ音'},
    {id:'low',label:'ローパルス',description:'低く落ち着いた音'}
  ];
  readonly correctChoices: readonly CorrectSoundChoice[] = [
    {id:'crisp',label:'クリスプ',description:'軽く明瞭なクリック'},
    {id:'mechanical',label:'メカニカル',description:'乾いたキースイッチ音'},
    {id:'bubble',label:'バブル',description:'柔らかな小さい音'},
    {id:'glass',label:'グラス',description:'澄んだ高音'},
    {id:'synth',label:'シンセ',description:'短い電子パルス'},
    {id:'typewriter',label:'タイプライター',description:'硬質な打鍵音'},
    {id:'marimba',label:'マリンバ',description:'丸みのある木琴音'},
    {id:'laser',label:'レーザー',description:'鋭い上昇音'},
    {id:'drop',label:'ドロップ',description:'水滴のような音'},
    {id:'tick',label:'ティック',description:'時計のような短音'},
    {id:'pop',label:'ポップ',description:'弾ける軽快な音'},
    {id:'retro',label:'レトロ',description:'8ビット風の音'}
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
  playCorrect(force=false,type=this.settings.value().correctSound){
    if(!force&&!this.settings.value().correctSoundEnabled)return;
    const AudioContextClass=window.AudioContext;if(!AudioContextClass)return;
    const ctx=this.context??=new AudioContextClass();if(ctx.state==='suspended')void ctx.resume();
    const now=ctx.currentTime,gain=ctx.createGain(),osc=ctx.createOscillator();gain.connect(ctx.destination);osc.connect(gain);
    const profile:Record<AppSettings['correctSound'],{f:number;end:number;duration:number;wave:OscillatorType;volume:number}>={
      crisp:{f:920,end:680,duration:.05,wave:'sine',volume:.2},mechanical:{f:310,end:125,duration:.045,wave:'square',volume:.15},bubble:{f:520,end:760,duration:.07,wave:'sine',volume:.2},glass:{f:1320,end:980,duration:.08,wave:'sine',volume:.17},synth:{f:680,end:420,duration:.055,wave:'triangle',volume:.22},
      typewriter:{f:220,end:80,duration:.035,wave:'sawtooth',volume:.13},marimba:{f:440,end:300,duration:.09,wave:'sine',volume:.24},laser:{f:480,end:1150,duration:.06,wave:'sawtooth',volume:.12},drop:{f:720,end:410,duration:.1,wave:'sine',volume:.22},tick:{f:1800,end:900,duration:.025,wave:'square',volume:.11},pop:{f:260,end:540,duration:.055,wave:'sine',volume:.24},retro:{f:760,end:380,duration:.04,wave:'square',volume:.12}
    },p=profile[type];
    const volume=Math.max(0,Math.min(100,this.settings.value().correctSoundVolume))/100;
    osc.type=p.wave;osc.frequency.setValueAtTime(p.f,now);osc.frequency.exponentialRampToValueAtTime(p.end,now+p.duration);gain.gain.setValueAtTime(Math.max(.0001,p.volume*volume),now);gain.gain.exponentialRampToValueAtTime(.0001,now+p.duration);osc.start(now);osc.stop(now+p.duration);
  }
}
