import { Injectable } from '@angular/core';
import { Difficulty, Question } from '../../models/app.models';
import { StorageService } from './storage.service';

interface Word { text:string; kana:string; difficulty:Difficulty; category:string; }
interface Built { text:string; kana:string; }
const w=(text:string,kana:string,difficulty:Difficulty='beginner',category='daily'):Word=>({text,kana,difficulty,category});
const join=(...xs:(Word|Built|string)[]):Built=>xs.reduce<Built>((a,x)=>typeof x==='string'?{text:a.text+x,kana:a.kana+x}:{text:a.text+x.text,kana:a.kana+x.kana},{text:'',kana:''});

const SUBJECTS=[w('学生','がくせい'),w('旅人','たびびと'),w('少年','しょうねん'),w('少女','しょうじょ'),w('先生','せんせい'),w('料理人','りょうりにん'),w('研究者','けんきゅうしゃ','intermediate'),w('音楽家','おんがくか'),w('写真家','しゃしんか'),w('店員','てんいん'),w('家族','かぞく'),w('友達','ともだち'),w('猫','ねこ'),w('犬','いぬ'),w('鳥','とり')];
const PLACES=[w('図書館','としょかん'),w('海辺','うみべ'),w('公園','こうえん'),w('駅前','えきまえ'),w('静かな森','しずかなもり'),w('小さな喫茶店','ちいさなきっさてん'),w('学校','がっこう'),w('台所','だいどころ'),w('美術館','びじゅつかん'),w('商店街','しょうてんがい'),w('川沿い','かわぞい'),w('山頂','さんちょう'),w('広場','ひろば'),w('庭','にわ'),w('港','みなと')];
const ACTIONS=[w('本を読んだ','ほんをよんだ'),w('空を見上げた','そらをみあげた'),w('写真を撮った','しゃしんをとった'),w('ゆっくり歩いた','ゆっくりあるいた'),w('温かいお茶を飲んだ','あたたかいおちゃをのんだ'),w('新しい歌を覚えた','あたらしいうたをおぼえた'),w('手紙を書いた','てがみをかいた'),w('友達を待った','ともだちをまった'),w('窓を開けた','まどをあけた'),w('花を見つけた','はなをみつけた'),w('丁寧に説明した','ていねいにせつめいした','intermediate'),w('未来について考えた','みらいについてかんがえた','intermediate'),w('朝食を作った','ちょうしょくをつくった'),w('元気に挨拶した','げんきにあいさつした'),w('古い地図を広げた','ふるいちずをひろげた')];
const TIMES=[w('今朝','けさ'),w('昼休みに','ひるやすみに'),w('夕暮れに','ゆうぐれに'),w('昨日','きのう'),w('休日に','きゅうじつに'),w('雨上がりに','あめあがりに'),w('春の朝に','はるのあさに'),w('夏の夜に','なつのよるに'),w('秋の午後に','あきのごごに'),w('冬の早朝に','ふゆのそうちょうに'),w('授業の後で','じゅぎょうのあとで'),w('仕事の帰りに','しごとのかえりに')];
const NOUNS=[w('風','かぜ'),w('星','ほし'),w('雲','くも'),w('電車','でんしゃ'),w('時計','とけい'),w('自転車','じてんしゃ'),w('鍵','かぎ'),w('鞄','かばん'),w('日記','にっき'),w('物語','ものがたり'),w('音楽','おんがく'),w('景色','けしき'),w('季節','きせつ'),w('約束','やくそく'),w('思い出','おもいで')];
const ADJS=[w('青い','あおい'),w('明るい','あかるい'),w('優しい','やさしい'),w('静かな','しずかな'),w('大きな','おおきな'),w('小さな','ちいさな'),w('美しい','うつくしい'),w('懐かしい','なつかしい'),w('不思議な','ふしぎな'),w('爽やかな','さわやかな'),w('穏やかな','おだやかな'),w('鮮やかな','あざやかな')];
const EVENTS=[w('祭りが始まり','まつりがはじまり'),w('鐘の音が響き','かねのおとがひびき'),w('雨が上がり','あめがあがり'),w('虹が現れ','にじがあらわれ'),w('風が吹き','かぜがふき'),w('電車が到着し','でんしゃがとうちゃくし'),w('花が咲き','はながさき'),w('灯りがともり','あかりがともり'),w('音楽が流れ','おんがくがながれ'),w('朝日が昇り','あさひがのぼり')];
const FEELINGS=[w('心が弾んだ','こころがはずんだ'),w('ほっと安心した','ほっとあんしんした'),w('嬉しくなった','うれしくなった'),w('胸が温かくなった','むねがあたたかくなった'),w('少し驚いた','すこしおどろいた'),w('元気が湧いた','げんきがわいた'),w('笑顔になった','えがおになった'),w('静かな気持ちになった','しずかなきもちになった')];

const pick=<T>(a:T[])=>a[Math.floor(Math.random()*a.length)];
const TEMPLATES:((d:Difficulty)=>Built)[]=[
 ()=>join(pick(SUBJECTS),'は',pick(PLACES),'で',pick(ACTIONS),'。'),
 ()=>join(pick(TIMES),pick(SUBJECTS),'は',pick(ACTIONS),'。'),
 ()=>join(pick(ADJS),pick(NOUNS),'が',pick(PLACES),'にあった。'),
 ()=>join(pick(PLACES),'で',pick(EVENTS),pick(FEELINGS),'。'),
 ()=>join(pick(SUBJECTS),'は',pick(NOUNS),w('を見つけて','をみつけて'),pick(FEELINGS),'。'),
 ()=>join(pick(TIMES),pick(PLACES),w('へ行き、','へいき、'),pick(ACTIONS),'。'),
 ()=>join(pick(SUBJECTS),'が',pick(ACTIONS),w('ので、みんなは喜んだ。','ので、みんなはよろこんだ。')),
 ()=>join(w('「今日は','「きょうは'),pick(PLACES),w('へ行こう」と','へいこう」と'),pick(SUBJECTS),w('が言った。','がいった。')),
 ()=>join(pick(ADJS),pick(NOUNS),w('を眺めながら、','をながめながら、'),pick(SUBJECTS),'は',pick(ACTIONS),'。'),
 ()=>join(pick(EVENTS),w('辺りは少しずつ明るくなった。','あたりはすこしずつあかるくなった。')),
 ()=>join(pick(TIMES),pick(SUBJECTS),w('と友達は','とともだちは'),pick(PLACES),w('で出会った。','でであった。')),
 ()=>join(pick(SUBJECTS),'は',pick(PLACES),'から',pick(ADJS),pick(NOUNS),w('を持ち帰った。','をもちかえった。')),
 ()=>join(w('もし時間があれば、','もしじかんがあれば、'),pick(PLACES),'で',pick(ACTIONS),'。'),
 ()=>join(pick(PLACES),'には',pick(ADJS),pick(NOUNS),w('があり、人々に親しまれている。','があり、ひとびとにしたしまれている。')),
 ()=>join(pick(TIMES),pick(EVENTS),w('町の景色が鮮やかに変わった。','まちのけしきがあざやかにかわった。')),
 ()=>join(pick(SUBJECTS),w('は迷ったが、最後には','はまよったが、さいごには'),pick(ACTIONS),'。'),
 ()=>join(w('窓の外では','まどのそとでは'),pick(EVENTS),pick(SUBJECTS),w('は静かに耳を澄ませた。','はしずかにみみをすませた。')),
 ()=>join(pick(ADJS),pick(NOUNS),w('について調べるため、','についてしらべるため、'),pick(SUBJECTS),w('は図書館へ向かった。','はとしょかんへむかった。')),
 ()=>join(pick(SUBJECTS),w('は毎日少しずつ練習し、できることを増やしている。','はまいにちすこしずつれんしゅうし、できることをふやしている。')),
 ()=>join(pick(TIMES),pick(PLACES),w('を訪れると、','をおとずれると、'),pick(EVENTS),pick(FEELINGS),'。'),
];

// 会話、描写、理由、条件、対比、習慣、説明など、異なる文法構造を追加する。
TEMPLATES.push(
 ()=>join(pick(SUBJECTS),'は',pick(ADJS),pick(NOUNS),w('を選んだ。','をえらんだ。')),
 ()=>join(pick(PLACES),'に',pick(ADJS),pick(NOUNS),w('が見える。','がみえる。')),
 ()=>join(pick(TIMES),pick(NOUNS),w('の音が聞こえた。','のおとがきこえた。')),
 ()=>join(pick(SUBJECTS),'と',pick(SUBJECTS),w('は一緒に','はいっしょに'),pick(ACTIONS),'。'),
 ()=>join(pick(ADJS),pick(NOUNS),w('が静かに揺れている。','がしずかにゆれている。')),
 ()=>join(pick(PLACES),'へ',pick(SUBJECTS),w('がやって来た。','がやってきた。')),
 ()=>join(pick(TIMES),pick(SUBJECTS),w('は早く目を覚ました。','ははやくめをさました。')),
 ()=>join(pick(SUBJECTS),'は',pick(NOUNS),w('を大切にしまった。','をたいせつにしまった。')),
 ()=>join(pick(EVENTS),pick(PLACES),w('は活気に包まれた。','はかっきにつつまれた。')),
 ()=>join(pick(SUBJECTS),w('は笑いながら手を振った。','はわらいながらてをふった。')),
 ()=>join(w('「また明日」と','「またあした」と'),pick(SUBJECTS),w('は笑った。','はわらった。')),
 ()=>join(w('「これは何だろう」と','「これはなんだろう」と'),pick(SUBJECTS),w('は首をかしげた。','はくびをかしげた。')),
 ()=>join(pick(SUBJECTS),w('が扉を開けると、','がとびらをあけると、'),pick(ADJS),pick(NOUNS),w('が現れた。','があらわれた。')),
 ()=>join(pick(TIMES),pick(SUBJECTS),w('は予定を確かめてから、','はよていをたしかめてから、'),pick(ACTIONS),'。'),
 ()=>join(pick(PLACES),w('は静かだったが、','はしずかだったが、'),pick(EVENTS),w('急に賑やかになった。','きゅうににぎやかになった。')),
 ()=>join(pick(SUBJECTS),w('は急がず、自分の歩幅で進んだ。','はいそがず、じぶんのほはばですすんだ。')),
 ()=>join(pick(NOUNS),w('を忘れないように、','をわすれないように、'),pick(SUBJECTS),w('は日記に書いた。','はにっきにかいた。')),
 ()=>join(pick(TIMES),pick(PLACES),w('で待っていると、','でまっていると、'),pick(SUBJECTS),w('が姿を見せた。','がすがたをみせた。')),
 ()=>join(pick(SUBJECTS),w('は何度も試した末に、','はなんどもためしたすえに、'),pick(FEELINGS),'。'),
 ()=>join(pick(ADJS),pick(NOUNS),w('に触れるたび、昔の記憶がよみがえる。','にふれるたび、むかしのきおくがよみがえる。')),
 ()=>join(w('天気が良ければ、','てんきがよければ、'),pick(SUBJECTS),'は',pick(PLACES),w('まで歩くつもりだ。','まであるくつもりだ。')),
 ()=>join(w('雨が降っても、','あめがふっても、'),pick(SUBJECTS),w('は約束の場所へ向かう。','はやくそくのばしょへむかう。')),
 ()=>join(pick(SUBJECTS),w('は少し休んでから、もう一度','はすこしやすんでから、もういちど'),pick(ACTIONS),'。'),
 ()=>join(pick(NOUNS),w('は形を変えながら、ゆっくり遠ざかった。','はかたちをかえながら、ゆっくりとおざかった。')),
 ()=>join(pick(PLACES),w('を抜けると、目の前に','をぬけると、めのまえに'),pick(ADJS),pick(NOUNS),w('が広がった。','がひろがった。')),
 ()=>join(pick(SUBJECTS),w('は答えを急がず、しばらく考えることにした。','はこたえをいそがず、しばらくかんがえることにした。')),
 ()=>join(pick(TIMES),pick(EVENTS),pick(SUBJECTS),w('は足を止めてその様子を眺めた。','はあしをとめてそのようすをながめた。')),
 ()=>join(pick(ADJS),pick(NOUNS),w('を見た瞬間、','をみたしゅんかん、'),pick(SUBJECTS),w('の表情が明るくなった。','のひょうじょうがあかるくなった。')),
 ()=>join(pick(SUBJECTS),w('は失敗から学び、次の方法を静かに考えた。','はしっぱいからまなび、つぎのほうほうをしずかにかんがえた。')),
 ()=>join(pick(PLACES),w('には長い歴史があり、今も多くの人が訪れている。','にはながいれきしがあり、いまもおおくのひとがおとずれている。')),
 ()=>join(pick(NOUNS),w('の役割を知ると、身近な景色の見え方が変わる。','のやくわりをしると、みぢかなけしきのみえかたがかわる。')),
 ()=>join(pick(SUBJECTS),w('は周りの意見を聞き、自分の考えを丁寧に伝えた。','はまわりのいけんをきき、じぶんのかんがえをていねいにつたえた。')),
 ()=>join(pick(TIMES),pick(SUBJECTS),w('は今日の目標を決め、順番に作業を進めた。','はきょうのもくひょうをきめ、じゅんばんにさぎょうをすすめた。')),
 ()=>join(pick(EVENTS),w('空気の色まで変わったように感じられた。','くうきのいろまでかわったようにかんじられた。')),
 ()=>join(pick(SUBJECTS),w('は知らない道を選んだが、そこで新しい景色に出会った。','はしらないみちをえらんだが、そこであたらしいけしきにであった。')),
 ()=>join(pick(ADJS),pick(NOUNS),w('の理由を確かめるため、資料を集めて比べてみた。','のりゆうをたしかめるため、しりょうをあつめてくらべてみた。')),
 ()=>join(pick(PLACES),w('で過ごした時間は短かったが、深く心に残った。','ですごしたじかんはみじかかったが、ふかくこころにのこった。')),
 ()=>join(pick(SUBJECTS),w('は昨日できなかったことに挑み、少しだけ前へ進んだ。','はきのうできなかったことにいどみ、すこしだけまえへすすんだ。')),
 ()=>join(pick(TIMES),pick(PLACES),w('を歩いていると、季節の移ろいが細部に感じられた。','をあるいていると、きせつのうつろいがさいぶにかんじられた。')),
 ()=>join(pick(SUBJECTS),w('は静かな場所で考えを整理し、次にすることを一つ決めた。','はしずかなばしょでかんがえをせいりし、つぎにすることをひとつきめた。'))
);

const FIXED_START=[w('朝の光が','あさのひかりが'),w('爽やかな風が','さわやかなかぜが'),w('友達の笑顔が','ともだちのえがおが'),w('丁寧な準備が','ていねいなじゅんびが'),w('日々の練習が','ひびのれんしゅうが'),w('小さな発見が','ちいさなはっけんが'),w('温かい言葉が','あたたかいことばが'),w('新しい挑戦が','あたらしいちょうせんが'),w('静かな音楽が','しずかなおんがくが'),w('季節の変化が','きせつのへんかが')];
const FIXED_END=[w('一日の始まりを知らせた。','いちにちのはじまりをしらせた。'),w('心を少し軽くしてくれた。','こころをすこしかるくしてくれた。'),w('次の一歩を踏み出す力になった。','つぎのいっぽをふみだすちからになった。'),w('いつもの景色を鮮やかに変えた。','いつものけしきをあざやかにかえた。'),w('大切なことを思い出させてくれた。','たいせつなことをおもいださせてくれた。')];
const FIXED:Built[]=FIXED_START.flatMap(a=>FIXED_END.map(b=>join(a,b)));

@Injectable({providedIn:'root'})
export class QuestionGeneratorService {
  private session=new Set<string>(); private recent=new Set<string>(); private lastTemplates:number[]=[];
  constructor(private storage:StorageService) { void storage.recentQuestionKeys().then(x=>this.recent=new Set(x)); }
  resetSession(){this.session.clear();this.lastTemplates=[];}
  async generate(difficulty:Difficulty):Promise<Question>{
    for(let attempt=0;attempt<40;attempt++){
      const eligible=TEMPLATES.map((_,i)=>i).filter(i=>difficulty==='beginner'?(i<7||(i>=20&&i<30)):difficulty==='advanced'?(i>=7&&i<20)||i>=40:true);
      const available=eligible.filter(i=>!this.lastTemplates.includes(i)); const ti=pick(available.length?available:eligible);
      const b=TEMPLATES[ti](difficulty); const key=this.normalize(b.text);
      if(this.valid(b)&&!this.session.has(key)&&!this.recent.has(key)) return this.finish(b,difficulty,'template',`template-${ti}`,key,ti);
    }
    for(const b of FIXED.sort(()=>Math.random()-.5)){const key=this.normalize(b.text);if(!this.session.has(key))return this.finish(b,difficulty,'fixed','fixed',key,-1)}
    const b=TEMPLATES[Math.floor(Math.random()*TEMPLATES.length)](difficulty);return this.finish(b,difficulty,'template','exhausted',this.normalize(b.text)+'-'+Date.now(),-1);
  }
  private finish(b:Built,d:Difficulty,source:'template'|'fixed',templateId:string,key:string,ti:number):Question{this.session.add(key);this.recent.add(key);this.lastTemplates=[...this.lastTemplates.slice(-1),ti];void this.storage.rememberQuestion(key);return{id:crypto.randomUUID(),text:b.text,kana:b.kana,difficulty:d,category:'daily',source,duplicateKey:key,templateId}}
  private valid(b:Built){return b.text.length>3&&b.kana.length>3&&!/[一-龠]/.test(b.kana)&&!b.text.includes('undefined')}
  private normalize(v:string){return v.normalize('NFKC').replace(/[\s。、！？「」0-9]/g,'').toLowerCase()}
}
