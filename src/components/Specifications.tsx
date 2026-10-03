"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  Palette,
  Lightbulb,
  Award,
  Sparkles,
  Rocket,
  Tag,
  ShieldCheck,
  CheckCircle2,
  PackageCheck,
  Users,
} from 'lucide-react';

const SPECS = [
  {
    icon: Palette,
    title: 'Colorful Crackers',
    description:
      'Our crackers are not just a feast for celebrations—they are an artful spectacle for the eyes! Available in vivid chromatic spectrums, each box is packaged in stylish, damage-resistant festive cases.',
  },
  {
    icon: Lightbulb,
    title: 'Innovative Formulations',
    description:
      'We curate pyrotechnics that stand out with unique aerial burst patterns, whistling sound effects, smokeless titanium compositions, and child-friendly low-heat sparkles tailored to modern celebrations.',
  },
  {
    icon: Award,
    title: 'Supreme Festive Quality',
    description:
      'The difference lies in our rigorous quality standards. Every chemical batch undergoes laboratory humidity and flash-point testing, ensuring 100% reliable ignition and safe family enjoyment.',
  },
  {
    icon: Sparkles,
    title: 'Inspiring Crackers',
    description:
      'Known for being safe, affordable, and premium in formulation, Sivaji Firecracker inspires trust across Telangana and Pan-India, setting high benchmarks for legal compliance and craftsmanship.',
  },
  {
    icon: Rocket,
    title: 'Fancy Night Pyrotechnics',
    description:
      'With soaring enthusiasm for night shots and aerial repeaters, our catalog features 12 to 120-shot continuous cakes and multi-break shell mortars reaching heights up to 150 feet.',
  },
  {
    icon: Tag,
    title: 'Factory-Direct Wholesale Rates',
    description:
      'We regularly audit our price lists against factory production costs to ensure you receive uninflated wholesale rates—saving up to 80% off standard retail store prices.',
  },
];

const WHY_CHOOSE_US = [
  {
    icon: PackageCheck,
    title: 'Quality Products',
    desc: 'Strictly zero-barium, tested raw materials with high shelf-life.',
  },
  {
    icon: Tag,
    title: 'Affordable Rates',
    desc: 'Direct factory gate pricing without middleman distributor commissions.',
  },
  {
    icon: Rocket,
    title: '150+ Wide Variety',
    desc: 'From traditional 2.75" kuruvi to 120-shot grand sky cakes.',
  },
  {
    icon: Users,
    title: 'Bulk & Society Orders',
    desc: 'Dedicated delivery arrangements for residential welfare associations.',
  },
];

export const Specifications: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Why Choose Us Badges Grid */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-xl mx-auto mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-black text-[#1C1411] tracking-tight">
              Why Choose Sivaji Firecracker
            </h2>
            <p className="text-xs sm:text-sm text-[#66574F] mt-1">
              Trusted by 1,000+ families and wholesale buyers across Hyderabad and Telangana
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {WHY_CHOOSE_US.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-5 rounded-2xl border border-[#E2D7C5] shadow-sm hover:shadow-xl transition-shadow hover:border-[#C98E2A]/60 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FFF8ED] border border-[#C98E2A]/30 flex items-center justify-center text-[#B85D00] mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-[#1C1411] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#66574F] leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Specifications Grid */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8ED] text-[#B85D00] text-xs font-bold uppercase tracking-wider mb-2 border border-[#C98E2A]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#C98E2A]" />
            <span>Manufacturing Standards</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1C1411] tracking-tight">
            Our Specifications
          </h2>
          <p className="text-xs sm:text-sm text-[#66574F] mt-2 font-normal">
            Every product in our catalog meets strict safety and chemical compliance standards set by explosive authorities.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {SPECS.map((spec, i) => {
            const Icon = spec.icon;
            return (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -6, scale: 1.015 }}
                transition={{ duration: 0.35 }}
                className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2D7C5] shadow-sm hover:shadow-xl transition-shadow flex flex-col justify-between hover:border-[#C98E2A]/50"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFF8ED] to-[#F2EBE0] border border-[#C98E2A]/30 flex items-center justify-center text-[#550C12] mb-4">
                    <Icon className="w-6 h-6 text-[#550C12]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-[#1C1411] mb-2">
                    {spec.title}
                  </h3>
                  <p className="text-xs text-[#66574F] leading-relaxed">
                    {spec.description}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#E2D7C5]/50 flex items-center gap-1.5 text-[11px] font-bold text-[#07542C]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Quality Tested & Certified</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
