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
    {id:'low',label:'ローパルス',description:'低く落ち着いた音'},
    {id:'alarm',label:'アラーム',description:'見逃しにくい二連音'},
    {id:'knock',label:'ノック',description:'硬い机を叩く音'},
    {id:'buzz',label:'ブザー',description:'強めの警告パルス'}
  ];
  readonly correctChoices: readonly CorrectSoundChoice[] = [
    {id:'mix',label:'ごちゃまぜ',description:'打鍵ごとに音がランダム'},
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
    {id:'retro',label:'レトロ',description:'8ビット風の音'},
    {id:'thock',label:'トック',description:'深い高級キーボード音'},
    {id:'clack',label:'クラック',description:'明るく硬いキー音'},
    {id:'cream',label:'クリーミー',description:'滑らかで柔らかな音'},
    {id:'arcade',label:'アーケード',description:'軽快なゲーム風サウンド'},
    {id:'pen',label:'ペン',description:'ペン先の鋭いクリック'},
    {id:'stone',label:'ストーン',description:'小石を打つ乾いた音'},
    {id:'spring',label:'スプリング',description:'ばねが弾む高い音'},
    {id:'bass',label:'ベース',description:'低く太い打鍵音'}
  ];
  private context?: AudioContext;
  private lastRandomSound?: Exclude<AppSettings['correctSound'],'mix'>;
  constructor(private settings: SettingsService) {}
  playMiss(force=false, type=this.settings.value().missSound) {
    if (!force && !this.settings.value().sound) return;
    const AudioContextClass = window.AudioContext;
    if (!AudioContextClass) return;
    const ctx=this.context ??= new AudioContextClass();
    if(ctx.state==='suspended') void ctx.resume();
    const now=ctx.currentTime, gain=ctx.createGain(); gain.connect(ctx.destination);
    const volume=Math.max(0,Math.min(200,this.settings.value().missSoundVolume))/100;
    if(volume===0)return;
    const tone=(frequency:number,start:number,duration:number,wave:OscillatorType,volume:number,endFrequency=frequency)=>{const o=ctx.createOscillator();o.type=wave;o.frequency.setValueAtTime(frequency,now+start);o.frequency.exponentialRampToValueAtTime(Math.max(30,endFrequency),now+start+duration);o.connect(gain);o.start(now+start);o.stop(now+start+duration)};
    gain.gain.setValueAtTime(.0001,now);
    const profiles:Record<AppSettings['missSound'],()=>void>={
      soft:()=>{gain.gain.exponentialRampToValueAtTime(.16*volume,now+.006);gain.gain.exponentialRampToValueAtTime(.0001,now+.11);tone(240,0,.12,'sine',.07,180)},
      wood:()=>{gain.gain.exponentialRampToValueAtTime(.22*volume,now+.003);gain.gain.exponentialRampToValueAtTime(.0001,now+.08);tone(170,0,.08,'triangle',.11,95)},
      digital:()=>{gain.gain.exponentialRampToValueAtTime(.14*volume,now+.003);gain.gain.exponentialRampToValueAtTime(.0001,now+.14);tone(420,0,.06,'square',.055,310);tone(260,.065,.07,'square',.04,210)},
      bell:()=>{gain.gain.exponentialRampToValueAtTime(.15*volume,now+.004);gain.gain.exponentialRampToValueAtTime(.0001,now+.28);tone(740,0,.28,'sine',.06,560);tone(1110,0,.18,'sine',.025,830)},
      low:()=>{gain.gain.exponentialRampToValueAtTime(.2*volume,now+.008);gain.gain.exponentialRampToValueAtTime(.0001,now+.19);tone(125,0,.2,'sine',.08,72)},
      alarm:()=>{gain.gain.exponentialRampToValueAtTime(.17*volume,now+.003);gain.gain.exponentialRampToValueAtTime(.0001,now+.24);tone(880,0,.09,'square',.1,660);tone(880,.12,.1,'square',.1,660)},
      knock:()=>{gain.gain.exponentialRampToValueAtTime(.3*volume,now+.002);gain.gain.exponentialRampToValueAtTime(.0001,now+.07);tone(210,0,.07,'triangle',.12,65)},
      buzz:()=>{gain.gain.exponentialRampToValueAtTime(.18*volume,now+.002);gain.gain.exponentialRampToValueAtTime(.0001,now+.18);tone(150,0,.18,'sawtooth',.1,105)}
    }; profiles[type]();
  }
  playCorrect(force=false,type=this.settings.value().correctSound){
    if(!force&&!this.settings.value().correctSoundEnabled)return;
    if(type==='mix')type=this.randomCorrectSound();
    const AudioContextClass=window.AudioContext;if(!AudioContextClass)return;
    const ctx=this.context??=new AudioContextClass();if(ctx.state==='suspended')void ctx.resume();
    const now=ctx.currentTime,gain=ctx.createGain(),osc=ctx.createOscillator();gain.connect(ctx.destination);osc.connect(gain);
    const profile:Record<Exclude<AppSettings['correctSound'],'mix'>,{f:number;end:number;duration:number;wave:OscillatorType;volume:number}>={
      crisp:{f:920,end:680,duration:.05,wave:'sine',volume:.2},mechanical:{f:310,end:125,duration:.045,wave:'square',volume:.15},bubble:{f:520,end:760,duration:.07,wave:'sine',volume:.2},glass:{f:1320,end:980,duration:.08,wave:'sine',volume:.17},synth:{f:680,end:420,duration:.055,wave:'triangle',volume:.22},
      typewriter:{f:220,end:80,duration:.035,wave:'sawtooth',volume:.13},marimba:{f:440,end:300,duration:.09,wave:'sine',volume:.24},laser:{f:480,end:1150,duration:.06,wave:'sawtooth',volume:.12},drop:{f:720,end:410,duration:.1,wave:'sine',volume:.22},tick:{f:1800,end:900,duration:.025,wave:'square',volume:.11},pop:{f:260,end:540,duration:.055,wave:'sine',volume:.24},retro:{f:760,end:380,duration:.04,wave:'square',volume:.12},
      thock:{f:185,end:62,duration:.065,wave:'sine',volume:.34},clack:{f:650,end:210,duration:.035,wave:'square',volume:.2},cream:{f:380,end:190,duration:.075,wave:'sine',volume:.3},arcade:{f:980,end:620,duration:.045,wave:'square',volume:.16},pen:{f:2100,end:740,duration:.022,wave:'triangle',volume:.16},stone:{f:290,end:105,duration:.045,wave:'sawtooth',volume:.2},spring:{f:740,end:1320,duration:.07,wave:'triangle',volume:.18},bass:{f:115,end:55,duration:.08,wave:'sine',volume:.38}
    },p=profile[type];
    const volume=Math.max(0,Math.min(200,this.settings.value().correctSoundVolume))/100;
    osc.type=p.wave;osc.frequency.setValueAtTime(p.f,now);osc.frequency.exponentialRampToValueAtTime(p.end,now+p.duration);gain.gain.setValueAtTime(Math.max(.0001,p.volume*volume*1.7),now);gain.gain.exponentialRampToValueAtTime(.0001,now+p.duration);osc.start(now);osc.stop(now+p.duration);
  }
  private randomCorrectSound():Exclude<AppSettings['correctSound'],'mix'>{
    const pool=this.correctChoices.map(x=>x.id).filter((id):id is Exclude<AppSettings['correctSound'],'mix'>=>id!=='mix'&&id!==this.lastRandomSound);
    const selected=pool[Math.floor(Math.random()*pool.length)]??'crisp';this.lastRandomSound=selected;return selected;
  }
}
