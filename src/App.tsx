import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue, useSpring } from 'framer-motion';
import { SobreMim } from './pages/SobreMim';
import { Projetos } from './pages/Projetos';
import { Experiencias } from './pages/Experiencias';
import { Contato } from './pages/Contato';
import { dicionario } from './dicionario';
import { projetos as projetosData, experiencias as experienciasData } from './data/content';

type PageName = 'sumario' | 'sobre_mim' | 'projetos' | 'experiencias' | 'contato';
type Idioma = 'pt' | 'en';
type BookState = 'closed' | 'open';

const PAGE_ORDER: PageName[] = ['sumario', 'sobre_mim', 'projetos', 'experiencias', 'contato'];
const OPEN_EASE = [0.4, 0, 0.2, 1] as const;

// ─── prefers-reduced-motion ───
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

// ─── viewport breakpoint (single-page book on phones) ───
function useIsMobile(bp = 768) {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < bp);
  useEffect(() => {
    const on = () => setMobile(window.innerWidth < bp);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, [bp]);
  return mobile;
}

// ─── Page-turn SFX: a short parchment rustle (respects the Sound toggle) ───
let sfxCtx: AudioContext | null = null;
function playPageTurn() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    if (!sfxCtx) sfxCtx = new AC();
    const ctx = sfxCtx;
    if (ctx.state === 'suspended') void ctx.resume();
    const now = ctx.currentTime;
    const dur = 0.42;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) { const t = i / d.length; d[i] = (Math.random() * 2 - 1) * (1 - t) * (1 - t); }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 0.7;
    bp.frequency.setValueAtTime(900, now);
    bp.frequency.exponentialRampToValueAtTime(3400, now + dur * 0.65);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.16, now + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0004, now + dur);
    src.connect(bp); bp.connect(g); g.connect(ctx.destination);
    src.start(now); src.stop(now + dur + 0.02);
  } catch { /* audio unavailable */ }
}

// ─── Candlelight glow that follows the cursor (pointer devices only) ───
function MouseGlow() {
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const sx = useSpring(x, { stiffness: 110, damping: 26, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 110, damping: 26, mass: 0.6 });
  useEffect(() => {
    const on = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener('mousemove', on);
    return () => window.removeEventListener('mousemove', on);
  }, [x, y]);
  return <motion.div className="mouse-glow" style={{ x: sx, y: sy }} />;
}

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

// ─── Grimoire ambience (Web Audio) ───
// Slow, sparse lute/harp plucks over a low drone, bathed in chamber reverb.
// Fully procedural (no audio files); a gentle random-walk melody in A minor
// pentatonic so it never repeats as a tight loop.
function useDungeonAmbience() {
  const ctxRef    = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const schedRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const droneRef  = useRef<AudioNode[]>([]);
  const stepIdxRef = useRef(3);
  const nextTimeRef = useRef(0);
  const [enabled, setEnabled] = useState(false);

  const start = useCallback(() => {
    if (ctxRef.current) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.30, ctx.currentTime + 3.5);
    master.connect(ctx.destination);
    masterRef.current = master;

    // ── Chamber reverb (generated impulse response) ──
    const irLen = ctx.sampleRate * 2.8;
    const irBuf = ctx.createBuffer(2, irLen, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = irBuf.getChannelData(ch);
      for (let i = 0; i < irLen; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / irLen, 2.4);
    }
    const reverb = ctx.createConvolver();
    reverb.buffer = irBuf;
    const wet = ctx.createGain(); wet.gain.value = 0.9;
    const dry = ctx.createGain(); dry.gain.value = 0.62;
    reverb.connect(wet); wet.connect(master); dry.connect(master);

    // ── Low drone bed (tonic A) with a slow filter sweep ──
    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.value = 520;
    droneFilter.Q.value = 0.7;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.09;
    droneFilter.connect(droneGain); droneGain.connect(dry); droneGain.connect(reverb);
    const droneNodes: AudioNode[] = [];
    [55, 82.41, 110].forEach((f, i) => {          // A1, E2, A2
      const o = ctx.createOscillator();
      o.type = i === 2 ? 'triangle' : 'sine';
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = i === 0 ? 0.5 : i === 1 ? 0.28 : 0.18;
      o.connect(g); g.connect(droneFilter);
      o.start();
      droneNodes.push(o, g);
    });
    // Breathing movement on the drone's cutoff
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.05;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 180;
    lfo.connect(lfoGain); lfoGain.connect(droneFilter.frequency);
    lfo.start();
    droneNodes.push(lfo, lfoGain);
    droneRef.current = droneNodes;

    // ── A minor pentatonic across three octaves (mysterious, warm) ──
    // A2 C3 D3 E3 G3 A3 C4 D4 E4 G4 A4 C5 D5 E5
    const scale = [110.00, 130.81, 146.83, 164.81, 196.00, 220.00,
                   261.63, 293.66, 329.63, 392.00, 440.00,
                   523.25, 587.33, 659.25];

    const pluck = (freq: number, when: number, vel: number) => {
      if (!ctxRef.current) return;
      const dur = 1.6 + Math.random() * 1.4;
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const osc2 = ctx.createOscillator();       // soft octave shimmer
      osc2.type = 'sine';
      osc2.frequency.value = freq * 2.001;
      const o2g = ctx.createGain(); o2g.gain.value = 0.11;

      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(2400, when);
      lp.frequency.exponentialRampToValueAtTime(640, when + dur); // string decay tone

      const env = ctx.createGain();
      env.gain.setValueAtTime(0.0001, when);
      env.gain.linearRampToValueAtTime(vel, when + 0.012);        // pluck attack
      env.gain.exponentialRampToValueAtTime(0.0006, when + dur);  // long natural decay

      osc.connect(lp); osc2.connect(o2g); o2g.connect(lp);
      lp.connect(env); env.connect(dry); env.connect(reverb);

      const end = when + dur + 0.1;
      osc.start(when);  osc.stop(end);
      osc2.start(when); osc2.stop(end);
    };

    stepIdxRef.current = 3;
    nextTimeRef.current = ctx.currentTime + 0.6;

    const schedule = () => {
      if (!ctxRef.current) return;
      const lookahead = 1.2;
      while (nextTimeRef.current < ctx.currentTime + lookahead) {
        const when = nextTimeRef.current;
        // Random walk that favours small melodic steps, occasional leaps.
        let idx = stepIdxRef.current;
        const r = Math.random();
        if (r < 0.4) idx += (Math.random() < 0.5 ? 1 : -1);
        else if (r < 0.7) idx += (Math.random() < 0.5 ? 2 : -2);
        else if (r < 0.85) idx += (Math.random() < 0.5 ? 3 : -3);
        idx = Math.max(0, Math.min(scale.length - 1, idx));
        stepIdxRef.current = idx;

        pluck(scale[idx], when, 0.34 + Math.random() * 0.16);
        // Occasional gentle companion note a third/fifth above
        if (Math.random() < 0.28) {
          const hi = Math.min(scale.length - 1, idx + (Math.random() < 0.5 ? 2 : 3));
          pluck(scale[hi], when + 0.10, 0.14 + Math.random() * 0.08);
        }
        // Sparse, uneven spacing so it never feels like a loop
        nextTimeRef.current += 1.1 + Math.random() * 1.9 + (Math.random() < 0.15 ? 1.6 : 0);
      }
      schedRef.current = setTimeout(schedule, 200);
    };
    schedule();

    setEnabled(true);
  }, []);

  const stop = useCallback(() => {
    if (schedRef.current) clearTimeout(schedRef.current);
    if (!masterRef.current || !ctxRef.current) return;
    const ctx = ctxRef.current;
    masterRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.0);
    droneRef.current.forEach(n => { try { (n as OscillatorNode).stop?.(ctx.currentTime + 1.1); } catch { /* gain nodes have no stop */ } });
    droneRef.current = [];
    setTimeout(() => {
      ctx.close();
      ctxRef.current = null;
      masterRef.current = null;
      setEnabled(false);
    }, 1200);
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
    <div className="flex flex-col md:flex-row w-full h-full">
      <div className="w-full md:w-1/2 md:border-r border-ink/15 p-8 md:p-10 flex flex-col items-center justify-center text-center relative">
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
      <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center relative">
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

// ─── Mobile book: one page per screen, turn by swipe / arrows ───
type MobilePage =
  | { kind: 'sumario' }
  | { kind: 'sobre' }
  | { kind: 'projeto'; i: number }
  | { kind: 'exp'; i: number }
  | { kind: 'contato' };

interface MobileBookProps {
  t: typeof dicionario['pt'];
  idioma: Idioma;
  toggleIdioma: () => void;
  onClose: () => void;
  reduced: boolean;
  soundEnabled: boolean;
}

function MobileBook({ t, idioma, toggleIdioma, onClose, reduced, soundEnabled }: MobileBookProps) {
  const pages: MobilePage[] = [
    { kind: 'sumario' },
    { kind: 'sobre' },
    ...projetosData.map((_, i) => ({ kind: 'projeto', i } as MobilePage)),
    ...experienciasData.map((_, i) => ({ kind: 'exp', i } as MobilePage)),
    { kind: 'contato' },
  ];
  const firstProjeto = 2;
  const firstExp = 2 + projetosData.length;
  const contatoIdx = pages.length - 1;

  // ─── Modules (chapters): both the ‹ › buttons and finger swipes are
  // confined to the CURRENT module's pages — they never spill into the
  // next chapter. The only way to switch chapters is going back to the
  // Sumário and picking one from there. ───
  const modules = [
    { key: 'sumario', label: idioma === 'pt' ? 'Sumário' : 'Index', start: 0, count: 1 },
    { key: 'sobre', label: t.sumario.cap1, start: 1, count: 1 },
    { key: 'projetos', label: t.sumario.cap2, start: firstProjeto, count: projetosData.length },
    { key: 'jornada', label: t.sumario.cap3, start: firstExp, count: experienciasData.length },
    { key: 'contato', label: t.sumario.cap4, start: contatoIdx, count: 1 },
  ];

  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const goTo = useCallback((next: number, d: number) => {
    if (next < 0 || next >= pages.length || next === index) return;
    setDir(d);
    setIndex(next);
    if (soundEnabled) playPageTurn();
  }, [index, pages.length, soundEnabled]);

  const moduleIdx = modules.reduce((acc, m, i) => (index >= m.start ? i : acc), 0);
  const currentModule = modules[moduleIdx];
  const posInModule = index - currentModule.start + 1;
  const moduleFirst = currentModule.start;
  const moduleLast = currentModule.start + currentModule.count - 1;

  // Turn one page, but never cross the current module's boundary.
  const turn = useCallback((d: number) => {
    const next = index + d;
    if (next < moduleFirst || next > moduleLast) return;
    goTo(next, d);
  }, [index, moduleFirst, moduleLast, goTo]);

  const onTouchStart = (e: React.TouchEvent) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) turn(dx < 0 ? 1 : -1);
  };

  const page = pages[index];

  const TopBar = ({ showBack = true }: { showBack?: boolean }) => (
    <div className="flex items-center justify-between mb-4 shrink-0">
      {showBack ? (
        <button onClick={() => goTo(0, -1)} className="flex items-center gap-1.5 text-[11px] tracking-widest uppercase text-ink/55 cursor-pointer" style={{ fontFamily: '"Cinzel", serif' }}>
          ← {t.sumario.indice}
        </button>
      ) : <span />}
      <button onClick={toggleIdioma} className="px-2.5 py-1 border border-ink/30 text-[11px] tracking-widest uppercase" style={{ fontFamily: '"Cinzel", serif', color: '#1c1008' }}>
        {idioma === 'pt' ? 'EN 🇬🇧' : 'PT 🇧🇷'}
      </button>
    </div>
  );

  const renderPage = () => {
    switch (page.kind) {
      case 'sumario':
        return (
          <div className="h-full flex flex-col items-center justify-center text-center px-2">
            <button onClick={toggleIdioma} className="absolute top-5 right-5 px-2.5 py-1 border border-ink/30 text-[11px] tracking-widest uppercase" style={{ fontFamily: '"Cinzel", serif', color: '#1c1008' }}>
              {idioma === 'pt' ? 'EN 🇬🇧' : 'PT 🇧🇷'}
            </button>
            <div className="w-16 h-16 border-2 border-ink/50 flex items-center justify-center mb-4" style={{ transform: 'rotate(45deg)' }}>
              <span className="text-3xl font-medieval text-ink/70" style={{ transform: 'rotate(-45deg)' }}>G</span>
            </div>
            <h2 className="font-medieval text-2xl text-ink/80 mb-1">{t.sumario.tituloArte}</h2>
            <div className="gold-divider w-2/3 mx-auto" />
            <p className="font-body italic text-sm text-ink/60 mt-1 mb-6">{t.sumario.subtituloArte}</p>
            <ul className="flex flex-col gap-4 w-full max-w-[240px]">
              {([[1, t.sumario.cap1], [firstProjeto, t.sumario.cap2], [firstExp, t.sumario.cap3], [contatoIdx, t.sumario.cap4]] as [number, string][]).map(([to, label]) => (
                <li key={to}>
                  <button onClick={() => goTo(to, 1)} className="w-full text-left text-lg text-ink border-b border-ink/10 pb-1.5 cursor-pointer" style={{ fontFamily: '"Cinzel", serif' }}>
                    {label}
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={onClose} className="mt-8 text-[11px] tracking-widest text-ink/45 uppercase cursor-pointer" style={{ fontFamily: '"Cinzel", serif' }}>
              {t.geral.fecharTomo}
            </button>
          </div>
        );
      case 'sobre': {
        const s = t.sobreMim;
        return (
          <div className="h-full flex flex-col">
            <TopBar />
            <h2 className="text-2xl font-bold text-ink leading-tight mb-1" style={{ fontFamily: '"Cinzel Decorative", cursive' }}>{s.titulo}</h2>
            <div className="gold-divider mb-3" />
            <div className="flex-1 overflow-y-auto scrollbar-parchment pr-1 text-[15px] leading-relaxed text-justify text-ink/90 space-y-3" style={{ fontFamily: '"IM Fell English", serif' }}>
              <p>{s.p1_1}<strong style={{ fontFamily: '"Cinzel", serif' }}>Gustavo Firmino</strong>{s.p1_2}<strong style={{ color: '#8b0000' }}>React</strong>{s.p1_3}</p>
              <p>{s.p2_1}<strong style={{ color: '#8b0000' }}>Java + Spring Boot</strong>{s.p2_2}</p>
              <p>{s.p3}</p>
              <div className="border-t border-ink/15 pt-3">
                <p className="text-[10px] tracking-widest uppercase mb-2 opacity-60" style={{ fontFamily: '"Cinzel", serif' }}>Arsenal</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Java', 'Spring Boot', 'React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'].map(sk => (
                    <span key={sk} className="text-[11px] px-2 py-0.5 border border-ink/25 text-ink/80" style={{ fontFamily: '"Cinzel", serif' }}>{sk}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 'projeto': {
        const p = projetosData[page.i];
        return (
          <div className="h-full flex flex-col">
            <TopBar />
            <span className="self-start text-[11px] font-bold px-2.5 py-0.5 mb-2" style={{ background: '#8b0000', color: '#f2e4c4', fontFamily: '"Cinzel", serif', letterSpacing: '0.08em' }}>{p.data[idioma]}</span>
            <h3 className="text-xl font-bold text-ink leading-tight mb-3" style={{ fontFamily: '"Cinzel Decorative", cursive' }}>{p.titulo[idioma]}</h3>
            <div className="border-2 border-ink/30 overflow-hidden mb-3 shrink-0" style={{ background: '#e8d0a0', height: 168 }}>
              <img src={p.imagem} alt={p.titulo[idioma]} className="w-full h-full object-cover" style={{ filter: 'sepia(0.25)' }} loading="eager" />
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3 shrink-0">
              {p.tecnologias.map(tc => <span key={tc} className="text-[11px] px-2 py-0.5 border border-ink/25 text-ink/75" style={{ fontFamily: '"Cinzel", serif' }}>{tc}</span>)}
            </div>
            <p className="flex-1 overflow-y-auto scrollbar-parchment pr-1 text-[15px] text-justify leading-relaxed text-ink/90" style={{ fontFamily: '"IM Fell English", serif' }}>{p.descricao[idioma]}</p>
            <a href={p.github} target="_blank" rel="noreferrer" className="block text-center px-4 py-2.5 mt-3 border-2 border-ink text-ink font-bold shrink-0" style={{ fontFamily: '"Cinzel", serif', fontSize: '0.72rem', letterSpacing: '0.08em' }}>{t.projetos.btnGithub}</a>
          </div>
        );
      }
      case 'exp': {
        const e = experienciasData[page.i];
        return (
          <div className="h-full flex flex-col">
            <TopBar />
            <h2 className="text-2xl font-bold text-ink leading-tight mb-1" style={{ fontFamily: '"Cinzel Decorative", cursive' }}>{t.experiencias.titulo}</h2>
            <div className="gold-divider mb-4" />
            <div className="flex-1 overflow-y-auto scrollbar-parchment pr-1">
              <div className="relative pl-5 border-l-2 border-rubric/35">
                <div className="absolute w-2.5 h-2.5 bg-rubric -left-[7px] top-1.5" style={{ transform: 'rotate(45deg)' }} />
                <h3 className="text-xl font-bold leading-tight mb-0.5" style={{ fontFamily: '"Cinzel Decorative", cursive', color: '#8b0000' }}>{e.cargo[idioma]}</h3>
                <span className="text-sm italic text-ink/55 block mb-1" style={{ fontFamily: '"IM Fell English", serif' }}>{e.periodo[idioma]}</span>
                <h4 className="text-base font-bold mb-2 flex items-center gap-1.5 text-ink/80" style={{ fontFamily: '"Cinzel", serif' }}>
                  <span>{e.emoji}</span>{typeof e.instituicao === 'string' ? e.instituicao : e.instituicao[idioma]}
                </h4>
                <p className="text-[15px] leading-relaxed text-justify text-ink/80" style={{ fontFamily: '"IM Fell English", serif' }}>{e.descricao[idioma]}</p>
              </div>
            </div>
          </div>
        );
      }
      case 'contato':
        return (
          <div className="h-full overflow-y-auto scrollbar-parchment">
            <Contato voltar={() => goTo(0, -1)} idioma={idioma} toggleIdioma={toggleIdioma} />
          </div>
        );
    }
  };

  return (
    <motion.div key="open-m" style={{ position: 'relative', zIndex: 20, width: '100%', height: '100dvh', padding: '8px' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.25 } }} transition={{ duration: 0.35 }}>
      <div style={{ position: 'absolute', inset: 8, border: '2px solid #3d2008', boxShadow: '0 12px 40px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(200,146,15,0.12)', overflow: 'hidden', perspective: '1400px' }}
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <AnimatePresence mode="popLayout" custom={dir} initial={false}>
          <motion.div key={index} custom={dir}
            className="page-texture absolute inset-0"
            style={{ padding: '18px 18px 64px', transformOrigin: dir > 0 ? 'left center' : 'right center' }}
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: dir > 0 ? '55%' : '-55%', rotateY: dir > 0 ? -18 : 18 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: dir > 0 ? '-45%' : '45%', rotateY: dir > 0 ? 14 : -14 }}
            transition={{ duration: reduced ? 0.12 : 0.42, ease: [0.4, 0, 0.2, 1] }}>
            {renderPage()}
          </motion.div>
        </AnimatePresence>

        {/* Controles de página — presos ao módulo atual (não passam para o próximo capítulo).
            Pílula central, cantos livres p/ o botão Som. */}
        <div className="absolute left-0 right-0 bottom-0 flex justify-center pb-3 pointer-events-none" style={{ zIndex: 30 }}>
          <div className="pointer-events-auto flex items-center gap-2.5 pl-2 pr-2 py-1 rounded-full shadow-md" style={{ background: 'rgba(242,228,196,0.92)', border: '1px solid rgba(28,16,8,0.22)', backdropFilter: 'blur(2px)' }}>
            <button onClick={() => turn(-1)} disabled={index === moduleFirst}
              className={`w-9 h-9 flex items-center justify-center rounded-full text-xl ${index === moduleFirst ? 'opacity-20' : 'text-ink/75 active:bg-ink/10'}`}
              style={{ fontFamily: 'serif' }} aria-label="Página anterior">‹</button>
            <span className="text-ink/50 text-[11px] whitespace-nowrap px-1" style={{ fontFamily: '"Cinzel", serif' }}>
              {currentModule.label}{currentModule.count > 1 ? ` · ${posInModule}/${currentModule.count}` : ''}
            </span>
            <button onClick={() => turn(1)} disabled={index === moduleLast}
              className={`w-9 h-9 flex items-center justify-center rounded-full text-xl ${index === moduleLast ? 'opacity-20' : 'text-ink/75 active:bg-ink/10'}`}
              style={{ fontFamily: 'serif' }} aria-label="Próxima página">›</button>
          </div>
        </div>
      </div>
    </motion.div>
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
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

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
    if (soundEnabled) playPageTurn();
    // On phones or with reduced motion, swap pages instantly (no 3D flip).
    if (isMobile || reduced) { setIsFlipping(false); return; }
    setIsFlipping(true);
    const t1 = setTimeout(() => setIsFlipping(false), 820);
    timers.current.push(t1);
  }, [currentPage, isFlipping, soundEnabled, isMobile, reduced]);

  const openBook = useCallback(() => {
    setCoverFlipDone(false);
    setBookState('open');
    if (soundEnabled) playPageTurn();
  }, [soundEnabled]);

  const closeBook = useCallback(() => {
    setBookState('closed');
    setCurrentPage('sumario');
    setPreviousPage('sumario');
    setCoverFlipDone(false);
    setIsClosing(false);
  }, []);

  const initiateClose = useCallback(() => {
    if (isMobile || reduced) { closeBook(); return; }  // no cover-flip animation on phones
    setIsClosing(true);
  }, [isMobile, reduced, closeBook]);

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
      {!reduced && <DustParticles />}
      {!reduced && !isMobile && <MouseGlow />}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.85) 100%)', zIndex: 5 }} />

      <AnimatePresence mode="wait">

        {/* ── FECHADO ── */}
        {bookState === 'closed' && (
          <motion.div key="closed" style={{ position: 'relative', zIndex: 20 }}
            initial={{ opacity: 0, y: 32, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: isMobile ? 0.68 : 1 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.35, ease: 'easeIn' } }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <BookScene>
              <ClosedBook t={t} idioma={idioma} onOpen={openBook} toggleIdioma={toggleIdioma} />
            </BookScene>
          </motion.div>
        )}

        {/* ── ABERTO (MOBILE): folheador, uma página por tela ── */}
        {bookState === 'open' && isMobile && (
          <MobileBook key="open-m" t={t} idioma={idioma} toggleIdioma={toggleIdioma} onClose={closeBook} reduced={reduced} soundEnabled={soundEnabled} />
        )}

        {/* ── ABERTO (DESKTOP): livro de duas páginas ── */}
        {bookState === 'open' && !isMobile && (
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
                  transition={{ duration: 0.78, times: [0, 0.84, 0.92, 1] }}>
                  {renderPage(previousPage)}
                </motion.div>
              )}
              <motion.div key={`curr-${currentPage}`} className="absolute inset-0" style={{ zIndex: 1 }}
                initial={isFlipping ? { opacity: 0 } : false}
                animate={isFlipping ? { opacity: [0, 0, 1, 1] } : { opacity: coverFlipDone && !isClosing ? 1 : 0 }}
                transition={isFlipping ? { duration: 0.78, times: [0, 0.86, 0.94, 1] } : coverFlipDone ? { duration: 0.15 } : { duration: 0 }}>
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
