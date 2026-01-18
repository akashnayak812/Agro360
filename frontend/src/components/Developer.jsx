import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
    Code2,
    Mail,
    User,
    Calendar,
    Shield,
    Database,
    Github,
    Linkedin,
    Globe,
    Award,
    Layers,
    Terminal,
    Crown,
    Users,
    Sparkles,
    Cpu,
    Palette,
    Server,
    Brain
} from 'lucide-react';

const Developer = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
    const scrollContainerRef = useRef(null);

    const teamMembers = [
        {
            name: "Akash Degavath",
            position: "Founder & Lead Developer",
            role: "Full Stack Developer",
            email: "akashswaero@gmail.com",
            avatar: "AD",
            image: "/IMG20251026080811.jpg", // Image from public folder
            contributions: [
                "Project architecture and overall system design",
                "Backend development with Flask and Python",
                "Machine Learning model integration",
                "Firebase authentication and database setup",
                "API development and REST endpoints",
                "Deployment and DevOps configuration"
            ],
            workAreas: [
                "Backend Infrastructure",
                "ML Integration",
                "Authentication System",
                "Database Design",
                "API Architecture"
            ],
            skills: ["Python", "Flask", "Firebase", "ML/AI", "PostgreSQL", "REST APIs"],
            icon: Crown,
            color: "from-purple-500 to-indigo-600",
            social: {
                github: "https://github.com/akashnayak812",
                linkedin: "https://linkedin.com/in/akash-degavath"
            }
        },
        {
            name: "Santosh Pawar",
            position: "Co-Founder & Frontend Lead",
            role: "Frontend Developer",
            email: "member2@agro360.com",
            avatar: "TM",
            image:"/WhatsApp Image 2025-12-29 at 21.59.46.jpeg", // Add image URL here: "/path/to/image.jpg" or leave null for initials
            contributions: [
                "React frontend architecture and component design",
                "Responsive UI/UX implementation with Tailwind CSS",
                "State management and React Context setup",
                "Dashboard and data visualization components",
                "Multi-language support (i18n) integration",
                "Frontend performance optimization"
            ],
            workAreas: [
                "Frontend Development",
                "UI/UX Design",
                "Component Architecture",
                "State Management",
                "Responsive Design"
            ],
            skills: ["React.js", "Tailwind CSS", "JavaScript", "Vite", "Framer Motion", "i18n"],
            icon: Palette,
            color: "from-green-500 to-emerald-600",
            social: {
                github: "https://github.com/member2",
                linkedin: "https://linkedin.com/in/member2"
            }
        },
        {
            name: "Bhagav Raj Kavadi",
            position: "Co-Founder & ML Engineer",
            role: "Machine Learning Engineer",
            email: "member3@agro360.com",
            avatar: "ML",
            image: "/WhatsApp Image 2025-12-29 at 21.50.22.jpeg", // Add image URL here: "/path/to/image.jpg" or leave null for initials
            contributions: [
                "ML models for crop recommendation and yield prediction",
                "Disease detection model training and optimization",
                "Fertilizer recommendation algorithm development",
                "Soil analysis prediction models",
                "Model accuracy improvement and validation",
                "Gemini AI integration for advisory services"
            ],
            workAreas: [
                "Machine Learning Models",
                "AI Integration",
                "Data Science",
                "Model Training",
                "Algorithm Development"
            ],
            skills: ["TensorFlow", "Scikit-learn", "Python", "Data Science", "Gemini AI", "NumPy"],
            icon: Brain,
            color: "from-blue-500 to-cyan-600",
            social: {
                github: "https://github.com/member3",
                linkedin: "https://linkedin.com/in/member3"
            }
        },
        {
            name: "Manikanta Chinnam",
            position: "Co-Founder & Integration Specialist",
            role: "Backend & Integration Developer",
            email: "member4@agro360.com",
            avatar: "IS",
            image: "/WhatsApp Image 2025-12-29 at 21.50.21.jpeg", // Add image URL here: "/path/to/image.jpg" or leave null for initials
            contributions: [
                "Backend routes and API endpoint development",
                "Third-party service integrations",
                "Voice assistant functionality implementation",
                "Community features and real-time updates",
                "Data processing and validation logic",
                "Testing and quality assurance"
            ],
            workAreas: [
                "API Development",
                "Service Integration",
                "Backend Logic",
                "Testing & QA",
                "Feature Development"
            ],
            skills: ["Python", "Flask", "APIs", "Integration", "Testing", "Git"],
            icon: Server,
            color: "from-orange-500 to-red-600",
            social: {
                github: "https://github.com/member4",
                linkedin: "https://linkedin.com/in/member4"
            }
        }
    ];

    const projectStats = {
        teamSize: "4 Members",
        developmentTime: "6+ Months",
        features: "15+ Features",
        technologies: "20+ Tech Stack"
    };

    // Handle scroll to update current member index
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollLeft = container.scrollLeft;
            const cardWidth = container.querySelector('div')?.offsetWidth || 0;
            const gap = 24; // 6 * 4px (gap-6)
            const index = Math.round(scrollLeft / (cardWidth + gap));
            setCurrentMemberIndex(Math.min(index, teamMembers.length - 1));
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [teamMembers.length]);

    const goToMember = (index) => {
        const container = scrollContainerRef.current;
        if (!container) return;
        
        const cardWidth = container.querySelector('div')?.offsetWidth || 0;
        const gap = 24; // 6 * 4px (gap-6)
        container.scrollTo({
            left: (cardWidth + gap) * index,
            behavior: 'smooth'
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-agro-green/5 via-white to-agro-earth/5 p-6">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto"
            >
                {/* Header */}
                <motion.div
                    variants={itemVariants}
                    className="text-center mb-12"
                >
                    <div className="inline-block p-4 bg-gradient-to-r from-agro-green to-agro-earth rounded-2xl mb-4">
                        <Users className="text-white" size={48} />
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-agro-green to-agro-earth bg-clip-text text-transparent mb-4">
                        Meet Our Team
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        The passionate minds behind Agro360 - bringing innovation to agriculture through technology
                    </p>
                </motion.div>

                {/* Project Stats */}
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
                >
                    {Object.entries(projectStats).map(([key, value]) => (
                        <div
                            key={key}
                            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow text-center"
                        >
                            <Sparkles className="text-agro-green mx-auto mb-2" size={24} />
                            <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
                            <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Team Member Scrollable Carousel */}
                <motion.div
                    variants={itemVariants}
                    className="relative mb-8"
                >
                    <p className="text-center text-gray-600 mb-4 text-sm">
                        👈 Scroll horizontally to view all team members 👉
                    </p>
                    
                    {/* Horizontal Scroll Container */}
                    <div
                        ref={scrollContainerRef}
                        className="overflow-x-auto scrollbar-hide flex gap-6 pb-4 px-2"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        {teamMembers.map((member, index) => {
                            const IconComponent = member.icon;
                            return (
                                <div
                                    key={index}
                                    className="min-w-[45vw] md:min-w-[380px] flex-shrink-0"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full"
                                    >
                                        <div className="grid md:grid-cols-3 gap-4">
                                            {/* Left: Profile */}
                                            <div className="md:col-span-1">
                                                <div className="flex flex-col items-center text-center">
                                                    {/* Profile Picture/Avatar */}
                                                    <div className="mb-3 relative group">
                                                        {member.image ? (
                                                            <div className="h-36 w-36 rounded-xl overflow-hidden shadow-xl ring-4 ring-white group-hover:ring-agro-green transition-all duration-300">
                                                                <img
                                                                    src={member.image}
                                                                    alt={member.name}
                                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className={`h-36 w-36 rounded-xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-4xl font-bold shadow-xl group-hover:scale-105 transition-transform duration-300`}>
                                                                {member.avatar}
                                                            </div>
                                                        )}
                                                        {/* Position Badge */}
                                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-white rounded-full shadow-lg border-2 border-agro-green">
                                                            <IconComponent className="text-agro-green" size={14} />
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                                                            {member.name}
                                                        </h3>
                                                        <p className="text-xs font-semibold text-agro-green mb-1">
                                                            {member.position}
                                                        </p>
                                                        <p className="text-xs text-gray-600 mb-3">
                                                            {member.role}
                                                        </p>
                                                    </div>
                                                    
                                                    {/* Social Links */}
                                                    <div className="flex gap-2 mb-3">
                                                        <a
                                                            href={`mailto:${member.email}`}
                                                            className="p-2 bg-agro-green/10 rounded-lg text-agro-green hover:bg-agro-green hover:text-white transition-all duration-300 hover:scale-110"
                                                            title="Email"
                                                        >
                                                            <Mail size={18} />
                                                        </a>
                                                        {member.social.github && (
                                                            <a
                                                                href={member.social.github}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-2 bg-gray-800/10 rounded-lg text-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-300 hover:scale-110"
                                                                title="GitHub"
                                                            >
                                                                <Github size={18} />
                                                            </a>
                                                        )}
                                                        {member.social.linkedin && (
                                                            <a
                                                                href={member.social.linkedin}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-2 bg-blue-600/10 rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-110"
                                                                title="LinkedIn"
                                                            >
                                                                <Linkedin size={18} />
                                                            </a>
                                                        )}
                                                    </div>

                                                    {/* Skills */}
                                                    <div className="w-full">
                                                        <h4 className="text-xs font-semibold text-gray-700 mb-2">Core Skills</h4>
                                                        <div className="flex flex-wrap gap-1 justify-center">
                                                            {member.skills.map((skill, skillIndex) => (
                                                                <span
                                                                    key={skillIndex}
                                                                    className="px-2 py-1 bg-gradient-to-r from-agro-green/10 to-agro-earth/10 text-gray-700 rounded-full text-[10px] font-medium hover:shadow-md transition-shadow"
                                                                >
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: Contributions */}
                                            <div className="md:col-span-2 space-y-4">
                                                {/* Work Areas */}
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Layers className="text-agro-earth" size={16} />
                                                        <h4 className="text-sm font-bold text-gray-800">Work Areas</h4>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {member.workAreas.map((area, areaIndex) => (
                                                            <span
                                                                key={areaIndex}
                                                                className={`px-2 py-1 bg-gradient-to-r ${member.color} text-white rounded-lg text-[10px] font-medium shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300`}
                                                            >
                                                                {area}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Key Contributions */}
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Award className="text-agro-green" size={16} />
                                                        <h4 className="text-sm font-bold text-gray-800">Key Contributions</h4>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        {member.contributions.map((contribution, contIndex) => (
                                                            <div
                                                                key={contIndex}
                                                                className="flex items-start gap-2 p-2 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl hover:shadow-md transition-all duration-300 hover:translate-x-1"
                                                            >
                                                                <div className={`mt-1 h-1.5 w-1.5 rounded-full bg-gradient-to-r ${member.color} flex-shrink-0`}></div>
                                                                <p className="text-xs text-gray-700 leading-relaxed">
                                                                    {contribution}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Dots Navigation */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex justify-center gap-3 mt-8"
                    >
                        {teamMembers.map((member, index) => (
                            <button
                                key={index}
                                onClick={() => goToMember(index)}
                                className="group relative"
                                aria-label={`Go to ${member.name}`}
                            >
                                <div
                                    className={`h-3 w-3 rounded-full transition-all duration-300 ${
                                        index === currentMemberIndex
                                            ? `bg-gradient-to-r ${member.color} scale-125 shadow-lg`
                                            : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
                                    }`}
                                ></div>
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                    {member.name}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                                </div>
                            </button>
                        ))}
                    </motion.div>

                    {/* Counter */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-center mt-4"
                    >
                        <p className="text-sm text-gray-500">
                            Team Member <span className="font-bold text-agro-green">{currentMemberIndex + 1}</span> of {teamMembers.length}
                        </p>
                    </motion.div>
                </motion.div>

                {/* Custom Scrollbar Hide CSS */}
                <style jsx>{`
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>

                {/* Team Members - Removed old section */}
                <div className="space-y-8 hidden">
                    {teamMembers.map((member, index) => {
                        const IconComponent = member.icon;
                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="grid md:grid-cols-3 gap-8">
                                    {/* Left: Profile */}
                                    <div className="md:col-span-1">
                                        <div className="flex flex-col items-center text-center">
                                            <div className={`h-32 w-32 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-4xl font-bold shadow-xl mb-4`}>
                                                {member.avatar}
                                            </div>
                                            <div className="mb-4">
                                                <IconComponent className="text-gray-400 mx-auto mb-2" size={24} />
                                                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                                                    {member.name}
                                                </h3>
                                                <p className="text-sm font-semibold text-agro-green mb-1">
                                                    {member.position}
                                                </p>
                                                <p className="text-sm text-gray-600 mb-4">
                                                    {member.role}
                                                </p>
                                            </div>
                                            
                                            {/* Social Links */}
                                            <div className="flex gap-3 mb-4">
                                                <a
                                                    href={`mailto:${member.email}`}
                                                    className="p-2 bg-agro-green/10 rounded-lg text-agro-green hover:bg-agro-green hover:text-white transition-colors"
                                                    title="Email"
                                                >
                                                    <Mail size={18} />
                                                </a>
                                                {member.social.github && (
                                                    <a
                                                        href={member.social.github}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 bg-gray-800/10 rounded-lg text-gray-800 hover:bg-gray-800 hover:text-white transition-colors"
                                                        title="GitHub"
                                                    >
                                                        <Github size={18} />
                                                    </a>
                                                )}
                                                {member.social.linkedin && (
                                                    <a
                                                        href={member.social.linkedin}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 bg-blue-600/10 rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                                                        title="LinkedIn"
                                                    >
                                                        <Linkedin size={18} />
                                                    </a>
                                                )}
                                            </div>

                                            {/* Skills */}
                                            <div className="w-full">
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Core Skills</h4>
                                                <div className="flex flex-wrap gap-2 justify-center">
                                                    {member.skills.map((skill, skillIndex) => (
                                                        <span
                                                            key={skillIndex}
                                                            className="px-3 py-1 bg-gradient-to-r from-agro-green/10 to-agro-earth/10 text-gray-700 rounded-full text-xs font-medium"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Contributions */}
                                    <div className="md:col-span-2 space-y-6">
                                        {/* Work Areas */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Layers className="text-agro-earth" size={20} />
                                                <h4 className="text-lg font-bold text-gray-800">Work Areas</h4>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {member.workAreas.map((area, areaIndex) => (
                                                    <span
                                                        key={areaIndex}
                                                        className={`px-4 py-2 bg-gradient-to-r ${member.color} text-white rounded-lg text-sm font-medium shadow-md`}
                                                    >
                                                        {area}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Key Contributions */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Award className="text-agro-green" size={20} />
                                                <h4 className="text-lg font-bold text-gray-800">Key Contributions</h4>
                                            </div>
                                            <div className="grid gap-3">
                                                {member.contributions.map((contribution, contIndex) => (
                                                    <div
                                                        key={contIndex}
                                                        className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl hover:shadow-md transition-shadow"
                                                    >
                                                        <div className={`mt-1 h-2 w-2 rounded-full bg-gradient-to-r ${member.color} flex-shrink-0`}></div>
                                                        <p className="text-sm text-gray-700 leading-relaxed">
                                                            {contribution}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* About Project */}
                <motion.div
                    variants={itemVariants}
                    className="mt-12 bg-gradient-to-r from-agro-green/10 via-white to-agro-earth/10 rounded-3xl p-8 shadow-xl border border-gray-100"
                >
                    <div className="text-center max-w-4xl mx-auto">
                        <Terminal className="text-agro-green mx-auto mb-4" size={48} />
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">About Agro360</h2>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            Agro360 is a comprehensive agricultural platform developed by a dedicated team of four passionate developers. 
                            Our platform leverages cutting-edge technologies including Machine Learning, AI, and modern web frameworks to 
                            provide farmers with intelligent crop recommendations, disease detection, yield predictions, and personalized 
                            agricultural advisory services. Together, we're revolutionizing traditional farming practices through innovation 
                            and technology.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <span className="px-4 py-2 bg-white rounded-lg shadow-md text-sm font-medium text-gray-700">
                                🌱 Smart Agriculture
                            </span>
                            <span className="px-4 py-2 bg-white rounded-lg shadow-md text-sm font-medium text-gray-700">
                                🤖 AI-Powered
                            </span>
                            <span className="px-4 py-2 bg-white rounded-lg shadow-md text-sm font-medium text-gray-700">
                                📊 Data-Driven
                            </span>
                            <span className="px-4 py-2 bg-white rounded-lg shadow-md text-sm font-medium text-gray-700">
                                🚀 Innovation First
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.div
                    variants={itemVariants}
                    className="mt-8 text-center"
                >
                    <p className="text-gray-500 text-sm">
                        © 2024 Agro360 Team | Building the future of agriculture
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Developer;
