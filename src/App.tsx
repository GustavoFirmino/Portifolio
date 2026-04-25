import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { SobreMim } from './pages/SobreMim';
import { Projetos } from './pages/Projetos';
import { Experiencias } from './pages/Experiencias';
import { Contato } from './pages/Contato';
import { dicionario } from './dicionario';

type PageName = 'sumario' | 'sobre_mim' | 'projetos' | 'experiencias' | 'contato';
type Idioma = 'pt' | 'en';
type BookState = 'closed' | 'open';

const PAGE_ORDER: PageName[] = ['sumario', 'sobre_mim', 'projetos', 'experiencias', 'contato'];
const OPEN_EASE = [0.4, 0, 0.2, 1] as const;

// ─── Dust particles ───
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${4 + Math.random() * 92}%`,
  bottom: `${Math.random() * 60}%`,
  size: Math.random() * 2.4 + 0.8,
  duration: 10 + Math.random() * 16,
  delay: Math.random() * 14,
  color: i % 5 === 0 ? 'rgba(255,160,50,0.45)' : 'rgba(180,120,10,0.28)',
}));

function DustParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 4 }}>
      {PARTICLES.map(p => (
        <div key={p.id} className="dust-particle" style={{
          left: p.left, bottom: p.bottom,
          width: p.size, height: p.size,
          background: p.color,
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`,
        }} />
      ))}
    </div>
  );
}

// ─── Wall sparks — left torch ───
const LEFT_SPARKS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  leftPct: 9.8 + Math.random() * 2.4,
  topPct: 19.5 + Math.random() * 3,
  size: Math.random() * 2.8 + 0.6,
  duration: 1.0 + Math.random() * 2.4,
  delay: Math.random() * 5,
  sx: `${(Math.random() * 44 - 22).toFixed(1)}px`,
  colorG: Math.floor(125 + Math.random() * 85),
}));

// ─── Wall sparks — right torch ───
const RIGHT_SPARKS = Array.from({ length: 14 }, (_, i) => ({
  id: i + 100,
  leftPct: 88.0 + Math.random() * 2.4,
  topPct: 19.5 + Math.random() * 3,
  size: Math.random() * 2.8 + 0.6,
  duration: 1.0 + Math.random() * 2.4,
  delay: Math.random() * 5,
  sx: `${(Math.random() * 44 - 22).toFixed(1)}px`,
  colorG: Math.floor(125 + Math.random() * 85),
}));

// ─── Medieval flute ambience (Web Audio) ───
function useDungeonAmbience() {
  const ctxRef   = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const schedRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noteIdxRef = useRef(0);
  const nextTimeRef = useRef(0);
  const [enabled, setEnabled] = useState(false);

  const start = useCallback(() => {
    if (ctxRef.current) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 2.5);
    master.connect(ctx.destination);
    masterRef.current = master;

    // White noise buffer for breath texture (reused across all notes)
    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

    // D major pentatonic — bright, lively medieval feel
    // D4, F#4, A4, B4, D5, F#5, A5
    const scale = [293.66, 369.99, 440.00, 493.88, 587.33, 739.99, 880.00];
    // Flowing melody — ascends, wanders, circles back
    const melody = [0, 1, 2, 3, 2, 4, 3, 2, 1, 3, 2, 1, 0, 2, 1, 0,
                    2, 3, 4, 3, 5, 4, 3, 2, 4, 3, 2, 1, 0, 1, 2, 1];
    const step = 0.52; // seconds per note

    const playNote = (freq: number, when: number, dur: number) => {
      if (!ctxRef.current) return;

      // Flute body — sine + weak 2nd harmonic for warmth
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = freq;
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = freq * 2;

      // Vibrato (starts after short attack)
      const vib = ctx.createOscillator();
      vib.type = 'sine';
      vib.frequency.value = 5.8;
      const vibGain = ctx.createGain();
      vibGain.gain.setValueAtTime(0, when);
      vibGain.gain.linearRampToValueAtTime(freq * 0.009, when + 0.18);
      vib.connect(vibGain);
      vibGain.connect(osc1.frequency);
      vibGain.connect(osc2.frequency);

      // Amplitude envelope
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, when);
      env.gain.linearRampToValueAtTime(0.30, when + 0.07);         // attack
      env.gain.linearRampToValueAtTime(0.24, when + dur - 0.09);  // sustain
      env.gain.linearRampToValueAtTime(0, when + dur);             // release

      const osc2env = ctx.createGain();
      osc2env.gain.value = 0.06;

      osc1.connect(env);
      osc2.connect(osc2env);
      osc2env.connect(env);
      env.connect(master);

      // Breath noise — bandpass around note freq for airy texture
      const breath = ctx.createBufferSource();
      breath.buffer = noiseBuf;
      breath.loop = true;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = freq * 1.4;
      bp.Q.value = 1.8;
      const breathEnv = ctx.createGain();
      breathEnv.gain.setValueAtTime(0, when);
      breathEnv.gain.linearRampToValueAtTime(0.038, when + 0.04);
      breathEnv.gain.linearRampToValueAtTime(0.014, when + dur - 0.08);
      breathEnv.gain.linearRampToValueAtTime(0, when + dur);
      breath.connect(bp);
      bp.connect(breathEnv);
      breathEnv.connect(master);

      const end = when + dur + 0.05;
      osc1.start(when);   osc1.stop(end);
      osc2.start(when);   osc2.stop(end);
      vib.start(when);    vib.stop(end);
      breath.start(when); breath.stop(end);
    };

    noteIdxRef.current = 0;
    nextTimeRef.current = ctx.currentTime + 0.4;

    const schedule = () => {
      if (!ctxRef.current) return;
      const lookahead = 0.5;
      while (nextTimeRef.current < ctx.currentTime + lookahead) {
        const idx = melody[noteIdxRef.current % melody.length];
        playNote(scale[idx], nextTimeRef.current, step - 0.05);
        nextTimeRef.current += step;
        noteIdxRef.current++;
      }
      schedRef.current = setTimeout(schedule, 120);
    };
    schedule();

    setEnabled(true);
  }, []);

  const stop = useCallback(() => {
    if (schedRef.current) clearTimeout(schedRef.current);
    if (!masterRef.current || !ctxRef.current) return;
    const ctx = ctxRef.current;
    masterRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    setTimeout(() => {
      ctx.close();
      ctxRef.current = null;
      masterRef.current = null;
      setEnabled(false);
    }, 900);
  }, []);

  const toggle = useCallback(() => {
    if (enabled) stop(); else start();
  }, [enabled, start, stop]);

  useEffect(() => () => {
    if (schedRef.current) clearTimeout(schedRef.current);
    ctxRef.current?.close();
  }, []);

  return { enabled, toggle };
}

// ─── Torch Flame ───
function TorchFlame() {
  return (
    <div style={{ position: 'relative', width: 22, height: 42 }}>
      <motion.div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 22, height: 38, background: 'radial-gradient(ellipse 55% 85% at 50% 100%, rgba(200,60,5,0.8) 0%, transparent 100%)', borderRadius: '50% 50% 35% 35%' }}
        animate={{ scaleX: [1, 1.18, 0.88, 1.12, 0.96, 1], scaleY: [1, 0.9, 1.1, 0.93, 1.05, 1] }}
        transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 14, height: 29, background: 'radial-gradient(ellipse 55% 85% at 50% 100%, rgba(255,115,12,0.97) 0%, rgba(240,62,0,0.7) 62%, transparent 100%)', borderRadius: '50% 50% 30% 30%' }}
        animate={{ scaleX: [1, 0.85, 1.15, 0.9, 1.08, 1], y: [0, -3, 1, -2, 0.5, 0] }}
        transition={{ duration: 1.35, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 7, height: 19, background: 'radial-gradient(ellipse 55% 85% at 50% 100%, rgba(255,248,175,1) 0%, rgba(255,175,32,0.9) 58%, transparent 100%)', borderRadius: '50% 50% 30% 30%' }}
        animate={{ scaleX: [1, 0.82, 1.12, 0.87, 1], y: [0, -4, 1.5, -2.5, 0] }}
        transition={{ duration: 0.82, repeat: Infinity, ease: 'easeInOut' }} />
    </div>
  );
}

// ─── Wall Torch fixture ───
function WallTorch() {
  return (
    <div style={{ position: 'relative', width: 56, height: 120 }}>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}><TorchFlame /></div>
      <div style={{ position: 'absolute', top: 40, left: '50%', transform: 'translateX(-50%)', width: 19, height: 14, background: 'linear-gradient(to bottom, #6b3a10, #4a2808)', borderRadius: '4px 4px 2px 2px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }} />
      <div style={{ position: 'absolute', top: 52, left: '50%', transform: 'translateX(-50%)', width: 7, height: 50, background: 'linear-gradient(to right, #5a3010 0%, #7a4515 40%, #4a2508 100%)', borderRadius: '3px', boxShadow: '2px 0 6px rgba(0,0,0,0.45)' }} />
      <div style={{ position: 'absolute', top: 82, left: '50%', width: 42, height: 7, background: 'linear-gradient(to bottom, #2a1a08, #1a0d04)', borderRadius: '2px 0 0 2px', transform: 'translateX(-30%)', boxShadow: '0 2px 6px rgba(0,0,0,0.6)' }} />
      <div style={{ position: 'absolute', top: 84, right: 0, width: 10, height: 10, background: 'radial-gradient(circle, #6a4a18 30%, #3a2008 100%)', borderRadius: '50%', boxShadow: '0 0 4px rgba(0,0,0,0.8)' }} />
    </div>
  );
}

// ─── Dungeon Background ───
function DungeonBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <div className="dungeon-wall" style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'absolute', inset: 0, background: ['radial-gradient(ellipse 60% 50% at 85% 80%, rgba(0,0,0,0.5) 0%, transparent 100%)', 'radial-gradient(ellipse 30% 40% at 50% 5%, rgba(0,0,0,0.3) 0%, transparent 100%)'].join(', ') }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '38%', background: 'linear-gradient(to top, rgba(4,2,1,0.95) 0%, rgba(8,5,2,0.6) 45%, transparent 100%)' }} />

      {/* Left torch halos */}
      <motion.div style={{ position: 'absolute', top: '6%', left: '-2%', width: '40vw', height: '60vh', background: 'radial-gradient(ellipse 55% 65% at 30% 30%, rgba(255,138,28,0.55) 0%, rgba(255,90,10,0.2) 42%, transparent 68%)', borderRadius: '50%', filter: 'blur(14px)', pointerEvents: 'none' }}
        animate={{ opacity: [0.75, 1, 0.58, 0.94, 0.68, 1, 0.8] }}
        transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div style={{ position: 'absolute', top: '-5%', left: '-8%', width: '58vw', height: '78vh', background: 'radial-gradient(ellipse 40% 50% at 22% 22%, rgba(255,100,20,0.3) 0%, rgba(200,55,10,0.09) 50%, transparent 72%)', borderRadius: '50%', filter: 'blur(24px)', pointerEvents: 'none' }}
        animate={{ opacity: [0.55, 0.9, 0.46, 0.72, 0.62] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }} />

      {/* Right torch halos */}
      <motion.div style={{ position: 'absolute', top: '6%', right: '-2%', width: '40vw', height: '60vh', background: 'radial-gradient(ellipse 55% 65% at 70% 30%, rgba(255,138,28,0.55) 0%, rgba(255,90,10,0.2) 42%, transparent 68%)', borderRadius: '50%', filter: 'blur(14px)', pointerEvents: 'none' }}
        animate={{ opacity: [0.8, 0.58, 1, 0.68, 0.94, 0.75, 1] }}
        transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div style={{ position: 'absolute', top: '-5%', right: '-8%', width: '58vw', height: '78vh', background: 'radial-gradient(ellipse 40% 50% at 78% 22%, rgba(255,100,20,0.3) 0%, rgba(200,55,10,0.09) 50%, transparent 72%)', borderRadius: '50%', filter: 'blur(24px)', pointerEvents: 'none' }}
        animate={{ opacity: [0.62, 0.46, 0.9, 0.55, 0.72] }}
        transition={{ duration: 3.1, repeat: Infinity, ease: 'easeInOut' }} />

      {/* Torch fixtures */}
      <div style={{ position: 'absolute', top: '18%', left: '9%' }}><WallTorch /></div>
      <div style={{ position: 'absolute', top: '18%', right: '9%' }}><WallTorch /></div>

      {/* Sparks — left torch */}
      {LEFT_SPARKS.map(p => (
        <div key={p.id} className="spark-particle" style={{
          left: `${p.leftPct}%`, top: `${p.topPct}%`,
          width: p.size, height: p.size,
          background: `rgba(255,${p.colorG},15,0.9)`,
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`,
          ['--sx' as string]: p.sx,
        } as React.CSSProperties} />
      ))}
      {/* Sparks — right torch */}
      {RIGHT_SPARKS.map(p => (
        <div key={p.id} className="spark-particle" style={{
          left: `${p.leftPct}%`, top: `${p.topPct}%`,
          width: p.size, height: p.size,
          background: `rgba(255,${p.colorG},15,0.9)`,
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`,
          ['--sx' as string]: p.sx,
        } as React.CSSProperties} />
      ))}
    </div>
  );
}

// ─── Wooden Lectern ───
function WoodenLectern() {
  const grain = 'repeating-linear-gradient(90deg, transparent 0, transparent 14px, rgba(0,0,0,0.05) 14px, rgba(0,0,0,0.05) 15px)';
  const wL = '#8a5020', wM = '#5a3010', wD = '#3a1e08', gold = 'rgba(200,146,15,0.22)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative' }}>
        <div style={{ width: 292, height: 16, background: `linear-gradient(180deg, ${wL} 0%, ${wM} 100%)`, borderRadius: '3px', boxShadow: '0 4px 14px rgba(0,0,0,0.55)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: grain }} />
          <div style={{ position: 'absolute', inset: 3, border: `1px solid ${gold}`, borderRadius: '2px' }} />
          <motion.div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(255,160,50,0.22) 0%, transparent 55%)' }}
            animate={{ opacity: [0.5, 1, 0.58, 0.88, 0.45] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }} />
        </div>
        <div style={{ position: 'absolute', bottom: -4, left: '8%', right: '8%', height: 5, background: `linear-gradient(180deg, ${wD} 0%, #1e0c04 100%)`, borderRadius: '0 0 3px 3px', boxShadow: '0 3px 8px rgba(0,0,0,0.5)' }} />
      </div>
      <div style={{ width: 48, height: 13, background: `linear-gradient(180deg, ${wM} 0%, ${wD} 100%)`, borderRadius: '2px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }} />
      <div style={{ width: 26, height: 68, background: `linear-gradient(to right, ${wD} 0%, ${wL} 32%, ${wM} 68%, ${wD} 100%)`, position: 'relative', boxShadow: '3px 0 10px rgba(0,0,0,0.4)' }}>
        {[8, 30, 50].map((y, i) => <div key={i} style={{ position: 'absolute', top: y, left: '50%', transform: 'translate(-50%, 0) rotate(45deg)', width: 14, height: 14, border: '1.5px solid rgba(200,146,15,0.32)', background: 'rgba(0,0,0,0.22)' }} />)}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.35) 0%, transparent 42%)' }} />
      </div>
      <div style={{ width: 66, height: 14, background: `linear-gradient(180deg, ${wD} 0%, ${wM} 100%)`, position: 'relative', overflow: 'hidden', borderRadius: '0 0 2px 2px' }}>
        <div style={{ position: 'absolute', inset: 3, border: `1px solid ${gold}` }} />
      </div>
      <div style={{ width: 195, height: 16, background: `linear-gradient(180deg, ${wM} 0%, ${wD} 100%)`, borderRadius: '4px 4px 0 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 3, border: `1px solid ${gold}`, borderRadius: '2px' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(45deg)', width: 22, height: 22, border: `1px solid ${gold}` }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: grain }} />
      </div>
      <div style={{ width: 236, height: 22, background: `linear-gradient(180deg, ${wD} 0%, #1e0c04 100%)`, position: 'relative', overflow: 'hidden', boxShadow: '0 6px 24px rgba(0,0,0,0.8)' }}>
        <div style={{ position: 'absolute', inset: 4, border: '1px solid rgba(200,146,15,0.15)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: grain }} />
        {[-50, 0, 50].map((x, i) => <div key={i} style={{ position: 'absolute', top: '50%', left: '50%', transform: `translate(calc(-50% + ${x}px), -50%) rotate(45deg)`, width: 6, height: 6, border: '1px solid rgba(200,146,15,0.25)' }} />)}
      </div>
      <div style={{ width: 260, height: 10, background: 'linear-gradient(180deg, #1e0c04 0%, #0d0501 100%)', borderRadius: '0 0 6px 6px', boxShadow: '0 6px 22px rgba(0,0,0,0.9)' }} />
    </div>
  );
}

// ─── Book Scene (lectern display) ───
function BookScene({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', width: 460, height: 628 }}>
      <div style={{ position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)', zIndex: 5, perspective: '2400px', perspectiveOrigin: '50% 45%' }}>
        {children}
      </div>
      <div style={{ position: 'absolute', top: 512, left: '50%', transform: 'translateX(-50%)', zIndex: 4 }}>
        <WoodenLectern />
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 36, background: 'radial-gradient(ellipse at 50% 80%, rgba(0,0,0,0.7) 0%, transparent 70%)', filter: 'blur(10px)', pointerEvents: 'none' }} />
    </div>
  );
}

// ─── Closed Book (cover page + language toggle) ───
interface ClosedBookProps {
  t: typeof dicionario['pt'];
  idioma: Idioma;
  onOpen: () => void;
  toggleIdioma: () => void;
}

function ClosedBook({ t, idioma, onOpen, toggleIdioma }: ClosedBookProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div className="relative select-none" style={{ width: 320, height: 460 }}
      animate={{ rotateY: hovered ? -4 : -16, rotateX: hovered ? 1 : 5, y: hovered ? -12 : 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 18 }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
    >
      <motion.div animate={{ opacity: hovered ? 0.4 : 0.58, scaleX: hovered ? 0.76 : 1 }} transition={{ duration: 0.4 }}
        style={{ position: 'absolute', bottom: -14, left: '5%', width: '90%', height: 18, background: 'rgba(0,0,0,0.75)', filter: 'blur(12px)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', top: 5, bottom: 0, right: -18, width: 18, background: 'linear-gradient(to right, #c8b070 0%, #f0e5c0 45%, #d4bc78 100%)', transform: 'skewY(0.8deg)', boxShadow: '3px 0 10px rgba(0,0,0,0.4)' }}>
        {Array.from({ length: 10 }).map((_, i) => <div key={i} style={{ height: 1, background: 'rgba(0,0,0,0.06)', marginTop: `${Math.floor(460 / 11)}px` }} />)}
      </div>
      <div className="leather-texture" style={{ position: 'absolute', top: 0, bottom: 0, left: -42, width: 42, backgroundColor: '#2a1505', borderLeft: '2px solid rgba(200,146,15,0.35)', borderTop: '3px solid rgba(200,146,15,0.45)', borderBottom: '3px solid rgba(200,146,15,0.45)', boxShadow: '-4px 0 14px rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'skewY(-0.4deg)' }}>
        <span style={{ fontFamily: '"Cinzel Decorative", cursive', color: '#c8920f', fontSize: '0.6rem', writingMode: 'vertical-lr', letterSpacing: '0.2em', opacity: 0.85, textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>CRÔNICAS</span>
      </div>
      <div className="leather-texture" style={{ position: 'absolute', inset: 0, backgroundColor: '#3d2008', border: '3px solid #c8920f', borderLeft: '5px solid #1a0b03', boxShadow: '8px 8px 24px rgba(0,0,0,0.7), inset 0 0 50px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '36px 30px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 10, border: '1px solid rgba(200,146,15,0.45)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 16, border: '1px solid rgba(200,146,15,0.2)', pointerEvents: 'none' }} />
        <motion.div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(255,155,42,0.32) 0%, rgba(255,110,18,0.14) 32%, transparent 60%)', pointerEvents: 'none', zIndex: 1 }}
          animate={{ opacity: [0.55, 1, 0.65, 0.92, 0.5, 0.88] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div animate={{ rotate: hovered ? 47 : 45 }} transition={{ type: 'spring', stiffness: 120 }}
          style={{ width: 70, height: 70, marginBottom: 18, border: '2px solid #c8920f', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(200,146,15,0.08)', position: 'relative', zIndex: 2 }}>
          <span style={{ fontFamily: '"Cinzel Decorative", cursive', color: '#e8d08a', fontSize: '1.9rem', transform: 'rotate(-45deg)', textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>G</span>
        </motion.div>
        <h1 style={{ fontFamily: '"Cinzel Decorative", cursive', color: '#e8d08a', fontSize: '1.45rem', fontWeight: 700, textAlign: 'center', lineHeight: 1.25, whiteSpace: 'pre-line', textShadow: '0 2px 10px rgba(0,0,0,0.9)', marginBottom: 6, position: 'relative', zIndex: 2 }}>{t.capa.titulo}</h1>
        <div style={{ width: '68%', height: 1, margin: '10px 0 12px', background: 'linear-gradient(to right, transparent, #c8920f, transparent)', position: 'relative', zIndex: 2 }} />
        <p style={{ fontFamily: '"IM Fell English", serif', color: '#c8920f', fontSize: '0.88rem', textAlign: 'center', fontStyle: 'italic', marginBottom: 20, textShadow: '0 1px 4px rgba(0,0,0,0.7)', position: 'relative', zIndex: 2 }}>{t.capa.subtitulo}</p>
        <motion.button onClick={onOpen} whileHover={{ backgroundColor: 'rgba(200,146,15,0.18)', scale: 1.03 }} whileTap={{ scale: 0.97 }}
          style={{ padding: '9px 26px', background: 'transparent', border: '1px solid #c8920f', color: '#e8d08a', fontFamily: '"Cinzel", serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background 0.25s ease', position: 'relative', zIndex: 2, marginBottom: 10 }}>
          {t.capa.botaoAbrir}
        </motion.button>
        {/* Language toggle on cover */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleIdioma(); }}
          style={{ padding: '5px 14px', background: 'transparent', border: '1px solid rgba(200,146,15,0.35)', color: 'rgba(232,208,138,0.65)', fontFamily: '"Cinzel", serif', fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', position: 'relative', zIndex: 2, transition: 'all 0.2s ease' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#c8920f'; e.currentTarget.style.color = '#e8d08a'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(200,146,15,0.35)'; e.currentTarget.style.color = 'rgba(232,208,138,0.65)'; }}
        >
          {idioma === 'pt' ? 'EN 🇬🇧' : 'PT 🇧🇷'}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Cover Overlay ───
// ─── Cover Close Overlay ───
// Reverse of CoverOverlay: cover sweeps from open (-170°) back to closed (0°).
// Front face (leather) becomes visible after -90° as it sweeps right.
function CoverCloseOverlay({ onComplete, idioma }: CoverOverlayProps) {
  const subtitle = idioma === 'pt' ? 'As Crônicas de Gustavo' : 'The Chronicles of Gustavo';
  return (
    <motion.div
      style={{ position: 'absolute', inset: 0, zIndex: 30, pointerEvents: 'none', perspective: '2400px', perspectiveOrigin: '50% 45%' }}
    >
      <motion.div
        style={{ position: 'absolute', top: 0, left: '50%', width: '50%', height: '100%', transformOrigin: 'left center', transformStyle: 'preserve-3d', zIndex: 2 }}
        initial={{ rotateY: -170 }}
        animate={{ rotateY: 0 }}
        transition={{ duration: 1.4, ease: OPEN_EASE }}
        onAnimationComplete={onComplete}
      >
        <div className="leather-texture backface-hidden" style={{ position: 'absolute', inset: 0, backgroundColor: '#3d2008', border: '3px solid #c8920f', borderLeft: '5px solid #1a0b03', boxShadow: '8px 8px 24px rgba(0,0,0,0.7), inset 0 0 50px rgba(0,0,0,0.35)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '36px 30px' }}>
          <div style={{ position: 'absolute', inset: 10, border: '1px solid rgba(200,146,15,0.45)' }} />
          <div style={{ position: 'absolute', inset: 16, border: '1px solid rgba(200,146,15,0.2)' }} />
          <div style={{ width: 70, height: 70, border: '2px solid #c8920f', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(200,146,15,0.08)', transform: 'rotate(45deg)', marginBottom: 18, position: 'relative', zIndex: 2 }}>
            <span style={{ fontFamily: '"Cinzel Decorative", cursive', color: '#e8d08a', fontSize: '1.9rem', transform: 'rotate(-45deg)', textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>G</span>
          </div>
          <div style={{ width: '68%', height: 1, margin: '10px 0 12px', background: 'linear-gradient(to right, transparent, #c8920f, transparent)', position: 'relative', zIndex: 2 }} />
          <p style={{ fontFamily: '"IM Fell English", serif', color: '#c8920f', fontSize: '0.88rem', fontStyle: 'italic', textAlign: 'center', textShadow: '0 1px 4px rgba(0,0,0,0.7)', position: 'relative', zIndex: 2 }}>{subtitle}</p>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(255,155,42,0.22) 0%, transparent 55%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 25%)' }} />
        </div>
        <div className="backface-hidden" style={{ position: 'absolute', inset: 0, transform: 'rotateY(180deg)', background: 'transparent' }} />
      </motion.div>
    </motion.div>
  );
}

// Renders on top of the open book spread. The cover (right half) pivots at its
// LEFT edge (transform-origin: left center = spine position), rotateY 0 → -170°.
// Back face is transparent so the dungeon shows through after -90°.
// onComplete fires after the full 1.8s so the overlay unmounts.
interface CoverOverlayProps { onComplete: () => void; onReveal?: () => void; idioma: Idioma; }

function CoverOverlay({ onComplete, onReveal, idioma }: CoverOverlayProps) {
  const subtitle = idioma === 'pt' ? 'As Crônicas de Gustavo' : 'The Chronicles of Gustavo';
  useEffect(() => {
    // Cover passes -90° (visually disappears) at ~53% of 1.8s ≈ 0.95s
    const t = setTimeout(() => onReveal?.(), 950);
    return () => clearTimeout(t);
  }, []);
  return (
    <motion.div
      style={{ position: 'absolute', inset: 0, zIndex: 30, pointerEvents: 'none', perspective: '2400px', perspectiveOrigin: '50% 45%' }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
    >
      {/* No mask — dungeon background shows through while cover flips */}

      <motion.div
        style={{ position: 'absolute', top: 0, left: '50%', width: '50%', height: '100%', transformOrigin: 'left center', transformStyle: 'preserve-3d', zIndex: 2 }}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: -170 }}
        transition={{ duration: 1.8, ease: OPEN_EASE }}
        onAnimationComplete={onComplete}
      >
        {/* Front face — leather cover, visible 0° → -90° */}
        <div className="leather-texture backface-hidden" style={{ position: 'absolute', inset: 0, backgroundColor: '#3d2008', border: '3px solid #c8920f', borderLeft: '5px solid #1a0b03', boxShadow: '8px 8px 24px rgba(0,0,0,0.7), inset 0 0 50px rgba(0,0,0,0.35)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '36px 30px' }}>
          <div style={{ position: 'absolute', inset: 10, border: '1px solid rgba(200,146,15,0.45)' }} />
          <div style={{ position: 'absolute', inset: 16, border: '1px solid rgba(200,146,15,0.2)' }} />
          <div style={{ width: 70, height: 70, border: '2px solid #c8920f', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(200,146,15,0.08)', transform: 'rotate(45deg)', marginBottom: 18, position: 'relative', zIndex: 2 }}>
            <span style={{ fontFamily: '"Cinzel Decorative", cursive', color: '#e8d08a', fontSize: '1.9rem', transform: 'rotate(-45deg)', textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>G</span>
          </div>
          <div style={{ width: '68%', height: 1, margin: '10px 0 12px', background: 'linear-gradient(to right, transparent, #c8920f, transparent)', position: 'relative', zIndex: 2 }} />
          <p style={{ fontFamily: '"IM Fell English", serif', color: '#c8920f', fontSize: '0.88rem', fontStyle: 'italic', textAlign: 'center', textShadow: '0 1px 4px rgba(0,0,0,0.7)', position: 'relative', zIndex: 2 }}>{subtitle}</p>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(255,155,42,0.22) 0%, transparent 55%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 25%)' }} />
        </div>
        {/* Back face — transparent, dungeon shows through after -90° */}
        <div className="backface-hidden" style={{ position: 'absolute', inset: 0, transform: 'rotateY(180deg)', background: 'transparent' }} />
      </motion.div>
    </motion.div>
  );
}

// ─── Page Flip Overlay ───
function PageFlipOverlay({ direction }: { direction: 'forward' | 'backward' }) {
  const isForward = direction === 'forward';
  const controls = useAnimation();
  useEffect(() => {
    controls.start({ rotateY: isForward ? -180 : 180, transition: { duration: 0.78, ease: [0.4, 0, 0.25, 1] } });
  }, []);
  return (
    <div className="page-flip-layer" style={{ left: isForward ? '50%' : 0, right: isForward ? 0 : '50%', perspective: '2200px', perspectiveOrigin: isForward ? '0% 50%' : '100% 50%' }}>
      <motion.div animate={controls} style={{ transformOrigin: isForward ? 'left center' : 'right center', transformStyle: 'preserve-3d', width: '100%', height: '100%', position: 'relative' }}>
        <div className="page-texture backface-hidden" style={{ position: 'absolute', inset: 0, boxShadow: isForward ? 'inset -8px 0 20px rgba(0,0,0,0.18)' : 'inset 8px 0 20px rgba(0,0,0,0.18)' }}>
          <div style={{ position: 'absolute', inset: 0, background: isForward ? 'linear-gradient(to right, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0) 35%)' : 'linear-gradient(to left, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0) 35%)' }} />
        </div>
        <div className="page-texture backface-hidden" style={{ position: 'absolute', inset: 0, transform: 'rotateY(180deg)', backgroundColor: '#ede0bc', boxShadow: isForward ? 'inset 8px 0 20px rgba(0,0,0,0.14)' : 'inset -8px 0 20px rgba(0,0,0,0.14)' }}>
          <div style={{ position: 'absolute', inset: 0, background: isForward ? 'linear-gradient(to left, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 40%)' : 'linear-gradient(to right, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 40%)' }} />
        </div>
      </motion.div>
    </div>
  );
}

// ─── Sumário ───
interface SumarioProps { t: typeof dicionario['pt']; idioma: Idioma; toggleIdioma: () => void; voltar: () => void; navigateTo: (p: PageName) => void; }

function Sumario({ t, idioma, toggleIdioma, voltar, navigateTo }: SumarioProps) {
  return (
    <div className="flex w-full h-full">
      <div className="w-1/2 border-r border-ink/15 p-8 md:p-10 flex flex-col items-center justify-center text-center relative">
        <button onClick={toggleIdioma} className="absolute top-6 right-6 px-3 py-1 border border-ink/40 hover:border-gold hover:text-gold text-xs tracking-widest uppercase transition-all cursor-pointer" style={{ fontFamily: '"Cinzel", serif', color: '#1c1008' }}>
          {idioma === 'pt' ? 'EN 🇬🇧' : 'PT 🇧🇷'}
        </button>
        <div className="relative mb-6">
          <div className="w-20 h-20 border-2 border-ink/50 flex items-center justify-center" style={{ transform: 'rotate(45deg)' }}>
            <span className="text-4xl font-medieval text-ink/70" style={{ transform: 'rotate(-45deg)' }}>G</span>
          </div>
        </div>
        <h2 className="font-medieval text-2xl text-ink/80 leading-snug mb-2">{t.sumario.tituloArte}</h2>
        <div className="gold-divider w-2/3 mx-auto" />
        <p className="font-body italic text-base text-ink/60 mt-2">{t.sumario.subtituloArte}</p>
        <button onClick={voltar} className="mt-10 text-xs tracking-widest text-ink/50 hover:text-rubric transition-colors cursor-pointer uppercase" style={{ fontFamily: '"Cinzel", serif' }}>
          {t.geral.fecharTomo}
        </button>
      </div>
      <div className="w-1/2 p-8 md:p-10 flex flex-col justify-center relative">
        <h2 className="font-medieval text-3xl md:text-4xl font-bold mb-2 text-ink border-b border-rubric/30 pb-3" style={{ fontFamily: '"Cinzel Decorative", cursive' }}>{t.sumario.indice}</h2>
        <div className="gold-divider" />
        <ul className="flex flex-col gap-5 mt-4">
          {([['sobre_mim', t.sumario.cap1], ['projetos', t.sumario.cap2], ['experiencias', t.sumario.cap3], ['contato', t.sumario.cap4]] as [PageName, string][]).map(([key, label]) => (
            <li key={key}>
              <motion.button onClick={() => navigateTo(key)} whileHover={{ x: 6 }} className="w-full text-left cursor-pointer group">
                <span className="text-lg md:text-xl text-ink group-hover:text-rubric transition-colors border-b border-ink/10 group-hover:border-rubric/40 pb-1 block" style={{ fontFamily: '"Cinzel", serif' }}>{label}</span>
              </motion.button>
            </li>
          ))}
        </ul>
        <div className="absolute bottom-5 right-8 font-medieval text-base text-ink/30">— i —</div>
      </div>
    </div>
  );
}

// ─── App Principal ───
export default function App() {
  const [bookState, setBookState] = useState<BookState>('closed');
  const [currentPage, setCurrentPage] = useState<PageName>('sumario');
  const [previousPage, setPreviousPage] = useState<PageName>('sumario');
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward'>('forward');
  const [idioma, setIdioma] = useState<Idioma>('pt');
  const [coverFlipDone, setCoverFlipDone] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const { enabled: soundEnabled, toggle: toggleSound } = useDungeonAmbience();

  const t = dicionario[idioma];
  const toggleIdioma = () => setIdioma(i => i === 'pt' ? 'en' : 'pt');

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const navigateTo = useCallback((page: PageName) => {
    if (isFlipping || page === currentPage) return;
    const fromIdx = PAGE_ORDER.indexOf(currentPage);
    const toIdx = PAGE_ORDER.indexOf(page);
    setFlipDirection(toIdx >= fromIdx ? 'forward' : 'backward');
    setPreviousPage(currentPage);
    setCurrentPage(page);
    setIsFlipping(true);
    const t1 = setTimeout(() => setIsFlipping(false), 820);
    timers.current.push(t1);
  }, [currentPage, isFlipping]);

  const openBook = useCallback(() => {
    setCoverFlipDone(false);
    setBookState('open');
  }, []);

  const closeBook = useCallback(() => {
    setBookState('closed');
    setCurrentPage('sumario');
    setPreviousPage('sumario');
    setCoverFlipDone(false);
    setIsClosing(false);
  }, []);

  const initiateClose = useCallback(() => {
    setIsClosing(true);
  }, []);

  const sharedProps = { idioma, toggleIdioma };

  const renderPage = (page: PageName) => {
    switch (page) {
      case 'sumario':      return <Sumario t={t} idioma={idioma} toggleIdioma={toggleIdioma} voltar={initiateClose} navigateTo={navigateTo} />;
      case 'sobre_mim':   return <SobreMim voltar={() => navigateTo('sumario')} {...sharedProps} />;
      case 'projetos':    return <Projetos voltar={() => navigateTo('sumario')} {...sharedProps} />;
      case 'experiencias':return <Experiencias voltar={() => navigateTo('sumario')} {...sharedProps} />;
      case 'contato':     return <Contato voltar={() => navigateTo('sumario')} {...sharedProps} />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative" style={{ background: '#0a0603' }}>
      <DungeonBackground />
      <DustParticles />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.85) 100%)', zIndex: 5 }} />

      <AnimatePresence mode="wait">

        {/* ── FECHADO ── */}
        {bookState === 'closed' && (
          <motion.div key="closed" style={{ position: 'relative', zIndex: 20 }}
            initial={{ opacity: 0, y: 32, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.35, ease: 'easeIn' } }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <BookScene>
              <ClosedBook t={t} idioma={idioma} onOpen={openBook} toggleIdioma={toggleIdioma} />
            </BookScene>
          </motion.div>
        )}

        {/* ── ABERTO ── */}
        {bookState === 'open' && (
          <motion.div key="open" style={{ position: 'relative', zIndex: 20, width: '100%', maxWidth: '1080px', padding: '0 16px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.3 } }}
            transition={{ duration: 0.4 }}
          >
            <div style={{ position: 'absolute', bottom: -28, left: '8%', right: '8%', height: 28, background: 'rgba(0,0,0,0.65)', filter: 'blur(22px)', borderRadius: '50%', zIndex: -1 }} />
            <div className="relative w-full" style={{ height: 'min(88vh, 740px)', minHeight: 460, border: '2px solid #3d2008', boxShadow: '0 24px 80px rgba(0,0,0,0.95), inset 0 0 0 1px rgba(200,146,15,0.12)', overflow: 'hidden' }}>
              {/* Right half: always visible */}
              <div className="absolute page-texture" style={{ top: 0, right: 0, width: '50%', height: '100%', zIndex: 0 }} />
              <motion.div className="absolute page-texture" style={{ top: 0, left: 0, width: '50%', height: '100%', zIndex: 0 }}
                animate={{ opacity: coverFlipDone && !isClosing ? 1 : 0 }}
                transition={{ duration: 0.15 }}
              />
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-16 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.18) 40%, rgba(0,0,0,0.18) 60%, rgba(0,0,0,0.06) 100%)', zIndex: 5 }} />
              <div className="absolute inset-y-0 left-1/2 w-px pointer-events-none" style={{ background: 'rgba(61,32,8,0.25)', zIndex: 6 }} />

              {/* Content pages */}
              {isFlipping && (
                <motion.div key={`prev-${previousPage}`} className="absolute inset-0" style={{ zIndex: 2, pointerEvents: 'none' }}
                  initial={{ opacity: 1 }} animate={{ opacity: [1, 1, 0, 0] }}
                  transition={{ duration: 0.78, times: [0, 0.42, 0.58, 1] }}>
                  {renderPage(previousPage)}
                </motion.div>
              )}
              <motion.div key={`curr-${currentPage}`} className="absolute inset-0" style={{ zIndex: 1 }}
                initial={isFlipping ? { opacity: 0 } : false}
                animate={isFlipping ? { opacity: [0, 0, 1, 1] } : { opacity: coverFlipDone && !isClosing ? 1 : 0 }}
                transition={isFlipping ? { duration: 0.78, times: [0, 0.42, 0.58, 1] } : coverFlipDone ? { duration: 0.15 } : { duration: 0 }}>
                {renderPage(currentPage)}
              </motion.div>

              {isFlipping && <PageFlipOverlay direction={flipDirection} />}

              {/* Cover flip — plays once each time the book is opened */}
              <AnimatePresence>
                {!coverFlipDone && (
                  <CoverOverlay key="cover" idioma={idioma} onReveal={() => setCoverFlipDone(true)} onComplete={() => {}} />
                )}
              </AnimatePresence>

              {/* Cover close — plays when user clicks Fechar o Tomo */}
              <AnimatePresence>
                {isClosing && (
                  <CoverCloseOverlay key="cover-close" idioma={idioma} onComplete={closeBook} />
                )}
              </AnimatePresence>

              <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 40px rgba(28,16,8,0.1)', zIndex: 10 }} />
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ── Sound toggle (fixed, always visible) ── */}
      <motion.button
        onClick={toggleSound}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        style={{ position: 'fixed', bottom: 22, right: 22, zIndex: 100, background: 'rgba(14,8,3,0.82)', border: `1px solid ${soundEnabled ? 'rgba(200,146,15,0.6)' : 'rgba(200,146,15,0.25)'}`, color: soundEnabled ? '#c8920f' : 'rgba(200,146,15,0.45)', fontFamily: '"Cinzel", serif', fontSize: '0.65rem', letterSpacing: '0.12em', padding: '8px 14px', cursor: 'pointer', backdropFilter: 'blur(6px)', textTransform: 'uppercase', transition: 'border-color 0.3s, color 0.3s' }}
      >
        {soundEnabled ? '🔊 Som' : '🔇 Som'}
      </motion.button>
    </div>
  );
}
