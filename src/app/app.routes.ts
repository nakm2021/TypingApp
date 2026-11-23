import { Routes } from '@angular/router';

export const routes: Routes = [
 {path:'',loadComponent:()=>import('./features/home/home').then(m=>m.Home)},
 {path:'play',loadComponent:()=>import('./features/typing/typing').then(m=>m.Typing)},
 {path:'result',loadComponent:()=>import('./features/result/result').then(m=>m.Result)},
 {path:'history',loadComponent:()=>import('./features/history/history').then(m=>m.History)},
 {path:'settings',loadComponent:()=>import('./features/settings/settings').then(m=>m.Settings)},
 {path:'**',redirectTo:''}
];
