import { Document, Page, View, Text, Image, Link, Svg, Path, Polygon, Circle, Defs, RadialGradient, Stop, Font, StyleSheet } from '@react-pdf/renderer';
import { PILLARS } from '../../data/aoh';
import { PILLAR_COPY, KIND_LABEL, bandOf, BAND_LABEL, pickPractices, TOOLKIT, IN_NORMA, GLANCE, type Kind, type ReportInput } from './content';

// The Fulfilment Report: an A4 PDF made in the browser from the check-in
// answers, with the reader's name on it. Nothing is sent anywhere to make it.
// Layout only; every word is in content.ts. The look follows the nørma app:
// cream pages, the app's pentagon, and each pillar in its own colour.

const C = {
  deep: '#0F2015', paper: '#FAF8F0', cream: '#F4F2E6', lime: '#D9EA6E', limeFill: '#E3EE92', limeLine: '#7A9A22', limeSoft: '#EEF3CC',
  olive: '#4A6B3A', ink: '#16241A', muted: '#5D675F', line: '#E3E0D0', ring: '#D8D5C4', onDark: '#F6F4E9', dim: '#A9B5A6',
};
/** Per pillar, beside its tint (PILLARS[i].tint): a mid tone for bars and dots, and an ink for icons, as in the app. */
const PC = [
  { mid: '#7CC690', ink: '#2F6B45' },
  { mid: '#A39BE3', ink: '#4F4790' },
  { mid: '#E3978B', ink: '#9A4A3E' },
  { mid: '#E6BE70', ink: '#86601C' },
  { mid: '#7BBFD1', ink: '#2A6A7C' },
];
const SHORT = ['Health', 'Internal', 'Love', 'Social', 'Flow'];
const ANSWERS = ['No', 'Not really', 'Mostly', 'Yes'];
/** The check-in's lines use straight apostrophes; print them curly. */
const curly = (x: string) => x.replace(/'/g, '’');

/** One glyph per kind of practice, in the site's icon style. */
const KIND_ICON: Record<Kind, string[]> = {
  now: ['M3 9h11a3 3 0 1 0-3-3', 'M3 15h15a3 3 0 1 1-3 3', 'M3 12h7'],
  day: ['M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z', 'M12 2.5v2', 'M12 19.5v2', 'M2.5 12h2', 'M19.5 12h2', 'M5.3 5.3l1.4 1.4', 'M17.3 17.3l1.4 1.4', 'M5.3 18.7l1.4-1.4', 'M17.3 6.7l1.4-1.4'],
  week: ['M4 6.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z', 'M4 10h16', 'M8.5 3v3', 'M15.5 3v3'],
  once: ['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z', 'M8 12.5l2.8 2.8L16 10'],
  month: ['M12 3l8.5 6.2-3.2 10H6.7L3.5 9.2z', 'M12 8l4 2.9-1.5 4.6h-5L8 10.9z'],
};

let fontsFor = '';
/** Fonts load from `base` (the site's /report/ folder, or a file path in tests). */
export function registerFonts(base: string) {
  if (fontsFor === base) return;
  fontsFor = base;
  const f = (n: string) => `${base}fonts/${n}.woff`;
  Font.register({ family: 'DM Sans', fonts: [
    { src: f('dm-sans-latin-400-normal'), fontWeight: 400 },
    { src: f('dm-sans-latin-400-italic'), fontWeight: 400, fontStyle: 'italic' },
    { src: f('dm-sans-latin-500-normal'), fontWeight: 500 },
    { src: f('dm-sans-latin-600-normal'), fontWeight: 600 },
  ] });
  Font.register({ family: 'DM Serif Display', fonts: [
    { src: f('dm-serif-display-latin-400-normal') },
    { src: f('dm-serif-display-latin-400-italic'), fontStyle: 'italic' },
  ] });
  Font.registerHyphenationCallback((w) => [w]);
}

const s = StyleSheet.create({
  page: { backgroundColor: C.paper, color: C.ink, fontFamily: 'DM Sans', fontSize: 10.2, lineHeight: 1.5, paddingTop: 46, paddingBottom: 58, paddingHorizontal: 48 },
  dark: { backgroundColor: C.deep, color: C.onDark },
  label: { fontSize: 9, fontWeight: 600, color: C.olive },
  h1: { fontFamily: 'DM Serif Display', fontSize: 44, lineHeight: 1.06, letterSpacing: -0.4 },
  h2: { fontFamily: 'DM Serif Display', fontSize: 27, lineHeight: 1.12, letterSpacing: -0.2 },
  h3: { fontFamily: 'DM Serif Display', fontSize: 15.5, lineHeight: 1.2 },
  lead: { fontSize: 11.6, lineHeight: 1.5, color: C.muted },
  body: { fontSize: 10.2, lineHeight: 1.55, color: C.muted },
  small: { fontSize: 8.6, lineHeight: 1.45, color: C.muted },
  foot: { position: 'absolute', left: 48, right: 48, top: 806, flexDirection: 'row', justifyContent: 'space-between', fontSize: 7.4, color: C.muted },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 0.7, borderColor: C.line, padding: 16 },
});

/* ---------- small pieces ---------- */

const Icon = ({ paths, size = 14, color = C.deep, width = 1.7 }: { paths: readonly string[]; size?: number; color?: string; width?: number }) => (
  <Svg viewBox="0 0 24 24" width={size} height={size}>
    {paths.map((d, i) => <Path key={i} d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />)}
  </Svg>
);

/** A pillar's disc, as the app draws it: its tint, a white ring, the icon in the pillar's ink. */
const Disc = ({ i, size = 30, ring = true }: { i: number; size?: number; ring?: boolean }) => (
  <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: PILLARS[i].tint, borderWidth: ring ? Math.max(1.2, size * 0.045) : 0, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
    <Icon paths={PILLARS[i].paths} size={size * 0.5} color={PC[i].ink} />
  </View>
);

/** A soft round glow, fading out from the centre. Keep it inside the page: an
 *  element that reaches past the bottom starts a new page. */
let glows = 0;
const Glow = ({ x, y, r, color = C.lime, o = 0.35 }: { x: number; y: number; r: number; color?: string; o?: number }) => {
  const id = `glow${++glows}`;
  return (
    <Svg width={2 * r} height={2 * r} viewBox={`0 0 ${2 * r} ${2 * r}`} style={{ position: 'absolute', left: x - r, top: y - r }}>
      <Defs>
        <RadialGradient id={id} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={color} stopOpacity={o} />
          <Stop offset="55%" stopColor={color} stopOpacity={o * 0.4} />
          <Stop offset="100%" stopColor={color} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={r} cy={r} r={r} fill={`url(#${id})`} />
    </Svg>
  );
};

const Foot = ({ name }: { name: string }) => (
  <View style={s.foot} fixed>
    <Text>Fulfilment Report · {name}</Text>
    <Text render={({ pageNumber, totalPages }) => `The Artistry of Humanity · ${pageNumber} / ${totalPages}`} />
  </View>
);

/** The app's pentagon: an outline, faint rings, the reader's shape in lime with
 *  a dot per pillar, the overall score in the middle and a disc at each corner. */
const Pentagon = ({ scores, overall, size }: { scores: number[]; overall: number; size: number }) => {
  const c = size / 2, R = size * 0.33;
  const pt = (i: number, r: number) => {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    return [c + r * Math.cos(a), c + r * Math.sin(a)];
  };
  const pts = (r: (i: number) => number) => [0, 1, 2, 3, 4].map((i) => pt(i, r(i)).map((v) => v.toFixed(2)).join(',')).join(' ');
  const at = (i: number) => R * Math.max(scores[i], 4) / 100;
  const disc = size * 0.125;
  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Polygon points={pts(() => R)} fill="#FFFFFF" fillOpacity={0.55} stroke={C.ring} strokeWidth={1.3} strokeLinejoin="round" />
        {[0.25, 0.5, 0.75].map((k) => <Polygon key={k} points={pts(() => R * k)} fill="none" stroke={C.ring} strokeOpacity={0.55} strokeWidth={0.6} />)}
        <Polygon points={pts(at)} fill={C.limeFill} fillOpacity={0.92} stroke={C.limeLine} strokeWidth={2} strokeLinejoin="round" />
        {scores.map((v, i) => { const [x, y] = pt(i, at(i)); return <Circle key={i} cx={x} cy={y} r={size * 0.012} fill={PC[i].mid} stroke="#FFFFFF" strokeWidth={1.2} />; })}
      </Svg>
      <View style={{ position: 'absolute', left: 0, right: 0, top: c - size * 0.1, alignItems: 'center' }}>
        <Text style={{ fontFamily: 'DM Serif Display', fontSize: size * 0.17, lineHeight: 1, color: C.ink }}>{overall}</Text>
      </View>
      {scores.map((v, i) => {
        const [x, y] = pt(i, R + disc * 0.55);
        return (
          <View key={i} style={{ position: 'absolute', left: x - disc / 2, top: y - disc / 2 }}>
            <Disc i={i} size={disc} />
          </View>
        );
      })}
    </View>
  );
};

const Bar = ({ v, i, h = 7 }: { v: number; i: number; h?: number }) => (
  <View style={{ height: h, borderRadius: h / 2, backgroundColor: PILLARS[i].tint + '40' }}>
    <View style={{ width: `${Math.max(v, 3)}%`, height: h, borderRadius: h / 2, backgroundColor: PC[i].mid }} />
  </View>
);

/** An answer on the four-step scale: three segments, filled to the answer. */
const Scale = ({ a, i }: { a: number; i: number }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    {[1, 2, 3].map((k) => <View key={k} style={{ width: 15, height: 5, borderRadius: 3, marginRight: 2.5, backgroundColor: a >= k ? PC[i].mid : '#E7E4D4' }} />)}
    <Text style={{ marginLeft: 5, fontSize: 7.8, fontWeight: 600, color: C.ink }}>{a < 0 ? 'Skipped' : ANSWERS[a]}</Text>
  </View>
);

/** A small round icon for a kind of practice. */
const KindDisc = ({ kind, bg, color, size = 26 }: { kind: Kind; bg: string; color: string; size?: number }) => (
  <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
    <Icon paths={KIND_ICON[kind]} size={size * 0.52} color={color} width={1.8} />
  </View>
);

/* ---------- pages ---------- */

const Cover = ({ d }: { d: ReportInput }) => {
  const date = d.date.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  // Two lines at most, or the cover runs onto a second page.
  const size = d.name.length <= 12 ? 44 : d.name.length <= 20 ? 36 : d.name.length <= 30 ? 28 : 23;
  return (
    <Page size="A4" style={[s.page, { paddingTop: 44 }]}>
      <Glow x={500} y={90} r={340} o={0.5} />
      <Glow x={40} y={520} r={230} o={0.28} />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image src={d.base + 'aoh-logo.png'} style={{ width: 28, height: 28, borderRadius: 7 }} />
        <Text style={{ marginLeft: 9, fontSize: 9, fontWeight: 600 }}>The Artistry of Humanity</Text>
      </View>
      <View style={{ marginTop: 54 }}>
        <Text style={s.label}>Your Fulfilment Report</Text>
        <Text style={[s.h1, { marginTop: 12, fontSize: size }]}>{d.name}, here’s where you are right now.</Text>
        <Text style={[s.lead, { marginTop: 14, maxWidth: 390 }]}>Your answers from the Fulfilment check-in, across the Five Pillars, with what they’re telling you and where to start.</Text>
      </View>
      <View style={{ alignItems: 'center', marginTop: 14 }}>
        <Pentagon scores={d.scores} overall={d.overall} size={352} />
        <Text style={[s.small, { marginTop: -14 }]}>Your overall fulfilment, out of 100</Text>
        <View style={{ flexDirection: 'row', marginTop: 18 }}>
          {d.scores.map((v, i) => (
            <View key={i} style={{ width: 70, alignItems: 'center' }}>
              <Text style={{ fontFamily: 'DM Serif Display', fontSize: 19, lineHeight: 1 }}>{v}</Text>
              <Text style={{ marginTop: 3, fontSize: 8, color: C.muted }}>{SHORT[i]}</Text>
              <View style={{ marginTop: 5, width: 26, height: 3, borderRadius: 2, backgroundColor: PC[i].mid }} />
            </View>
          ))}
        </View>
      </View>
      <View style={{ position: 'absolute', left: 48, right: 48, bottom: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <View>
          <Text style={{ fontSize: 8, color: C.muted }}>Prepared for</Text>
          <Text style={{ fontSize: 11, fontWeight: 600, marginTop: 2 }}>{d.name}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 8, color: C.muted }}>Check-in taken</Text>
          <Text style={{ fontSize: 11, fontWeight: 600, marginTop: 2 }}>{date}</Text>
        </View>
      </View>
    </Page>
  );
};

const Glance = ({ d }: { d: ReportInput }) => {
  const weakest = d.scores.indexOf(Math.min(...d.scores));
  const strongest = d.scores.indexOf(Math.max(...d.scores));
  // "You're in motion, but stretched. A few honest …" → a headline with the name, and the rest.
  const tone = curly(d.tone);
  const cut = tone.indexOf('. ');
  const headline = tone.charAt(0).toLowerCase() + tone.slice(1, cut + 1);
  const rest = tone.slice(cut + 2);
  const pair = (i: number, label: string, text: string, k: number) => (
    <View style={[s.card, { flex: 1, marginLeft: k ? 8 : 0, marginRight: k ? 0 : 8, backgroundColor: PILLARS[i].tint + '30', borderColor: PILLARS[i].tint + '90', flexDirection: 'row' }]}>
      <Disc i={i} size={30} />
      <View style={{ flex: 1, marginLeft: 11 }}>
        <Text style={[s.label, { color: PC[i].ink }]}>{label}</Text>
        <Text style={[s.h3, { marginTop: 3 }]}>{PILLARS[i].name}</Text>
        <Text style={[s.small, { marginTop: 4 }]}>{text}</Text>
      </View>
    </View>
  );
  return (
    <Page size="A4" style={s.page}>
      <Text style={s.label}>At a glance</Text>
      <View style={{ flexDirection: 'row', marginTop: 14, alignItems: 'center' }}>
        <View style={{ width: 118 }}>
          <Text style={{ fontFamily: 'DM Serif Display', fontSize: 76, lineHeight: 1 }}>{d.overall}</Text>
          <Text style={[s.small, { marginTop: 7 }]}>Overall fulfilment, out of 100</Text>
        </View>
        <View style={{ flex: 1, paddingLeft: 22 }}>
          <Text style={[s.h2, d.name.length > 20 ? { fontSize: 21 } : {}]}>{d.name}, {headline}</Text>
          <Text style={[s.lead, { marginTop: 10 }]}>{rest}</Text>
        </View>
      </View>

      <View style={[s.card, { marginTop: 22, paddingVertical: 6 }]}>
        {d.scores.map((v, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 7.5, borderTopWidth: i ? 0.6 : 0, borderTopColor: C.line }}>
            <Disc i={i} size={28} ring={false} />
            <View style={{ width: 150, marginLeft: 11 }}>
              <Text style={{ fontSize: 10.4, fontWeight: 600 }}>{PILLARS[i].name}</Text>
              <Text style={{ fontSize: 7.8, color: C.muted, marginTop: 1 }}>{BAND_LABEL[bandOf(v)]}{i === weakest ? <Text style={{ color: C.olive, fontWeight: 600 }}> · Start here</Text> : ''}</Text>
            </View>
            <View style={{ flex: 1, marginHorizontal: 12 }}><Bar v={v} i={i} /></View>
            <Text style={{ width: 26, textAlign: 'right', fontFamily: 'DM Serif Display', fontSize: 18 }}>{v}</Text>
          </View>
        ))}
      </View>

      <View style={{ flexDirection: 'row', marginTop: 14 }}>
        {pair(strongest, 'Strongest', 'Something you are already doing well. Protect it: it keeps the cup filling when other parts of life get hard.', 0)}
        {pair(weakest, 'Needs attention', curly(d.weakHint), 1)}
      </View>

      <Text style={[s.label, { marginTop: 22 }]}>How to use this report</Text>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        {[
          ['Read your pillars', 'One page each, starting with the one that needs you most. Each shows your four answers and what they point to.'],
          ['Pick one thing', 'Every page ends with a few things to try. Choose one, not all of them. Small and consistent beats big and brief.'],
          ['Check in again', 'Take the check-in again in a month and compare. If you can see it, you can manage it.'],
        ].map(([t, b], k) => (
          <View key={k} style={{ flex: 1, marginRight: k < 2 ? 16 : 0 }}>
            <Text style={{ fontFamily: 'DM Serif Display', fontSize: 24, lineHeight: 1, color: C.limeLine }}>{k + 1}</Text>
            <Text style={{ fontSize: 10.4, fontWeight: 600, marginTop: 6 }}>{t}</Text>
            <Text style={[s.small, { marginTop: 3 }]}>{b}</Text>
          </View>
        ))}
      </View>
      <View style={{ marginTop: 18, paddingTop: 12, borderTopWidth: 0.6, borderTopColor: C.line, flexDirection: 'row' }}>
        <Text style={[s.small, { flex: 1, paddingRight: 20, fontStyle: 'italic', color: C.ink }]}>“{GLANCE.quote}”{'\n'}<Text style={{ fontStyle: 'normal', color: C.muted }}>The Artistry of Humanity Workbook</Text></Text>
        <Text style={[s.small, { flex: 1, fontSize: 7.8 }]}>{GLANCE.support}</Text>
      </View>
      <Foot name={d.name} />
    </Page>
  );
};

const PillarPage = ({ d, i, rank }: { d: ReportInput; i: number; rank: number }) => {
  const P = PILLARS[i], copy = PILLAR_COPY[i], v = d.scores[i], band = bandOf(v);
  const practices = pickPractices(i, d.answers[i], d.relationship);
  return (
    <Page size="A4" style={[s.page, { paddingTop: 0 }]}>
      <View style={{ marginHorizontal: -48, paddingHorizontal: 48, paddingTop: 30, paddingBottom: 18, backgroundColor: P.tint + '55', position: 'relative' }}>
        <Text style={[s.label, { color: PC[i].ink }]}>Pillar {i + 1} of 5{rank === 0 ? '  ·  Start here' : ''}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14 }}>
          <Disc i={i} size={52} />
          <Text style={[s.h2, { flex: 1, marginLeft: 14, fontSize: 31 }]}>{P.name}</Text>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontFamily: 'DM Serif Display', fontSize: 52, lineHeight: 1 }}>{v}</Text>
            <Text style={{ fontFamily: 'DM Serif Display', fontStyle: 'italic', fontSize: 11, color: PC[i].ink, marginTop: 2 }}>{BAND_LABEL[band]}</Text>
          </View>
        </View>
        <View style={{ marginTop: 12 }}><Bar v={v} i={i} h={6} /></View>
        <Text style={{ marginTop: 12, fontFamily: 'DM Serif Display', fontStyle: 'italic', fontSize: 12.5, lineHeight: 1.3 }}>“{copy.quote}”<Text style={{ fontFamily: 'DM Sans', fontStyle: 'normal', fontSize: 7.6, color: C.muted }}>{'   '}The Artistry of Humanity Workbook</Text></Text>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <View style={{ flex: 1, paddingRight: 22 }}>
          <Text style={s.label}>What this pillar is</Text>
          <Text style={[s.body, { marginTop: 5, color: C.ink }]}>{copy.what}</Text>
          <Text style={[s.label, { marginTop: 14 }]}>What your score is telling you</Text>
          <Text style={[s.body, { marginTop: 5 }]}>{copy.bands[band]}</Text>
        </View>
        <View style={[s.card, { width: 205, padding: 14, backgroundColor: P.tint + '1F', borderColor: P.tint + '80' }]}>
          <Text style={[s.label, { color: PC[i].ink }]}>What you told us</Text>
          {d.questions[i].map((q, k) => (
            <View key={k} style={{ marginTop: 9 }}>
              <Text style={{ fontSize: 8.4, lineHeight: 1.35, color: C.ink }}>{q}</Text>
              <View style={{ marginTop: 4 }}><Scale a={d.answers[i][k]} i={i} /></View>
            </View>
          ))}
        </View>
      </View>

      <Text style={[s.label, { marginTop: 20 }]}>{band === 'high' ? 'Keep it going' : 'Things to try'}</Text>
      <View style={{ marginTop: 8 }}>
        {practices.map((p, k) => (
          <View key={k} wrap={false} style={[s.card, { flexDirection: 'row', marginTop: k ? 7 : 0, paddingVertical: 11, paddingHorizontal: 14 }]}>
            <KindDisc kind={p.kind} bg={P.tint + '66'} color={PC[i].ink} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 10.8, fontWeight: 600, flex: 1, paddingRight: 8 }}>{p.title}</Text>
                <Text style={{ fontSize: 7.6, fontWeight: 600, color: PC[i].ink }}>{KIND_LABEL[p.kind]}</Text>
              </View>
              <Text style={[s.small, { marginTop: 2, fontSize: 8.8 }]}>{p.text}</Text>
            </View>
          </View>
        ))}
      </View>
      <Foot name={d.name} />
    </Page>
  );
};

const Toolkit = ({ d }: { d: ReportInput }) => (
  <Page size="A4" style={s.page}>
    <Glow x={540} y={40} r={240} o={0.3} />
    <Text style={s.label}>{TOOLKIT.eyebrow}</Text>
    <Text style={[s.h2, { marginTop: 10, maxWidth: 440 }]}>{TOOLKIT.title}</Text>
    <Text style={[s.lead, { marginTop: 12, maxWidth: 450 }]}>{TOOLKIT.lead}</Text>
    <View style={{ marginTop: 16 }}>
      {TOOLKIT.tools.map((t, k) => (
        <View key={k} wrap={false} style={{ flexDirection: 'row', paddingVertical: 10, borderTopWidth: 0.6, borderTopColor: C.line }}>
          <KindDisc kind={t.kind} bg={C.limeSoft} color={C.olive} size={30} />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={{ fontSize: 7.8, fontWeight: 600, color: C.olive }}>{KIND_LABEL[t.kind]}</Text>
            <Text style={[s.h3, { fontSize: 14, marginTop: 2 }]}>{t.title}</Text>
            <Text style={[s.small, { marginTop: 3, fontSize: 9 }]}>{t.text}</Text>
          </View>
        </View>
      ))}
    </View>
    <Foot name={d.name} />
  </Page>
);

const Phone = ({ src, w }: { src: string; w: number }) => (
  <View style={{ width: w, borderRadius: w * 0.11, borderWidth: 3, borderColor: '#0B170F', overflow: 'hidden', backgroundColor: '#0B170F' }}>
    <Image src={src} style={{ width: w - 6, height: (w - 6) * (1688 / 780), borderRadius: w * 0.1 }} />
  </View>
);

/** The leaders' side, in the website's icons: heard, valued, safe to speak. */
const CULTURE_ICONS = [
  ['M7 9.2a5.4 5.4 0 0 1 10.8 0c0 3.1-2.3 4.2-3.1 6.2-.6 1.6-.9 4.1-3.5 4.1-1.4 0-2.4-.8-2.9-2', 'M10.4 9.6a2.2 2.2 0 0 1 4.4 0c0 1.4-1 1.9-1.6 2.9'],
  ['M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 16.9l-5.3 2.8 1.1-5.9-4.3-4.1 5.9-.8z'],
  ['M12 3.5l7 3v5.5c0 4.5-3 7.6-7 8.5-4-.9-7-4-7-8.5V6.5z', 'M9 12l2 2 4-4'],
];

const ARROW = ['M5 12h14', 'M13 6l6 6-6 6'];

/** nørma, introduced as joinnorma.com does: its opening line, then "The problem
 *  has two sides. So does nørma." with the site's two cards. */
const NormaIntro = ({ d }: { d: ReportInput }) => {
  const side = (dark: boolean, icons: { paths: readonly string[]; color: string }[], eyebrow: string, title: string, text: string, link: string, to: string) => (
    <Link src={to} style={{ flex: 1, textDecoration: 'none', marginLeft: dark ? 7 : 0, marginRight: dark ? 0 : 7 }}>
      <View style={{ height: 238, borderRadius: 24, padding: 22, backgroundColor: dark ? C.deep : '#ECE8D7', borderWidth: dark ? 0 : 0.7, borderColor: '#E0DBC6' }}>
        <View style={{ flexDirection: 'row' }}>
          {icons.map((ic, k) => (
            <View key={k} style={{ width: 27, height: 27, borderRadius: 14, marginRight: 4.5, backgroundColor: dark ? '#26382B' : '#16261B', alignItems: 'center', justifyContent: 'center' }}>
              <Icon paths={ic.paths} size={13} color={ic.color} width={1.8} />
            </View>
          ))}
        </View>
        <View style={{ marginTop: 'auto' }}>
          <Text style={{ fontSize: 8, fontWeight: 600, letterSpacing: 1.6, color: dark ? C.dim : C.muted }}>{eyebrow.toUpperCase()}</Text>
          <Text style={[s.h2, { fontSize: 23, marginTop: 6, color: dark ? C.onDark : C.ink }]}>{title}</Text>
          <Text style={[s.small, { fontSize: 9.4, marginTop: 8, color: dark ? C.dim : C.muted }]}>{text}</Text>
          <View style={{ marginTop: 14, flexDirection: 'row', alignItems: 'center' }}>
            <Icon paths={ARROW} size={12} color={dark ? C.lime : C.ink} width={2} />
            <Text style={{ marginLeft: 6, fontSize: 10, fontWeight: 600, color: dark ? C.lime : C.ink }}>{link}</Text>
          </View>
        </View>
      </View>
    </Link>
  );
  return (
    <Page size="A4" style={s.page}>
      <Glow x={70} y={110} r={250} o={0.32} />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image src={d.base + 'norma-logo.png'} style={{ width: 30, height: 30, borderRadius: 8 }} />
        <Text style={{ marginLeft: 10, fontSize: 11, fontWeight: 600 }}>nørma</Text>
      </View>
      <Text style={[s.h1, { marginTop: 70, maxWidth: 430 }]}>Nobody leaves their life at the door.</Text>
      <Text style={[s.lead, { marginTop: 18, maxWidth: 430 }]}>nørma is an app for your people and a dashboard for you. They see where their life is at. You see where your culture is at, and what to do about it.</Text>
      <Text style={[s.h3, { marginTop: 64, fontSize: 20, textAlign: 'center' }]}>The problem has two sides. So does nørma.</Text>
      <View style={{ marginTop: 52, position: 'relative' }}>
        <Image src={d.base + 'norma-point.png'} style={{ position: 'absolute', left: 30, top: -50, width: 56, height: 75, transform: 'rotate(-7deg)' }} />
        <View style={{ flexDirection: 'row' }}>
          {side(false, PILLARS.map((p, i) => ({ paths: p.paths, color: PILLARS[i].tint })), 'Your people', 'Personal fulfilment', 'The five pillars of a whole life. This becomes their Fulfilment.', 'Their side', '#their-side')}
          {side(true, CULTURE_ICONS.map((paths) => ({ paths, color: C.onDark })), 'Leaders', 'Workplace culture', 'Heard, valued, safe to speak. This becomes your Culture.', 'Your side', '#your-side')}
        </View>
      </View>
      <Text style={[s.h3, { marginTop: 26, fontSize: 17, textAlign: 'center' }]}>Together, they make the nørma Score.</Text>
      <Foot name={d.name} />
    </Page>
  );
};

const NormaPeople = ({ d }: { d: ReportInput }) => (
  <Page size="A4" style={[s.page, s.dark]}>
    <Glow x={520} y={70} r={300} o={0.1} />
    <Text id="their-side" style={[s.label, { color: C.lime }]}>Their side · your people</Text>
    <Text style={[s.h2, { marginTop: 12, color: C.onDark, fontSize: 30 }]}>Everything in this report, <Text style={{ color: C.lime }}>in one app.</Text></Text>
    <Text style={[s.lead, { marginTop: 12, color: C.dim, maxWidth: 460 }]}>The check-in you just took is the one nørma runs every month. For your people, the rest of this report is in their pocket.</Text>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 22, paddingHorizontal: 14 }}>
      {[['app-where-you-stand.jpg', 'Check-in'], ['app-reset.jpg', 'Reset'], ['app-habits.jpg', 'Habits']].map(([img, t]) => (
        <View key={img} style={{ width: 128, alignItems: 'center' }}>
          <Phone src={d.base + img} w={128} />
          <Text style={{ marginTop: 8, fontSize: 9.6, fontWeight: 600 }}>{t}</Text>
        </View>
      ))}
    </View>
    <View style={{ marginTop: 20 }}>
      <View style={{ flexDirection: 'row', paddingBottom: 6 }}>
        <Text style={[s.label, { width: 172, paddingLeft: 34, color: C.dim }]}>By hand</Text>
        <Text style={[s.label, { color: C.lime }]}>In nørma</Text>
      </View>
      {IN_NORMA.map((t) => (
        <View key={t.app} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6.5, borderTopWidth: 0.6, borderTopColor: '#2A3B2E' }}>
          <KindDisc kind={t.kind} bg="#1E3424" color={C.lime} size={24} />
          <Text style={{ width: 138, marginLeft: 10, fontSize: 9, color: C.dim }}>{t.byHand}</Text>
          <Text style={{ flex: 1, fontSize: 9, color: C.dim, lineHeight: 1.35 }}><Text style={{ fontWeight: 600, color: C.onDark }}>{t.app}</Text>{'  '}{t.text}</Text>
        </View>
      ))}
    </View>
    <Text style={[s.small, { marginTop: 14, color: C.onDark }]}>It’s theirs. Nobody at work can read it.</Text>
    <Foot name={d.name} />
  </Page>
);

const NormaLeaders = ({ d }: { d: ReportInput }) => (
  <Page size="A4" style={s.page}>
    <Text id="your-side" style={s.label}>Your side · leaders</Text>
    <Text style={[s.h2, { marginTop: 10, maxWidth: 320 }]}>The culture they walk into is yours to shape.</Text>
    <Text style={[s.lead, { marginTop: 12, maxWidth: 470 }]}>Every person’s monthly check-in becomes a group figure before anything reaches your dashboard: the organisation, each department and each team, across the five pillars and three culture questions.</Text>
    <View style={{ marginTop: 24, borderRadius: 14, overflow: 'hidden', borderWidth: 0.7, borderColor: C.line }}>
      <Image src={d.base + 'dash-window.jpg'} style={{ width: 499, height: 499 * (1028 / 1400) }} />
    </View>
    <View style={{ flexDirection: 'row', marginTop: 22 }}>
      {([
        [CULTURE_ICONS[2], 'Patterns, never people', 'You never see an individual’s answers or an individual’s name. Groups below five never appear.'],
        [['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z', 'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z', 'M12 12h.01'], 'A focus each month', 'nørma points to where it matters most, and what tends to move it.'],
        [PILLARS[3].paths, 'With us alongside', 'Our workshops and the Wellness Accelerator, aimed where the numbers say.'],
      ] as [readonly string[], string, string][]).map(([icon, t, b], k) => (
        <View key={t} style={[s.card, { flex: 1, marginRight: k < 2 ? 10 : 0, padding: 15 }]}>
          <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: C.limeSoft, alignItems: 'center', justifyContent: 'center' }}>
            <Icon paths={icon} size={15} color={C.olive} width={1.8} />
          </View>
          <Text style={{ marginTop: 12, fontSize: 10.4, fontWeight: 600 }}>{t}</Text>
          <Text style={[s.small, { marginTop: 4 }]}>{b}</Text>
        </View>
      ))}
    </View>
    <Foot name={d.name} />
  </Page>
);

/** The last page: joinnorma.com's own sign-off, and an invitation to find out more. */
const Closing = ({ d }: { d: ReportInput }) => (
  <Page size="A4" style={[s.page, s.dark]}>
    <Glow x={300} y={300} r={290} o={0.12} />
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 30 }}>
      <Image src={d.base + 'norma-happy.png'} style={{ width: 84, height: 113 }} />
      <Text style={[s.h1, { marginTop: 30, color: C.onDark, textAlign: 'center' }]}>Fulfilled people.{'\n'}Honest culture.</Text>
      <Text style={[s.lead, { marginTop: 18, color: C.dim, textAlign: 'center', maxWidth: 330 }]}>One system, both sides. Challenging the nørm of employee wellbeing.</Text>
      <Link src="https://joinnorma.com" style={{ marginTop: 32, textDecoration: 'none' }}>
        <View style={{ width: BTN.w, height: BTN.h, borderRadius: BTN.h / 2, backgroundColor: C.lime }}>
          <Text style={{ position: 'absolute', left: 0, right: 0, top: BTN.textTop, textAlign: 'center', fontSize: BTN.size, fontWeight: 600, lineHeight: 1, color: C.deep }}>Find out more</Text>
        </View>
      </Link>
      <Link src="https://joinnorma.com" style={{ marginTop: 14, textDecoration: 'none' }}>
        <Text style={{ fontSize: 10, color: C.dim }}>joinnorma.com</Text>
      </Link>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
      <Image src={d.base + 'norma-logo.png'} style={{ width: 20, height: 20, borderRadius: 5 }} />
      <Text style={{ marginHorizontal: 9, fontSize: 8, color: C.dim }}>nørma, by The Artistry of Humanity</Text>
      <Image src={d.base + 'aoh-logo.png'} style={{ width: 20, height: 20, borderRadius: 5 }} />
    </View>
  </Page>
);

/** The closing button, placed by measurement: flex centring sets the line box,
 *  not the letters, so the label sat visibly off centre. */
const BTN = { w: 156, h: 42, size: 11.5, textTop: 13.7 };

const ReportDoc = ({ d }: { d: ReportInput }) => {
  const order = d.scores.map((v, i) => i).sort((a, b) => d.scores[a] - d.scores[b]);
  return (
    <Document title={`Fulfilment Report · ${d.name}`} author="The Artistry of Humanity" subject="Your Fulfilment check-in, across the Five Pillars" creator="artistry-of-humanity.com" producer="The Artistry of Humanity">
      <Cover d={d} />
      <Glance d={d} />
      {order.map((i, rank) => <PillarPage key={i} d={d} i={i} rank={rank} />)}
      <Toolkit d={d} />
      <NormaIntro d={d} />
      <NormaPeople d={d} />
      <NormaLeaders d={d} />
      <Closing d={d} />
    </Document>
  );
};

export default ReportDoc;
