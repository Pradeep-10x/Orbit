import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Globe, Lock, Loader2 } from 'lucide-react';
import { communityAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface CreateCommunityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateCommunityModal({ isOpen, onClose, onSuccess }: CreateCommunityModalProps) {
    const [creating, setCreating] = useState(false);
    const [newCommunity, setNewCommunity] = useState({
        name: '',
        description: '',
        isPublic: true,
    });
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImage(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCommunity.name.trim()) {
            toast.error('Community name is required');
            return;
        }

        try {
            setCreating(true);
            const formData = new FormData();
            formData.append('name', newCommunity.name);
            formData.append('description', newCommunity.description);
            formData.append('isPublic', String(newCommunity.isPublic));
            if (coverImage) {
                formData.append('coverImage', coverImage);
            }

            await communityAPI.create(formData);
            toast.success('Community created successfully!');
            onSuccess();
            onClose();
            // Reset form
            setNewCommunity({ name: '', description: '', isPublic: true });
            setCoverImage(null);
            setCoverPreview(null);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create community');
        } finally {
            setCreating(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#0a0a12] border border-[rgba(168,85,247,0.3)] rounded-2xl p-6 w-full max-w-md shadow-xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-[#e5e7eb]">Create Community</h2>
                            <button
                                onClick={onClose}
                                className="text-[#9ca3af] hover:text-[#e5e7eb]"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Cover Image */}
                            <div>
                                <label className="block text-sm text-[#9ca3af] mb-2">Cover Image</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-video rounded-xl border-2 border-dashed border-[rgba(168,85,247,0.3)] flex items-center justify-center cursor-pointer hover:border-[rgba(168,85,247,0.5)] transition-colors overflow-hidden"
                                >
                                    {coverPreview ? (
                                        <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center">
                                            <Upload className="w-8 h-8 text-[#9ca3af] mx-auto mb-2" />
                                            <p className="text-sm text-[#9ca3af]">Click to upload</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverImageChange}
                                    className="hidden"
                                />
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm text-[#9ca3af] mb-2">Community Name</label>
                                <input
                                    type="text"
                                    value={newCommunity.name}
                                    onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                                    placeholder="Enter community name"
                                    className="w-full glass-card rounded-lg px-4 py-3 text-[#e5e7eb] placeholder-[#9ca3af] focus:outline-none focus:border-[rgba(168,85,247,0.4)]"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm text-[#9ca3af] mb-2">Description</label>
                                <textarea
                                    value={newCommunity.description}
                                    onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                                    placeholder="What's your community about?"
                                    rows={3}
                                    className="w-full glass-card rounded-lg px-4 py-3 text-[#e5e7eb] placeholder-[#9ca3af] focus:outline-none focus:border-[rgba(168,85,247,0.4)] resize-none"
                                />
                            </div>

                            {/* Privacy */}
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => setNewCommunity({ ...newCommunity, isPublic: true })}
                                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${newCommunity.isPublic
                                        ? 'bg-[#7c3aed] text-white'
                                        : 'glass-card text-[#9ca3af]'
                                        }`}
                                >
                                    <Globe className="w-4 h-4" />
                                    Public
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setNewCommunity({ ...newCommunity, isPublic: false })}
                                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${!newCommunity.isPublic
                                        ? 'bg-[#7c3aed] text-white'
                                        : 'glass-card text-[#9ca3af]'
                                        }`}
                                >
                                    <Lock className="w-4 h-4" />
                                    Private
                                </button>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={creating || !newCommunity.name.trim()}
                                className="w-full py-3 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-lg text-white font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {creating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Community'
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
