import React from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { ActivityCard } from '../components/ActivityCard';
import { Shield, Users, Terminal, Cpu, CheckCircle, ArrowRight } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <section id="about" className="py-20 md:py-28 relative border-t border-[#2A2A2A]/80 bg-[#080808]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#111111] border border-[#2A2A2A] text-[#FF1A1A] font-mono text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF1A1A]" />
              MISSION INTEL
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
              ABOUT <span className="text-[#FF1A1A]">TVM HACKERS HUB</span>
            </h2>
            <div className="w-20 h-1 bg-[#FF1A1A] mx-auto mt-4 shadow-[0_0_8px_#FF1A1A]" />
            <p className="mt-6 text-base sm:text-lg text-[#E5E5E5]/80 leading-relaxed">
              TVM Hackers Hub is a community-driven platform for students and cybersecurity enthusiasts to learn, experiment, collaborate, and participate in practical security activities.
            </p>
          </div>

          {/* About Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-[#111111] border border-[#2A2A2A] hover:border-[#FF1A1A]/50 rounded-lg p-6 sm:p-8 transition-all duration-300">
              <div className="w-12 h-12 rounded bg-[#080808] border border-[#2A2A2A] flex items-center justify-center text-[#FF1A1A] mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-2">Peer Collaboration</h3>
              <p className="text-sm text-[#999999] leading-relaxed">
                Connect with passionate cybersecurity researchers, students, and practitioners across Trivandrum to collaborate on research and CTF teams.
              </p>
            </div>

            <div className="bg-[#111111] border border-[#2A2A2A] hover:border-[#FF1A1A]/50 rounded-lg p-6 sm:p-8 transition-all duration-300">
              <div className="w-12 h-12 rounded bg-[#080808] border border-[#2A2A2A] flex items-center justify-center text-[#FF1A1A] mb-6">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-2">Hands-on Security</h3>
              <p className="text-sm text-[#999999] leading-relaxed">
                Move beyond theoretical concepts with live vulnerability walkthroughs, network emulation, reverse engineering, and exploit defense labs.
              </p>
            </div>

            <div className="bg-[#111111] border border-[#2A2A2A] hover:border-[#FF1A1A]/50 rounded-lg p-6 sm:p-8 transition-all duration-300">
              <div className="w-12 h-12 rounded bg-[#080808] border border-[#2A2A2A] flex items-center justify-center text-[#FF1A1A] mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-2">Ethical Standards</h3>
              <p className="text-sm text-[#999999] leading-relaxed">
                We strictly promote white-hat defensive operations and responsible disclosure, upholding the highest standards of cybersecurity ethics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section id="activities" className="py-20 md:py-28 relative border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#111111] border border-[#2A2A2A] text-[#FF1A1A] font-mono text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF1A1A]" />
              OPERATIONAL TRACKS
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
              COMMUNITY <span className="text-[#FF1A1A]">ACTIVITIES</span>
            </h2>
            <div className="w-20 h-1 bg-[#FF1A1A] mx-auto mt-4 shadow-[0_0_8px_#FF1A1A]" />
            <p className="mt-6 text-base sm:text-lg text-[#E5E5E5]/80 leading-relaxed">
              Elevate your defensive and offensive skills across our structured programs and challenge arenas.
            </p>
          </div>

          {/* Activity Cards (CTF, Hackathons, Workshops) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <ActivityCard
              title="CAPTURE THE FLAG"
              subtitle="WOLF ARENA"
              description="Practice security concepts through challenges, problem solving and hands-on learning across Web, Crypto, Forensics, and Pwn."
              iconName="flag"
              tag="FLAG BATTLES"
            />

            <ActivityCard
              title="HACKATHONS"
              subtitle="RAPID INNOVATION"
              description="Collaborate, build innovative solutions and solve real-world technical problems with security tools, automation, and defense bots."
              iconName="award"
              tag="TEAM SPRINT"
            />

            <ActivityCard
              title="WORKSHOPS"
              subtitle="EXPERT SESSIONS"
              description="Learn cybersecurity concepts through practical sessions and technical demonstrations led by experienced security analysts."
              iconName="book"
              tag="BOOTCAMPS"
            />
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="py-16 bg-[#080808] border-t border-b border-[#2A2A2A] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF1A1A]/5 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-wider">
            READY TO JOIN <span className="text-[#FF1A1A]">TVM HACKERS HUB?</span>
          </h2>
          <p className="font-mono text-sm sm:text-base text-[#999999] max-w-xl mx-auto uppercase tracking-widest">
            CONNECT • HACK RESPONSIBLY • SCALE YOUR CAREER
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-md bg-[#FF1A1A] hover:bg-[#FF3333] text-white font-mono font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(255,26,26,0.6)]"
            >
              <span>REGISTER AS A MEMBER</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
