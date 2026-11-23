export interface MatchState { input: string; valid: boolean; complete: boolean; candidates: readonly string[]; guide: string; }

const MAP: Record<string, string[]> = {
  'あ':['a'],'い':['i','yi'],'う':['u','wu'],'え':['e'],'お':['o'],
  'か':['ka'],'き':['ki'],'く':['ku'],'け':['ke'],'こ':['ko'],
  'さ':['sa'],'し':['shi','si'],'す':['su'],'せ':['se'],'そ':['so'],
  'た':['ta'],'ち':['chi','ti'],'つ':['tsu','tu'],'て':['te'],'と':['to'],
  'な':['na'],'に':['ni'],'ぬ':['nu'],'ね':['ne'],'の':['no'],
  'は':['ha'],'ひ':['hi'],'ふ':['fu','hu'],'へ':['he'],'ほ':['ho'],
  'ま':['ma'],'み':['mi'],'む':['mu'],'め':['me'],'も':['mo'],
  'や':['ya'],'ゆ':['yu'],'よ':['yo'],
  'ら':['ra'],'り':['ri'],'る':['ru'],'れ':['re'],'ろ':['ro'],
  'わ':['wa'],'を':['wo'],'ゐ':['wi'],'ゑ':['we'],
  'が':['ga'],'ぎ':['gi'],'ぐ':['gu'],'げ':['ge'],'ご':['go'],
  'ざ':['za'],'じ':['ji','zi'],'ず':['zu'],'ぜ':['ze'],'ぞ':['zo'],
  'だ':['da'],'ぢ':['di','ji'],'づ':['du','zu'],'で':['de'],'ど':['do'],
  'ば':['ba'],'び':['bi'],'ぶ':['bu'],'べ':['be'],'ぼ':['bo'],
  'ぱ':['pa'],'ぴ':['pi'],'ぷ':['pu'],'ぺ':['pe'],'ぽ':['po'],
  'きゃ':['kya'],'きゅ':['kyu'],'きょ':['kyo'], 'ぎゃ':['gya'],'ぎゅ':['gyu'],'ぎょ':['gyo'],
  'しゃ':['sha','sya'],'しゅ':['shu','syu'],'しょ':['sho','syo'],
  'じゃ':['ja','jya','zya'],'じゅ':['ju','jyu','zyu'],'じょ':['jo','jyo','zyo'],
  'ちゃ':['cha','tya'],'ちゅ':['chu','tyu'],'ちょ':['cho','tyo'],
  'にゃ':['nya'],'にゅ':['nyu'],'にょ':['nyo'],'ひゃ':['hya'],'ひゅ':['hyu'],'ひょ':['hyo'],
  'びゃ':['bya'],'びゅ':['byu'],'びょ':['byo'],'ぴゃ':['pya'],'ぴゅ':['pyu'],'ぴょ':['pyo'],
  'みゃ':['mya'],'みゅ':['myu'],'みょ':['myo'],'りゃ':['rya'],'りゅ':['ryu'],'りょ':['ryo'],
  'ふぁ':['fa'],'ふぃ':['fi'],'ふぇ':['fe'],'ふぉ':['fo'],'てぃ':['thi'],'でぃ':['dhi'],
  'ぁ':['xa','la'],'ぃ':['xi','li'],'ぅ':['xu','lu'],'ぇ':['xe','le'],'ぉ':['xo','lo'],
  'ゃ':['xya','lya'],'ゅ':['xyu','lyu'],'ょ':['xyo','lyo'],'ー':['-'],
  '、':[','],'。':['.'],'！':['!'],'？':['?'],'「':['['],'」':[']'],' ':[' ']
};

function tokens(kana: string): string[] {
  const out: string[] = [];
  for (let i=0;i<kana.length;i++) {
    const pair = kana.slice(i,i+2);
    if (MAP[pair]) { out.push(pair); i++; } else out.push(kana[i]);
  }
  return out;
}

export function romajiCandidates(kana: string, limit=2048): string[] {
  const ts=tokens(kana); let acc=[''];
  for(let i=0;i<ts.length;i++) {
    const t=ts[i]; let opts: string[];
    if(t==='っ') {
      const next=(MAP[ts[i+1]] ?? [''])[0]; opts=next ? [next[0], 'xtu', 'ltu'] : ['xtu','ltu'];
    } else if(t==='ん') {
      const next=(MAP[ts[i+1]] ?? [''])[0];
      opts = /^[aiueoyn]/.test(next) ? ["n'",'nn'] : ['n','nn'];
    } else opts=MAP[t] ?? [t.toLowerCase()];
    const expanded:string[]=[];
    for(const a of acc) for(const o of opts) { expanded.push(a+o); if(expanded.length>=limit) break; }
    acc=expanded;
  }
  return [...new Set(acc)];
}

export class RomajiMatcher {
  private readonly all: string[]; private typed='';
  constructor(kana: string) { this.all=romajiCandidates(kana); }
  get state(): MatchState { const c=this.all.filter(x=>x.startsWith(this.typed)); return { input:this.typed, valid:c.length>0, complete:c.includes(this.typed), candidates:c, guide:(c[0] ?? this.all[0] ?? '').slice(this.typed.length) }; }
  type(key: string): MatchState { const next=this.typed+key.toLowerCase(); if(this.all.some(x=>x.startsWith(next))) this.typed=next; return this.state; }
  accepts(key:string): boolean { return this.all.some(x=>x.startsWith(this.typed+key.toLowerCase())); }
  reset(){ this.typed=''; }
}

