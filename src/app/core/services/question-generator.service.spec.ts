import { describe,expect,it } from 'vitest';
import { QuestionGeneratorService } from './question-generator.service';
import { StorageService } from './storage.service';
import { QUESTION_CORPUS } from './question-corpus';

const storage={recentQuestionKeys:async()=>[],rememberQuestion:async()=>undefined} as unknown as StorageService;
describe('QuestionGeneratorService',()=>{
 it('空でない読み付き問題を指定難易度で生成する',async()=>{const s=new QuestionGeneratorService(storage);const q=await s.generate('advanced');expect(q.text.length).toBeGreaterThan(3);expect(q.kana.length).toBeGreaterThan(3);expect(q.difficulty).toBe('advanced');expect(q.kana).not.toMatch(/[一-龠]/)});
 it('同一プレイ内で本文を重複させない',async()=>{const s=new QuestionGeneratorService(storage);const keys=new Set<string>();for(let i=0;i<100;i++){const q=await s.generate('intermediate');expect(keys.has(q.duplicateKey)).toBe(false);keys.add(q.duplicateKey)}});
 it('大量生成しても停止せず例外を出さない',async()=>{const s=new QuestionGeneratorService(storage);for(let i=0;i<300;i++)await expect(s.generate('beginner')).resolves.toBeTruthy()});
 it('初級は短文だけを出題する',async()=>{const s=new QuestionGeneratorService(storage);for(let i=0;i<80;i++){const q=await s.generate('beginner');expect(q.text.length).toBeLessThanOrEqual(16);expect(q.kana.length).toBeLessThanOrEqual(18)}});
 it('ジャンル別コーパスは十分な種類と正しい読みを持つ',()=>{
  expect(QUESTION_CORPUS.length).toBeGreaterThanOrEqual(100);
  expect(new Set(QUESTION_CORPUS.map(x=>x.category)).size).toBeGreaterThanOrEqual(12);
  expect(new Set(QUESTION_CORPUS.map(x=>x.text)).size).toBe(QUESTION_CORPUS.length);
  for(const q of QUESTION_CORPUS){expect(q.text.length).toBeGreaterThan(3);expect(q.kana).not.toMatch(/[一-龠]/)}
 });
});
