import { describe, expect, it } from 'vitest';
import { RomajiMatcher, romajiCandidates } from './romaji-matcher';

describe('RomajiMatcher',()=>{
  it.each([['し',['shi','si']],['ち',['chi','ti']],['つ',['tsu','tu']],['ふ',['fu','hu']],['しゃ',['sha','sya']],['じゃ',['ja','jya','zya']]])('%s の表記揺れを受理する',(kana,patterns)=>{const all=romajiCandidates(kana);for(const p of patterns)expect(all).toContain(p)});
  it('入力途中では候補分岐を維持する',()=>{const m=new RomajiMatcher('し');expect(m.type('s').candidates).toEqual(expect.arrayContaining(['shi','si']));expect(m.type('h').guide).toBe('i');expect(m.type('i').complete).toBe(true)});
  it('促音を子音の重ねで表現する',()=>expect(romajiCandidates('きって')).toContain('kitte'));
  it('母音前の「ん」を曖昧なく表現する',()=>{expect(romajiCandidates('んあ')).toContain("n'a");expect(romajiCandidates('んあ')).toContain('nna')});
  it('誤入力では状態を進めない',()=>{const m=new RomajiMatcher('し');m.type('x');expect(m.state.input).toBe('')});
  it('文章を最後まで完了できる',()=>{const m=new RomajiMatcher('すし');for(const k of 'sushi')m.type(k);expect(m.state.complete).toBe(true)});
  it('長音と半角英数字・記号を受理する',()=>{expect(romajiCandidates('こーひー')).toContain('ko-hi-');expect(romajiCandidates('a7+3=10')).toContain('a7+3=10')});
});
