import type { BgId, BranchCtx, ChoiceOpt, CharId, EndingId, Expr, Pos, SfxId, Step, T } from './types';

/*
 * Chapter 1 — "어느 날, 케이크 가게에서" / "One Day at the Cake Shop"
 *
 * Every jump target must be listed in LABELS, so a typo in GO()/choice `go`
 * is caught by the type checker instead of breaking the game at runtime.
 * Text placeholders: {name} → player name, {cakeName} → the cake the player built.
 */
const LABELS = [
  'start', 'c1a', 'c1b', 'c1end', 'c2a', 'c2b', 'c2end', 'c3a', 'c3b',
  'hA', 'hB', 'hC', 'hEnd', 'kBest', 'kGood', 'kOdd', 'kEnd', 'qGreat', 'qOkay', 'qOops', 'qEnd',
  'eA', 'eB', 'eEnd', 'endBest', 'endGood', 'endSweet',
] as const;
type Label = (typeof LABELS)[number];

const L = (label: Label): Step => ({ kind: 'label', label });
const BG = (bg: BgId): Step => ({ kind: 'bg', bg });
const SHOW = (chars: Partial<Record<CharId, [Expr, Pos]>>): Step => ({ kind: 'show', chars });
const HIDE: Step = { kind: 'hide' };
const PTS = (k: number, r: number): Step => ({ kind: 'pts', k, r });
const GO = (to: Label): Step => ({ kind: 'go', to });
const BR = (pick: (s: BranchCtx) => Label): Step => ({ kind: 'branch', pick });
const N = (ko: string, en: string, ja: string, sfx?: SfxId): Step => ({ kind: 'say', who: null, text: { ko, en, ja }, sfx });
const R = (e: Expr, ko: string, en: string, ja: string): Step => ({ kind: 'say', who: 'rin', e, text: { ko, en, ja } });
const K = (e: Expr, ko: string, en: string, ja: string): Step => ({ kind: 'say', who: 'kao', e, text: { ko, en, ja } });
const Q = (prompt: T | null, options: (Omit<ChoiceOpt, 'go'> & { go: Label })[]): Step => ({
  kind: 'choice',
  prompt: prompt ?? undefined,
  options,
});
const opt = (ko: string, en: string, ja: string, go: Label, pts: { k?: number; r?: number } = {}) => ({ text: { ko, en, ja }, go, ...pts });
const CAKE: Step = { kind: 'cake' };
const END = (id: EndingId): Step => ({ kind: 'ending', id });

export const SCRIPT: Step[] = [
  L('start'),
  BG('streetDay'),
  N('치도리 고등학교와 키쿄 여자고등학교.\n담장 하나를 사이에 두고 마주한 두 학교는, 사이가 나쁘기로 유명하다.',
    'Chidori High and Kikyo Girls’ High.\nSeparated by a single wall, the two schools are famous for not getting along.', '千鳥高校と桔梗女子高校。\n塀ひとつを隔てて隣り合うふたつの学校は、仲が悪いことで有名だ。'),
  N('그리고 그 담장 가까이에… 작은 케이크 가게가 하나 있다.',
    'And right by that wall… there’s a little cake shop.', 'そして、その塀のすぐそばに… 小さなケーキ屋さんがある。'),
  N('오늘은 {name}의 첫 아르바이트 날.',
    'Today is {name}’s first day on the job.', '今日は{name}のアルバイト初日。'),
  BG('shopFront'),
  N('파란 차양 아래, 따뜻한 불빛이 새어 나오는 가게.\n「파티스리 플레인」— 여기가 오늘부터 일할 곳이다.',
    'Warm light spills out from under a blue awning.\n“Patisserie Plain” — your workplace, starting today.', '青い日よけの下から、あたたかい光がこぼれるお店。\n「パティスリー・プレーン」— 今日からここが働く場所だ。'),
  BG('shop'),
  N('딸랑— 문을 열자 달콤한 버터 냄새가 확 풍겨 온다.',
    'Ding-a-ling— The moment you open the door, the sweet smell of butter washes over you.', 'カランカラン— ドアを開けると、甘いバターの香りがふわっと広がった。', 'bell'),
  SHOW({ rin: ['normal', 'center'] }),
  R('normal', '……어서 와.', '……Welcome.', '……いらっしゃい。'),
  N('카운터 너머에서 금발 머리의 키 큰 남자애가 이쪽을 내려다본다.\n피어싱에 날카로운 눈매… 솔직히 조금 무섭다.',
    'A tall blond boy looks down at you from behind the counter.\nPiercings, sharp eyes… honestly, he’s a little scary.', 'カウンターの向こうから、金髪の背の高い男の子がこちらを見下ろしている。\nピアスに鋭い目つき… 正直、ちょっと怖い。'),
  Q({ ko: '어떻게 인사할까?', en: 'How should I greet him?', ja: 'どうあいさつしよう？' }, [
    opt('(살짝 겁먹으며) 아, 안녕하세요…!', '(A little nervous) H-hello…!', '（ちょっとビクビクしながら）あ、こんにちは…！', 'c1a'),
    opt('(활짝 웃으며) 오늘부터 잘 부탁드려요!', '(With a big smile) I’m looking forward to working with you!', '（にっこり笑って）今日からよろしくお願いします！', 'c1b', { r: 1 }),
  ]),
  L('c1a'),
  R('troubled', '아… 미안. 놀랐지? 얼굴이 원래 이래서.', 'Ah… sorry. Did I scare you? My face just looks like this.', 'あ… ごめん。びっくりした？ 顔、もともとこうだから。'),
  R('smile', '난 츠무기 린타로. 여기, 우리 집 가게야. 편하게 해도 돼.', 'I’m Rintaro Tsumugi. This is my family’s shop. Make yourself at home.', '俺は紬凛太郎。ここ、うちの店なんだ。楽にしていいよ。'),
  GO('c1end'),
  L('c1b'),
  R('surprised', '어…? 아, 응. 나야말로 잘 부탁해.', 'Huh…? Oh, yeah. Same here.', 'え…？ あ、うん。こちらこそよろしく。'),
  R('blush', '처음 보면 다들 좀 겁먹던데… 고마워.', 'Most people get kind of scared the first time they see me… Thanks.', '初めて会うと、みんなちょっと怖がるんだけど… ありがとう。'),
  R('smile', '난 츠무기 린타로. 여기, 우리 집 가게야.', 'I’m Rintaro Tsumugi. This is my family’s shop.', '俺は紬凛太郎。ここ、うちの店なんだ。'),
  L('c1end'),
  R('normal', '오늘은 쇼케이스 정리랑 손님 응대를 같이 해 보자.', 'Today, let’s tidy up the showcase and greet customers together.', '今日はショーケースの整理と接客を一緒にやってみよう。'),
  N('린타로는 케이크를 보석 다루듯 조심조심 옮긴다.\n커다란 손이 의외로 섬세하다.',
    'Rintaro carries each cake as carefully as if it were a jewel.\nThose big hands are surprisingly gentle.', '凛太郎はケーキを宝石みたいに、そっと丁寧に運んでいく。\n大きな手が、意外なほど繊細だ。'),
  Q({ ko: '뭐라고 말을 걸어 볼까?', en: 'What should I say?', ja: 'なんて話しかけよう？' }, [
    opt('케이크 다루는 손길이 엄청 섬세하네요!', 'You handle the cakes so delicately!', 'ケーキの扱い方、すごく丁寧ですね！', 'c2a', { r: 1 }),
    opt('이 케이크들, 전부 직접 만드는 거예요?', 'Do you make all of these yourselves?', 'このケーキ、全部手作りなんですか？', 'c2b'),
  ]),
  L('c2a'),
  R('blush', '…그런 말은 처음 들어 봐.', '…Nobody’s ever told me that before.', '…そんなこと言われたの、初めてだ。'),
  R('smile', '어릴 때부터 계속 가게 일을 도와서 그런가 봐.', 'Maybe it’s because I’ve been helping out here since I was little.', '小さい頃からずっと店を手伝ってたからかな。'),
  GO('c2end'),
  L('c2b'),
  R('smile', '응. 주로 엄마가 만들고, 나도 조금씩 도와.', 'Yeah. My mom makes most of them, and I help out a little.', 'うん。ほとんど母さんが作ってて、俺も少しずつ手伝ってる。'),
  R('normal', '아직 한참 멀었지만.', 'I’ve still got a long way to go, though.', 'まだまだ全然だけどな。'),
  L('c2end'),
  N('딸랑— 문에 달린 종이 맑게 울렸다.', 'Ding-a-ling— The bell on the door rings out clearly.', 'カランカラン— ドアのベルが澄んだ音を立てた。', 'bell'),
  SHOW({ rin: ['surprised', 'left'], kao: ['smile', 'right'] }),
  K('smile', '안녕하세요! 오늘도 왔어요, 린타로 군!', 'Good afternoon! I’m here again, Rintaro-kun!', 'こんにちは！ 今日も来ちゃいました、凛太郎くん！'),
  N('포근한 분홍 니트에 하얀 숄더백, 반짝반짝 빛나는 눈.\n손님은 쇼케이스를 향해 곧장 다가왔다.',
    'A soft pink sweater, a white shoulder bag and sparkling eyes.\nThe customer heads straight for the showcase.', 'ふんわりしたピンクのニットに白いショルダーバッグ、キラキラ輝く瞳。\nお客さんはまっすぐショーケースへやってきた。'),
  R('blush', '와, 와구리 씨. 어서 와.', 'W-Waguri-san. Welcome.', 'わ、和栗さん。いらっしゃい。'),
  K('surprised', '어라? 처음 뵙는 분이네요?', 'Oh? I don’t think we’ve met before?', 'あれ？ はじめましての方ですね？'),
  Q(null, [
    opt('저는 {name}! 오늘부터 여기서 일하게 됐어요!', 'I’m {name}! I just started working here today!', '{name}です！ 今日からここで働くことになりました！', 'c3a', { k: 1 }),
    opt('(린타로를 힐끗 보며) 두 분, 친한 사이인가 봐요?', '(Glancing at Rintaro) You two seem close?', '（凛太郎をちらっと見て）おふたり、仲良しなんですか？', 'c3b', { k: 1 }),
  ]),
  L('c3b'),
  K('blush', '에헤헤… 네! 소중한 친구예요.', 'Ehehe… Yes! He’s a very dear friend.', 'えへへ… はい！ 大切なお友達です。'),
  R('blush', '……', '……', '……'),
  N('린타로의 귀가 새빨개졌다.', 'Rintaro’s ears turn bright red.', '凛太郎の耳が真っ赤になった。'),
  L('c3a'),
  K('smile', '와구리 카오루코예요. 이 가게 케이크의 열렬한 팬이랍니다!', 'I’m Kaoruko Waguri. I’m this shop’s biggest fan!', '和栗薫子です。このお店のケーキの大ファンなんです！'),
  K('happy', '잘 부탁해요, {name} 씨!', 'It’s so nice to meet you, {name}-san!', 'よろしくお願いしますね、{name}さん！'),
  R('normal', '참, 와구리 씨. 부탁이 하나 있는데…', 'Oh, right. Waguri-san, I have a favor to ask…', 'そうだ、和栗さん。ひとつお願いがあるんだけど…'),
  R('smile', '신메뉴 시식을 해 줄 수 있을까? 오늘은 {name} 씨가 처음으로 케이크를 만들어 볼 거거든.',
    'Could you taste-test something new for us? {name}-san is making a cake for the very first time today.', '新メニューの試食、頼めるかな？ 今日は{name}さんが初めてケーキを作るんだ。'),
  K('surprised', '시식이요?! 정말요?!', 'A taste test?! Really?!', '試食ですか？！ 本当ですか？！'),
  K('happy', '기꺼이요! 아니, 꼭 하게 해 주세요!!', 'I’d love to! No — please, let me do it!!', '喜んで！ いえ、ぜひやらせてください！！'),
  N('눈이 반짝반짝… 아니, 거의 빛나고 있다.', 'Her eyes are sparkling… no, practically glowing.', '目がキラキラ… いや、もはや光っている。'),
  Q({ ko: '케이크를 만들기 전에…', en: 'Before making the cake…', ja: 'ケーキを作る前に…' }, [
    opt('와구리 씨는 어떤 케이크를 좋아하세요?', 'What kind of cake do you like, Waguri-san?', '和栗さんは、どんなケーキが好きなんですか？', 'hA', { k: 1 }),
    opt('린타로 군, 와구리 씨 취향 알아요?', 'Rintaro-kun, do you know what she likes?', '凛太郎くん、和栗さんの好み知ってますか？', 'hB', { k: 1, r: 1 }),
    opt('비밀이에요! 기대해 주세요.', 'It’s a secret! Look forward to it.', 'ひみつです！ 楽しみにしててください。', 'hC'),
  ]),
  L('hA'),
  K('smile', '전부 좋아해요!', 'I love them all!', '全部好きです！'),
  K('blush', '…그래도 굳이 고르자면, 폭신폭신한 바닐라 시트에 새하얀 생크림.\n그리고 맨 위에 새빨간 딸기! 그게 최고예요.',
    '…But if I had to choose — a fluffy vanilla sponge with snow-white fresh cream.\nAnd a bright red strawberry on top! That’s the best.', '…でも、あえて選ぶなら、ふわふわのバニラスポンジに真っ白な生クリーム。\nそれから、てっぺんに真っ赤ないちご！ それが最高です。'),
  GO('hEnd'),
  L('hB'),
  R('blush', '어? 아, 그게…', 'Huh? Oh, um…', 'え？ あ、それは…'),
  R('normal', '딸기 쇼트케이크 먹을 때가 제일 행복해 보였어.\n생크림이랑, 폭신한 바닐라 시트.',
    'She always looks happiest eating strawberry shortcake.\nFresh cream, and a fluffy vanilla sponge.', 'いちごのショートケーキを食べてるときが、一番幸せそうだった。\n生クリームと、ふわふわのバニラスポンジ。'),
  K('surprised', '그, 그걸 기억하고 있었어요?!', 'Y-you remembered that?!', 'そ、そんなこと覚えててくれたんですか？！'),
  K('blush', '…부끄럽지만, 정답이에요.', '…It’s embarrassing, but you’re right.', '…恥ずかしいけど、正解です。'),
  GO('hEnd'),
  L('hC'),
  K('happy', '와아, 두근두근해요! 케이크라면 뭐든 좋아하니까요!', 'Wow, my heart’s pounding! I love every kind of cake, after all!', 'わあ、ドキドキします！ ケーキならなんでも大好きですから！'),
  N('옆에서 린타로가 작게 중얼거렸다.', 'Beside you, Rintaro mumbles quietly.', '隣で、凛太郎が小さくつぶやいた。'),
  R('normal', '(…딸기, 좋아하는데.)', '(…She likes strawberries, though.)', '（…いちご、好きなんだけどな。）'),
  L('hEnd'),
  R('smile', '좋아. 그럼 주방으로 가자, {name} 씨.', 'Alright. Let’s head to the kitchen, {name}-san.', 'よし。じゃあ厨房に行こう、{name}さん。'),
  CAKE,
  N('완성된 건 {cakeName}.', 'What you made: {cakeName}.', 'できあがったのは、{cakeName}。'),
  BR(s => (s.cakeScore >= 3 ? 'kBest' : s.cakeScore === 2 ? 'kGood' : 'kOdd')),
  L('kBest'),
  PTS(2, 0),
  K('surprised', '이건…!', 'This is…!', 'これは…！'),
  K('happy', '잘 먹겠습니다!', 'Thank you for the treat!', 'いただきます！'),
  N('한 입. 그리고, 정적.', 'One bite. Then — silence.', 'ひと口。そして、静寂。'),
  K('happy', '………최고예요. 정말, 정말로 최고예요!!', '………It’s perfect. Truly, truly perfect!!', '………最高です。本当に、本当に最高です！！'),
  R('smile', '와구리 씨가 제일 좋아하는 조합 그대로네. 잘 골랐어, {name} 씨.', 'Her favourite combo, exactly. Good pick, {name}-san.', '和栗さんの一番好きな組み合わせ、そのままだな。いい選択だよ、{name}さん。'),
  GO('kEnd'),
  L('kGood'),
  PTS(1, 0),
  K('happy', '음~! 맛있어요! 폭신하고, 달콤하고…', 'Mmm~! It’s delicious! So fluffy, so sweet…', 'ん〜！ おいしいです！ ふわふわで、甘くて…'),
  K('smile', '{name} 씨의 정성이 느껴지는 맛이에요!', 'I can taste all the care you put into it, {name}-san!', '{name}さんの心がこもった味がします！'),
  R('smile', '꽤 괜찮은 조합인데?', 'That’s a pretty nice combo.', 'けっこういい組み合わせじゃん。'),
  GO('kEnd'),
  L('kOdd'),
  K('surprised', '오오… 처음 먹어 보는 조합이에요!', 'Ooh… I’ve never tried this combination before!', 'おお… 初めて食べる組み合わせです！'),
  K('happy', '그치만 맛있어요! 새로운 발견이에요!', 'But it’s delicious! What a discovery!', 'でも、おいしいです！ 新発見です！'),
  R('smile', '와구리 씨는 정말 뭐든 맛있게 먹는다니까.', 'Waguri-san really does enjoy everything she eats.', '和栗さんって、ほんとになんでもおいしそうに食べるよな。'),
  N('조금 엉뚱한 케이크였지만, 행복하게 먹는 얼굴을 보니 마음이 따뜻해졌다.',
    'It may have been a slightly odd cake, but seeing her eat it so happily warms your heart.', 'ちょっと変わったケーキだったけど、幸せそうに食べる顔を見ていたら、心があたたかくなった。'),
  L('kEnd'),
  // how well it was made (the minigame stars), separate from whether it was her favourite
  BR(s => (s.cakeStars >= 3 ? 'qGreat' : s.cakeStars === 2 ? 'qOkay' : 'qOops')),
  L('qGreat'),
  K('blush', '그리고 이 모양 좀 보세요… 너무 예뻐서 먹기 아까울 정도예요!', 'And just look at it… It’s so pretty I almost didn’t want to eat it!', 'それに、この見た目… かわいすぎて、食べるのがもったいないくらいです！'),
  R('smile', '굽기도, 크림도 완벽했어. 솔직히 나보다 잘하는 것 같은데.', 'The bake, the cream — all perfect. Honestly, you might be better at this than me.', '焼き加減も、クリームも完璧だった。正直、俺より上手いかも。'),
  GO('qEnd'),
  L('qOkay'),
  R('normal', '크림이 살짝 고르지 않긴 한데… 그건 연습하면 금방 늘어.', 'The cream’s a little uneven… but that gets better fast with practice.', 'クリームがちょっとムラになってるけど… それは練習すればすぐ上達するよ。'),
  K('smile', '다음엔 더 예쁘게 만들 수 있을 거예요! 저 또 먹으러 올게요.', 'You’ll make it even prettier next time! I’ll come back to taste it.', '次はもっときれいに作れますよ！ また食べに来ますね。'),
  GO('qEnd'),
  L('qOops'),
  K('smile', '후후, 조금 삐뚤빼뚤하지만… 그래서 더 특별한 것 같아요.', 'Hehe, it’s a little wobbly… but that makes it feel even more special.', 'ふふ、ちょっとでこぼこだけど… だからこそ特別な感じがします。'),
  R('troubled', '처음엔 다 그래. 실수는 누구나 하는 거야.\n나도 첫날에 시트 한 판을 통째로 태웠거든.', 'Everyone’s like that at first. We all make mistakes.\nI burnt a whole tray of sponges on my first day.', '最初はみんなそうだよ。失敗は誰にでもある。\n俺なんて初日に、天板一枚分のスポンジを丸ごと焦がしたし。'),
  K('surprised', '네?! 린타로 군이요?', 'What?! You did, Rintaro-kun?', 'えっ？！ 凛太郎くんがですか？'),
  R('blush', '…비밀로 해 줘.', '…Keep that a secret.', '…ないしょにしといて。'),
  K('happy', '{name} 씨, 다음엔 더 잘할 수 있어요! 그때도 제가 시식 담당 할게요!', 'You’ll do even better next time, {name}-san! I’ll be your taste tester again!', '{name}さん、次はもっと上手にできますよ！ そのときも、わたしが試食係しますね！'),
  R('smile', '응. 다음엔 같이 제대로 만들어 보자.', 'Yeah. Next time, let’s get it right together.', 'うん。次は一緒にちゃんと作ろう。'),
  L('qEnd'),
  HIDE,
  BG('street'),
  N('해 질 무렵.\n가게 일을 마치고, 카오루코를 배웅하러 담장 앞까지 함께 나왔다.',
    'Around sunset.\nAfter your shift, you walk Kaoruko out as far as the wall.', '夕暮れどき。\nバイトを終えて、薫子さんを見送りに塀の前まで一緒に出てきた。'),
  SHOW({ rin: ['normal', 'left'], kao: ['smile', 'right'] }),
  K('smile', '오늘 정말 즐거웠어요. 케이크도, 이야기도.', 'Today was so much fun. The cake, and all the talking, too.', '今日は本当に楽しかったです。ケーキも、おしゃべりも。'),
  K('normal', '있잖아요, {name} 씨.\n처음에 린타로 군 보고, 조금 무섭다고 생각하지 않았어요?',
    'Hey, {name}-san.\nWhen you first saw Rintaro-kun, didn’t you think he was a little scary?', 'ねえ、{name}さん。\n最初に凛太郎くんを見たとき、ちょっと怖いって思いませんでした？'),
  Q(null, [
    opt('솔직히… 조금요.', 'Honestly… a little.', '正直… ちょっとだけ。', 'eA', { k: 1 }),
    opt('아뇨, 처음부터 상냥해 보였어요!', 'No, he looked kind from the very start!', 'いいえ、最初から優しそうに見えました！', 'eB', { r: 1 }),
  ]),
  L('eA'),
  K('smile', '후후, 다들 그렇게 말해요.', 'Hehe, everyone says that.', 'ふふっ、みんなそう言うんです。'),
  K('normal', '그치만 린타로 군은 누구보다 상냥한 사람이에요.\n겉모습만 봐서는 절대 모르죠.',
    'But Rintaro-kun is kinder than anyone.\nYou’d never know just by looking at him.', 'でも凛太郎くんは、誰よりも優しい人なんですよ。\n見た目だけじゃ、絶対わからないですよね。'),
  R('blush', '와구리 씨…', 'Waguri-san…', '和栗さん…'),
  GO('eEnd'),
  L('eB'),
  R('surprised', '…진짜?', '…Really?', '…ほんとに？'),
  K('happy', '역시! 알아봐 주는 사람이 있어서 기뻐요.', 'I knew it! I’m so glad someone else can see it too.', 'やっぱり！ わかってくれる人がいて、うれしいです。'),
  R('blush', '둘 다… 그만해. 부끄러우니까.', 'You two… stop it. It’s embarrassing.', 'ふたりとも… もうやめて。恥ずかしいから。'),
  L('eEnd'),
  K('normal', '치도리랑 키쿄는 담장 하나 사이인데도, 서로를 잘 모르잖아요.',
    'Chidori and Kikyo are only a wall apart, but we hardly know each other.', '千鳥と桔梗は塀ひとつ隔てただけなのに、お互いのことをよく知らないですよね。'),
  K('smile', '그래도 이렇게 같은 케이크를 먹고, 같이 웃을 수 있어요.',
    'Even so, we can eat the same cake and laugh together, just like this.', 'それでも、こうして同じケーキを食べて、一緒に笑うことができるんです。'),
  R('smile', '…응. 담장 같은 건, 생각보다 별거 아닐지도 몰라.', '…Yeah. Maybe a wall isn’t such a big deal after all.', '…うん。塀なんて、思ってたほど大したものじゃないのかもな。'),
  N('노을빛 속에서, 담장 아래 도라지꽃이 바람에 살랑 흔들렸다.',
    'In the glow of the sunset, the bellflowers beneath the wall sway gently in the breeze.', '夕焼けの中、塀の下の桔梗の花が風にそっと揺れていた。'),
  BR(s => (s.k + s.r >= 6 ? 'endBest' : s.k + s.r >= 3 ? 'endGood' : 'endSweet')),
  L('endBest'),
  K('happy', '{name} 씨, 다음에도 또 케이크 만들어 줄 거죠? 약속이에요!', '{name}-san, you’ll make me cake again next time, right? It’s a promise!', '{name}さん、次もまたケーキ作ってくれますよね？ 約束ですよ！'),
  R('smile', '다음엔 셋이서 같이 신메뉴 만들어 보자.', 'Next time, let’s come up with a new menu item — all three of us.', '次は三人で一緒に新メニューを考えよう。'),
  END('best'),
  L('endGood'),
  K('smile', '또 올게요! 다음엔 어떤 케이크가 있을지 기대돼요.', 'I’ll come again! I can’t wait to see what cakes you’ll have next time.', 'また来ます！ 次はどんなケーキがあるのか楽しみです。'),
  R('smile', '수고했어, {name} 씨. 내일도 잘 부탁해.', 'Good work today, {name}-san. See you tomorrow.', 'おつかれさま、{name}さん。明日もよろしく。'),
  END('good'),
  L('endSweet'),
  R('normal', '처음이라 힘들었지? 나도 처음엔 크림 엄청 망쳤어.', 'First days are tough, huh? I totally ruined the cream when I started, too.', '初日は大変だったろ？ 俺も最初はクリームめちゃくちゃにしたよ。'),
  K('smile', '다음엔 분명 더 맛있을 거예요. 응원할게요!', 'Next time it’ll be even tastier, I’m sure. I’m rooting for you!', '次はきっと、もっとおいしくなりますよ。応援してます！'),
  END('sweet'),
];

export const LABEL_INDEX: Record<string, number> = Object.fromEntries(
  SCRIPT.flatMap((st, i) => (st.kind === 'label' ? [[st.label, i]] : [])),
);

if (import.meta.env.DEV) {
  const missing = LABELS.filter(l => !(l in LABEL_INDEX));
  if (missing.length) console.error('[story] labels declared but never placed:', missing);
}
