'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  Phone, 
  MessageSquare, 
  ArrowRight, 
  DoorOpen, 
  Lock, 
  Layers, 
  Sparkles,
  ChevronRight,
  Star,
  MapPin,
  Clock,
  Award,
  Users,
  ShieldCheck,
  Zap
} from 'lucide-react';
import PriceListTable from '@/components/PriceListTable';
import { INITIAL_CATEGORIES } from '@/lib/seedData';

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count.toLocaleString('en-IN')}{suffix}
    </span>
  );
}

/* ─── Typewriter ─── */
function TypewriterText({ words, className }: { words: string[]; className?: string }) {
  const [currentWord, setCurrentWord] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWord];
    const timeout = deleting ? 40 : 100;

    const timer = setTimeout(() => {
      if (!deleting && currentChar < word.length) {
        setCurrentChar(currentChar + 1);
      } else if (!deleting && currentChar === word.length) {
        setTimeout(() => setDeleting(true), 1500);
      } else if (deleting && currentChar > 0) {
        setCurrentChar(currentChar - 1);
      } else if (deleting && currentChar === 0) {
        setDeleting(false);
        setCurrentWord((currentWord + 1) % words.length);
      }
    }, timeout);

    return () => clearTimeout(timer);
  }, [currentChar, deleting, currentWord, words]);

  return (
    <span className={className}>
      {words[currentWord].slice(0, currentChar)}
      <span className="animate-pulse">|</span>
    </span>
  );
}

/* ─── Floating Particles Background ─── */
function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{ ix: number; iy: number; ax1: number; ay1: number; ax2: number; ay2: number; dur: number; del: number }>>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }).map(() => ({
        ix: Math.random() * 100,
        iy: Math.random() * 100,
        ax1: Math.random() * 100,
        ay1: Math.random() * 100,
        ax2: Math.random() * 100,
        ay2: Math.random() * 100,
        dur: 8 + Math.random() * 10,
        del: Math.random() * 5,
      }))
    );
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          initial={{
            x: `${p.ix}%`,
            y: `${p.iy}%`,
            opacity: 0
          }}
          animate={{
            y: [`${p.ay1}%`, `${p.ay2}%`],
            x: [`${p.ax1}%`, `${p.ax2}%`],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            ease: 'linear',
            delay: p.del
          }}
        />
      ))}
    </div>
  );
}

/* ─── Scroll Reveal Wrapper ─── */
function ScrollReveal({ children, delay = 0, direction = 'up' }: { children: React.ReactNode; delay?: number; direction?: 'up' | 'left' | 'right' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 60 : 0,
      x: direction === 'left' ? -60 : direction === 'right' ? 60 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Marquee ─── */
function Marquee() {
  const items = ['\u2605 Premium Hardware', '\u2605 Marine Plywood', '\u2605 Toughened Glass', '\u2605 Mortise Locks', '\u2605 Brass Aldrops', '\u2605 Tower Bolts', '\u2605 Door Hinges', '\u2605 Laminates'];
  return (
    <div className="overflow-hidden border-y border-white/5 bg-white/[0.02] py-4">
      <motion.div
        className="flex gap-12 whitespace-nowrap text-sm text-neutral-500 font-medium tracking-wide"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex-shrink-0">{item}</span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const stats = [
    { label: 'Products In Stock', value: 500, suffix: '+', icon: Layers },
    { label: 'Years Of Service', value: 15, suffix: '+', icon: Award },
    { label: 'Happy Customers', value: 10000, suffix: '+', icon: Users },
    { label: 'Categories', value: 8, suffix: '', icon: DoorOpen },
  ];

  return (
    <div className="overflow-hidden">
      {/* 1. HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        <FloatingParticles />
        
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Radial glow */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div 
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Badge */}
          <ScrollReveal>
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs sm:text-sm font-semibold tracking-widest mb-8"
              whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.3)' }}
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.span>
              MAHAVEER GLASS & PLYWOOD HARDWARE
            </motion.div>
          </ScrollReveal>

          {/* Main Headline */}
          <ScrollReveal delay={0.1}>
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tight text-white leading-[1.05] mb-6">
              Quality Hardware
              <br />
              <span className="text-neutral-500">
                <TypewriterText words={['Under One Roof', 'For Every Home', 'Built To Last', 'At Best Prices']} />
              </span>
            </h1>
          </ScrollReveal>

          {/* Subtitle */}
          <ScrollReveal delay={0.2}>
            <p className="text-base sm:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-10">
              Premium glass, marine plywood, laminates & architectural hardware — serving Chennai since over a decade.
            </p>
          </ScrollReveal>

          {/* CTA Buttons */}
          <ScrollReveal delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/products"
                  className="group px-8 py-4 rounded-2xl bg-white text-black font-bold text-base shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] transition-shadow flex items-center gap-3"
                >
                  View Products
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/contact"
                  className="px-8 py-4 rounded-2xl bg-transparent border-2 border-white/20 text-white font-bold text-base hover:border-white/50 transition-colors"
                >
                  Get a Quote
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.97 }}>
                <a
                  href="https://wa.me/917871457430?text=Hello%20Mahaveer%20Glass%20%26%20Plywood%20Hardware,%20I%20am%20interested%20in%20your%20products."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-white font-bold text-base hover:bg-neutral-800 transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  WhatsApp Us
                </a>
              </motion.div>
            </div>
          </ScrollReveal>

          {/* Phone */}
          <ScrollReveal delay={0.4}>
            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-neutral-500">
              <span className="flex items-center gap-2 font-semibold text-neutral-300">
                <Phone className="w-4 h-4 text-white" /> Store Hotline:
              </span>
              <a href="tel:7871457430" className="hover:text-white transition-colors">78714 57430</a>
              <span className="text-white/20">|</span>
              <a href="tel:7845559880" className="hover:text-white transition-colors">78455 59880</a>
              <span className="text-white/20">|</span>
              <a href="tel:9080457430" className="hover:text-white transition-colors">90804 57430</a>
            </div>
          </ScrollReveal>

          {/* Scroll indicator */}
          <motion.div
            className="mt-16 flex flex-col items-center text-neutral-500 text-xs"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="mb-2">Scroll to explore</span>
            <div className="w-5 h-8 border-2 border-white/20 rounded-full flex items-start justify-center p-1">
              <motion.div
                className="w-1.5 h-1.5 bg-white rounded-full"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Marquee Banner */}
      <Marquee />

      {/* 2. STATS SECTION */}
      <section className="py-20 bg-black relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <motion.div
                    className="group relative p-8 rounded-3xl bg-neutral-900/30 border border-white/5 hover:border-white/20 transition-all duration-500 text-center overflow-hidden"
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white group-hover:border-white flex items-center justify-center mx-auto mb-4 transition-all duration-500">
                        <Icon className="w-6 h-6 text-neutral-400 group-hover:text-black transition-colors duration-500" />
                      </div>
                      <div className="text-3xl sm:text-4xl font-black text-white mb-2">
                        <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                      </div>
                      <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">{stat.label}</p>
                    </div>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. PRODUCT CATEGORIES */}
      <section className="py-24 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="text-xs text-neutral-500 uppercase tracking-[0.3em] font-bold">Our Range</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Explore Product Categories
              </h2>
              <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
                From heavy-duty brass door locks to premium laminates and toughened glass fittings.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {INITIAL_CATEGORIES.map((cat, i) => (
              <ScrollReveal key={cat.id} delay={i * 0.08}>
                <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <Link
                    href={`/products?category=${encodeURIComponent(cat.name)}`}
                    className="group block p-7 rounded-3xl bg-neutral-900/30 backdrop-blur-sm border border-white/5 hover:border-white/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] relative overflow-hidden h-full"
                  >
                    {/* Animated corner glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-bl-full" />

                    <div className="space-y-5 relative z-10">
                      <motion.div 
                        className="w-14 h-14 rounded-2xl bg-black border border-white/10 group-hover:border-white group-hover:bg-white flex items-center justify-center text-neutral-400 group-hover:text-black transition-all duration-500 shadow-lg"
                        whileHover={{ rotate: 5 }}
                      >
                        {cat.name.includes('Lock') ? <Lock className="w-7 h-7" /> :
                         cat.name.includes('Plywood') || cat.name.includes('Laminates') ? <Layers className="w-7 h-7" /> :
                         <DoorOpen className="w-7 h-7" />}
                      </motion.div>
                      <h3 className="text-xl font-bold text-neutral-200 group-hover:text-white transition-colors duration-300">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-neutral-500 group-hover:text-neutral-400 leading-relaxed transition-colors duration-300">
                        {cat.description}
                      </p>
                    </div>
                    <div className="mt-6 pt-5 border-t border-white/5 group-hover:border-white/20 flex items-center justify-between text-sm font-semibold text-neutral-500 group-hover:text-white transition-all duration-300 relative z-10">
                      <span>Explore</span>
                      <motion.div 
                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300"
                        whileHover={{ x: 5 }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </Link>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee 2 */}
      <Marquee />

      {/* 4. PRICE LIST */}
      <section className="py-24 bg-black relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <PriceListTable />
          </ScrollReveal>
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="text-xs text-neutral-500 uppercase tracking-[0.3em] font-bold">Why Us</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Why Choose Mahaveer?
              </h2>
              <p className="text-neutral-400 text-base sm:text-lg">
                Trusted by contractors, builders, and homeowners across Chennai.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: 'Wide Range of Hardware', desc: 'S.S & Brass keels, tower bolts, aldrops, rim locks, mortise locks, and magnetic catchers under one roof.' },
              { icon: MapPin, title: 'Prime Location', desc: 'No. 21, Chetty Street, Old Pallavaram \u2014 easy access for contractors, carpenters, and builders.' },
              { icon: Phone, title: 'Direct Assistance', desc: 'WhatsApp and phone support to verify specs, dimensions, finish variants and current prices instantly.' },
              { icon: Zap, title: 'Quality Products', desc: 'We stock only industry-grade products from trusted manufacturers for long-lasting durability.' },
              { icon: Clock, title: 'Quick Service', desc: 'Walk-in or call ahead \u2014 we get your order ready quickly so you can get back to your project.' },
              { icon: Star, title: 'Customer Focused', desc: 'Personalized advice on hardware grade, lock sizes, and finish variants (Antique / S.S / Brass).' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={i} delay={i * 0.08}>
                  <motion.div
                    className="group relative p-8 rounded-3xl bg-neutral-900/20 border border-white/5 hover:border-white/20 transition-all duration-500 overflow-hidden"
                    whileHover={{ y: -5 }}
                  >
                    <motion.div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)' }}
                    />
                    
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white group-hover:border-white flex items-center justify-center mb-6 transition-all duration-500">
                        <Icon className="w-6 h-6 text-neutral-400 group-hover:text-black transition-colors duration-500" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                      <p className="text-sm text-neutral-500 group-hover:text-neutral-400 leading-relaxed transition-colors">{item.desc}</p>
                    </div>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. STORE CTA */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <motion.div 
              className="relative p-12 sm:p-16 rounded-[2rem] border border-white/10 overflow-hidden group"
              whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-black" />
              <motion.div 
                className="absolute inset-0 opacity-20"
                animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
                style={{
                  backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)',
                  backgroundSize: '200% 200%'
                }}
              />

              <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
                <div className="space-y-4 text-center lg:text-left max-w-2xl">
                  <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                    Visit Our Store
                  </h2>
                  <p className="text-neutral-400 text-base sm:text-lg">
                    No. 21, Chetty Street, Old Pallavaram, Chennai - 600 117. Get the best prices on hardware, glass, and plywood.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                  <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.97 }}>
                    <a
                      href="tel:7871457430"
                      className="px-8 py-4 rounded-2xl bg-black border-2 border-white/20 text-white font-bold text-sm hover:border-white/50 transition-all flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Call 78714 57430
                    </a>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/contact"
                      className="px-8 py-4 rounded-2xl bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                    >
                      Get Directions \u2192
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
