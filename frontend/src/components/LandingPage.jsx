import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Sprout,
    BrainCircuit,
    Cpu,
    ShieldCheck,
    TrendingUp,
    Users,
    ChevronDown,
    ArrowRight,
    Leaf,
    Activity,
    Smartphone
} from 'lucide-react';
import HeroSection from './HeroSection'; // Reusing the Hero logic for the top section
import { useAuth } from '../context/AuthContext';

const Section = ({ children, className = "" }) => (
    <section className={`py-20 px-6 md:px-12 relative overflow-hidden ${className}`}>
        {children}
    </section>
);

const LandingPage = () => {
    const { user } = useAuth();

    // Smooth scroll utility features
    const features = [
        { icon: BrainCircuit, title: "AI Disease Detection", desc: "Identify plant diseases instantly with 98% accuracy using our advanced computer vision models." },
        { icon: Sprout, title: "Smart Crop Recommendations", desc: "Get data-driven suggestions for the best crops to plant based on your soil and climate data." },
        { icon: Activity, title: "Real-time Soil Analysis", desc: "Monitor NPK levels, moisture, and pH balance to ensure optimal growing conditions." },
        { icon: TrendingUp, title: "Yield Prediction", desc: "Forecast your harvest quantity and quality using historical data and predictive analytics." },
        { icon: ShieldCheck, title: "Risk Assessment", desc: "Stay ahead of weather patterns and pest outbreaks with proactive alerts and advisories." },
        { icon: Users, title: "Farmer Community", desc: "Connect, share knowledge, and trade with a network of modern farmers." }
    ];

    const steps = [
        { num: "01", title: "Capture", desc: "Take a photo of your crop or upload soil data via the dashboard." },
        { num: "02", title: "Analyze", desc: "Our AI processes the input using millions of data points." },
        { num: "03", title: "Diagnose", desc: "Receive instant health reports and actionable treatment plans." },
        { num: "04", title: "Optimize", desc: "Apply recommendations to boost yield and reduce waste." }
    ];

    return (
        <div className="font-sans text-gray-900 bg-agro-cream selection:bg-agro-green selection:text-white">

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-black/20 backdrop-blur-md border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-agro-green to-agro-darkGreen flex items-center justify-center">
                        <Leaf className="text-white" size={20} />
                    </div>
                    <span className="font-syncopate font-bold text-white text-xl tracking-wider">AGRO<span className="text-agro-green">360</span></span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
                    <a href="#about" className="hover:text-white transition-colors">About</a>
                </div>
                <Link to={user ? "/dashboard" : "/login"}>
                    <button className="px-6 py-2 rounded-full bg-white text-agro-darkGreen font-semibold text-sm hover:bg-agro-green hover:text-white transition-all duration-300 transform hover:scale-105">
                        {user ? "Go to Dashboard" : "Get Started"}
                    </button>
                </Link>
            </nav>

            {/* Hero Section (Reused but integrated) */}
            <div className="relative h-screen">
                <HeroSection isSplash={false} />
                <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center animate-bounce">
                    <ChevronDown className="text-white/50" size={32} />
                </div>
            </div>

            {/* About / Value Prop */}
            <Section className="bg-white">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6 leading-tight">
                            Farming Meets <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-agro-green to-agro-lime-400">Artificial Intelligence</span>
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Agro360 is your digital agricultural companion. We bridge the gap between traditional farming and modern technology, creating a digital twin of your farm to optimize every decision you make.
                        </p>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-2 p-4 bg-agro-cream rounded-2xl border border-agro-green/10">
                                <span className="text-3xl font-bold text-agro-darkGreen">98%</span>
                                <span className="text-sm text-gray-500 font-medium">Accuracy in Detection</span>
                            </div>
                            <div className="flex flex-col gap-2 p-4 bg-agro-cream rounded-2xl border border-agro-green/10">
                                <span className="text-3xl font-bold text-agro-darkGreen">24/7</span>
                                <span className="text-sm text-gray-500 font-medium">Real-time Monitoring</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-agro-green/20 to-transparent rounded-3xl transform rotate-3 scale-105" />
                        <img
                            src="https://images.unsplash.com/photo-1625246333195-58197bd47f26?auto=format&fit=crop&q=80&w=1000"
                            alt="Smart Farming"
                            className="relative rounded-3xl shadow-2xl object-cover h-[500px] w-full"
                        />
                    </div>
                </div>
            </Section>

            {/* How It Works */}
            <Section className="bg-slate-900 text-white" id="how-it-works">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-agro-green font-mono text-sm tracking-widest uppercase mb-2 block">Process</span>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold">How Agro360 Works</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className="relative p-6 pt-12 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm group hover:bg-white/10 transition-colors"
                            >
                                <span className="absolute top-6 left-6 text-6xl font-black text-white/5 group-hover:text-agro-green/20 transition-colors">{step.num}</span>
                                <h3 className="text-xl font-bold mb-4 relative z-10">{step.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed relative z-10">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Features Staggered Grid */}
            <Section id="features" className="bg-agro-cream">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-4">Comprehensive Tools</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Everything you need to manage your farm, from soil to sale.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-agro-green/30 transition-all group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-agro-green/10 text-agro-darkGreen flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-sm">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* AI Awareness Section */}
            <Section className="bg-black text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-agro-green/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-agro-green text-xs font-bold uppercase tracking-wider mb-6">
                            <Cpu size={14} />
                            <span>Powered by Gemini 2.0</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Why AI matter in Agriculture?</h2>
                        <div className="space-y-6 text-gray-300">
                            <p>
                                Traditional farming relies on intuition. AI farming relies on <strong>precision</strong>. With Agro360, you're not just guessing; you're knowing.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-agro-green flex items-center justify-center text-black text-xs font-bold">✓</div>
                                    <div>
                                        <strong className="text-white">Early Detection:</strong> Spot diseases before they spread to your entire crop.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-agro-green flex items-center justify-center text-black text-xs font-bold">✓</div>
                                    <div>
                                        <strong className="text-white">Resource Optimization:</strong> Save water and fertilizer by applying exactly what's needed.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-agro-green flex items-center justify-center text-black text-xs font-bold">✓</div>
                                    <div>
                                        <strong className="text-white">Yield Maximization:</strong> Predictive analytics to help you harvest at the perfect time.
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl relative">
                            {/* Code snippet decoration */}
                            <div className="font-mono text-xs text-green-400">
                                <div className="mb-2 text-gray-500">// AI Model Analysis</div>
                                <div><span className="text-purple-400">const</span> <span className="text-blue-400">analyzeCrop</span> = <span className="text-purple-400">async</span> (data) ={'>'} {'{'}</div>
                                <div className="pl-4"><span className="text-purple-400">const</span> health = <span className="text-purple-400">await</span> model.predict(data);</div>
                                <div className="pl-4"><span className="text-purple-400">if</span> (health.risk {'>'} <span className="text-orange-400">0.8</span>) {'{'}</div>
                                <div className="pl-8">alert(<span className="text-amber-300">'Early Blight Detected'</span>);</div>
                                <div className="pl-4">{'}'}</div>
                                <div>{'}'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Testimonials */}
            <Section className="bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-heading font-bold mb-12">Trusted by Modern Farmers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 bg-gray-50 rounded-3xl text-left">
                            <div className="flex gap-1 text-yellow-500 mb-4">
                                {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                            </div>
                            <p className="text-gray-600 mb-6 italic">"Agro360 saved my potato harvest this year. The early blight detection was spot on, weeks before I could see it with my own eyes."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-300" />
                                <div>
                                    <div className="font-bold text-gray-900">Rajesh Kumar</div>
                                    <div className="text-xs text-gray-500">Punjab, India</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 bg-gray-50 rounded-3xl text-left">
                            <div className="flex gap-1 text-yellow-500 mb-4">
                                {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                            </div>
                            <p className="text-gray-600 mb-6 italic">"The soil analysis feature helps me apply the exact amount of fertilizer. I've saved 30% on costs this season."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-300" />
                                <div>
                                    <div className="font-bold text-gray-900">Sarah Jenkins</div>
                                    <div className="text-xs text-gray-500">California, USA</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* CTA / Footer */}
            <footer className="bg-agro-darkGreen text-white py-20 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">Ready to modernize <br />your farm?</h2>
                        <p className="text-agro-lightGreen text-lg mb-8 max-w-md">Join thousands of farmers using AI to grow better, faster, and smarter.</p>
                        <Link to="/register">
                            <button className="px-8 py-4 rounded-full bg-white text-agro-darkGreen font-bold text-lg hover:bg-agro-green hover:text-white transition-all shadow-lg hover:shadow-xl">
                                Create Free Account
                            </button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-12 text-sm text-agro-lightGreen/80">
                        <div className="flex flex-col gap-4">
                            <span className="font-bold text-white uppercase tracking-wider">Platform</span>
                            <a href="#" className="hover:text-white transition-colors">Features</a>
                            <a href="#" className="hover:text-white transition-colors">Pricing</a>
                            <a href="#" className="hover:text-white transition-colors">API</a>
                        </div>
                        <div className="flex flex-col gap-4">
                            <span className="font-bold text-white uppercase tracking-wider">Company</span>
                            <a href="#" className="hover:text-white transition-colors">About Us</a>
                            <a href="#" className="hover:text-white transition-colors">Careers</a>
                            <a href="#" className="hover:text-white transition-colors">Contact</a>
                        </div>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-white/10 flex justify-between items-center text-xs text-white/40">
                    <div>© 2024 Agro360. All rights reserved.</div>
                    <div className="flex gap-6">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default LandingPage;
