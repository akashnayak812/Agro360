import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, User, Send, Heart, Share2, MoreHorizontal, Users } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

const Community = () => {
    const [posts, setPosts] = useState([]);
    const [newContent, setNewContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchPosts = () => {
        fetch('http://localhost:5001/api/community/posts')
            .then(res => res.json())
            .then(data => {
                setPosts(data.posts);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePost = async (e) => {
        e.preventDefault();
        if (!newContent.trim()) return;

        // Optimistic UI update
        const tempPost = {
            id: Date.now(),
            author: "Me (Farmer)",
            content: newContent,
            timestamp: "Just now",
            replies: [],
            likes: 0
        };
        setPosts([tempPost, ...posts]);
        setNewContent('');

        await fetch('http://localhost:5001/api/community/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                author: "Me (Farmer)",
                content: tempPost.content
            })
        });
        fetchPosts();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
        >
            <div className="flex items-center gap-4">
                <div className="p-3 bg-pink-100 rounded-2xl text-pink-600">
                    <Users size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900">Farmer Community</h1>
                    <p className="text-gray-500">Connect, share, and learn from fellow farmers.</p>
                </div>
            </div>

            <Card glass className="p-6">
                <form onSubmit={handlePost} className="flex gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-agro-green to-agro-darkGreen rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-agro-green/20">
                            ME
                        </div>
                    </div>
                    <div className="flex-1 space-y-4">
                        <textarea
                            className="w-full bg-gray-50 rounded-xl border-gray-200 focus:ring-2 focus:ring-agro-green/20 focus:border-agro-green transition-all p-4 resize-none min-h-[100px] text-gray-700 placeholder:text-gray-400"
                            placeholder="Ask a question or share your farming experience..."
                            value={newContent}
                            onChange={e => setNewContent(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" className="gap-2 px-6">
                                <Send size={18} />
                                Post
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>

            <div className="space-y-6">
                {isLoading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agro-green"></div>
                    </div>
                ) : posts.length > 0 ? (
                    <AnimatePresence>
                        {posts.map((post, idx) => (
                            <motion.div
                                key={post.id || idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{post.author}</h4>
                                                <span className="text-xs text-gray-500">{post.timestamp}</span>
                                            </div>
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </div>

                                    <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                                        {post.content}
                                    </p>

                                    <div className="flex items-center gap-6 pt-4 border-t border-gray-100 mb-4">
                                        <button className="flex items-center gap-2 text-gray-500 hover:text-pink-500 transition-colors group">
                                            <Heart size={20} className="group-hover:scale-110 transition-transform" />
                                            <span className="text-sm font-medium">{post.likes || 0} Likes</span>
                                        </button>
                                        <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                                            <MessageSquare size={20} />
                                            <span className="text-sm font-medium">{post.replies?.length || 0} Comments</span>
                                        </button>
                                        <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors ml-auto">
                                            <Share2 size={20} />
                                        </button>
                                    </div>

                                    {post.replies && post.replies.length > 0 && (
                                        <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                                            {post.replies.map((reply, i) => (
                                                <div key={i} className="flex gap-3">
                                                    <div className="mt-1">
                                                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">
                                                            {reply.author[0]}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 bg-white p-3 rounded-r-xl rounded-bl-xl shadow-sm text-sm">
                                                        <span className="font-bold text-gray-900 block mb-1">{reply.author}</span>
                                                        <span className="text-gray-600">{reply.content}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        No community posts yet. Be the first to share!
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Community;
