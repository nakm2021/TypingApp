import { Injectable } from '@angular/core';
import { GameResult } from '../../models/app.models';

@Injectable({providedIn:'root'})
export class StorageService {
  private db?:Promise<IDBDatabase>;
  private open(){ return this.db ??= new Promise((resolve,reject)=>{ const r=indexedDB.open('TypingAppDB',1); r.onupgradeneeded=()=>{const d=r.result; if(!d.objectStoreNames.contains('results')) d.createObjectStore('results',{keyPath:'id'}); if(!d.objectStoreNames.contains('questions')) d.createObjectStore('questions',{keyPath:'key'});}; r.onsuccess=()=>resolve(r.result); r.onerror=()=>reject(r.error); }); }
  async saveResult(v:GameResult){ try{const db=await this.open(); db.transaction('results','readwrite').objectStore('results').put(v);}catch{/* game remains playable */} }
  async results():Promise<GameResult[]>{ try{const db=await this.open(); return await new Promise((res,rej)=>{const r=db.transaction('results').objectStore('results').getAll();r.onsuccess=()=>res((r.result as GameResult[]).sort((a,b)=>b.playedAt.localeCompare(a.playedAt)));r.onerror=()=>rej(r.error)});}catch{return []} }
  async recentQuestionKeys():Promise<string[]>{try{const db=await this.open();return await new Promise((res,rej)=>{const r=db.transaction('questions').objectStore('questions').getAll();r.onsuccess=()=>res((r.result as {key:string;at:number}[]).sort((a,b)=>b.at-a.at).slice(0,300).map(x=>x.key));r.onerror=()=>rej(r.error)})}catch{return []}}
  async rememberQuestion(key:string){try{const db=await this.open();const tx=db.transaction('questions','readwrite');tx.objectStore('questions').put({key,at:Date.now()});}catch{}}
  async clear(){try{const db=await this.open();for(const n of ['results','questions'])db.transaction(n,'readwrite').objectStore(n).clear()}catch{}}
}
