import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Upload, Copy, Check } from 'lucide-react';
import useTimelineStore from '@/stores/timelineStore';

interface ShareProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareProfileModal({ isOpen, onClose }: ShareProfileModalProps) {
  const { exportProfile, importProfile, downloadProfileJSON, generateShareCode, loadFromShareCode } = useTimelineStore();

  const [profileName, setProfileName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [shareCode, setShareCode] = useState('');
  const [loadCode, setLoadCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Suggested tags
  const suggestedTags = [
    'Conservative', 'FIRE', 'Family', 'Entrepreneur', 'Single', 'Married',
    'High Income', 'Moderate Income', 'Property Investment', 'Early Retirement'
  ];

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleExportJSON = () => {
    if (!profileName.trim()) {
      setError('Please enter a profile name');
      return;
    }

    try {
      const profile = exportProfile(profileName, description, tags);
      downloadProfileJSON(profile);
      setSuccess('Profile downloaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to export profile');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleGenerateShareCode = () => {
    if (!profileName.trim()) {
      setError('Please enter a profile name');
      return;
    }

    try {
      const profile = exportProfile(profileName, description, tags);
      const code = generateShareCode(profile);
      setShareCode(code);
      setSuccess('Share code generated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to generate share code');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleCopyCode = () => {
    if (shareCode) {
      navigator.clipboard.writeText(shareCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLoadFromCode = async () => {
    if (!loadCode.trim()) {
      setError('Please enter a share code');
      return;
    }

    try {
      const profile = await loadFromShareCode(loadCode.toUpperCase());
      if (profile) {
        importProfile(profile);
        setSuccess('Profile loaded successfully!');
        setTimeout(() => {
          setSuccess('');
          onClose();
        }, 2000);
      } else {
        setError('Invalid share code');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      setError('Failed to load profile');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const profile = JSON.parse(json);
        importProfile(profile);
        setSuccess('Profile imported successfully!');
        setTimeout(() => {
          setSuccess('');
          onClose();
        }, 2000);
      } catch (err) {
        setError('Invalid profile file');
        setTimeout(() => setError(''), 3000);
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="backdrop-blur-xl bg-bg-secondary/95 rounded-lg shadow-2xl border-2 border-accent-primary w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="backdrop-blur-md bg-bg-secondary/80 p-6 border-b-2 border-accent-primary flex items-center justify-between sticky top-0 z-10">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">Share Profile</h2>
                  <p className="text-sm text-text-secondary mt-1">
                    Export, share, or import life plans
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-bg-hover rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-text-primary" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Error/Success Messages */}
                {error && (
                  <div className="bg-red-900 bg-opacity-30 border-2 border-red-500 rounded-lg p-3">
                    <p className="font-casual text-red-400 text-sm">{error}</p>
                  </div>
                )}
                {success && (
                  <div className="bg-green-900 bg-opacity-30 border-2 border-chalk-green rounded-lg p-3">
                    <p className="font-casual text-chalk-green text-sm">{success}</p>
                  </div>
                )}

                {/* Export Section */}
                <div className="bg-board-dark p-4 rounded-lg border-2 border-chalk-white">
                  <h3 className="font-chalk text-lg text-chalk-yellow mb-4">Export Profile</h3>

                  {/* Profile Name */}
                  <div className="mb-4">
                    <label className="font-casual text-chalk-white text-sm mb-2 block">
                      Profile Name *
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="e.g., Conservative Family Plan"
                      className="w-full bg-board border-2 border-chalk-white rounded-lg px-4 py-2 font-casual text-chalk-white placeholder-chalk-white placeholder-opacity-50 focus:border-chalk-yellow outline-none"
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label className="font-casual text-chalk-white text-sm mb-2 block">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your life plan strategy..."
                      rows={3}
                      className="w-full bg-board border-2 border-chalk-white rounded-lg px-4 py-2 font-casual text-chalk-white placeholder-chalk-white placeholder-opacity-50 focus:border-chalk-yellow outline-none resize-none"
                    />
                  </div>

                  {/* Tags */}
                  <div className="mb-4">
                    <label className="font-casual text-chalk-white text-sm mb-2 block">
                      Tags (optional)
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-chalk-yellow text-board px-3 py-1 rounded-full font-casual text-sm flex items-center gap-2"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:opacity-70"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag(tagInput)}
                        placeholder="Add custom tag..."
                        className="flex-1 bg-board border-2 border-chalk-white rounded-lg px-4 py-2 font-casual text-chalk-white placeholder-chalk-white placeholder-opacity-50 focus:border-chalk-yellow outline-none"
                      />
                      <button
                        onClick={() => handleAddTag(tagInput)}
                        className="bg-chalk-white text-board px-4 py-2 rounded-lg font-casual hover:bg-opacity-90 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {suggestedTags.filter(t => !tags.includes(t)).slice(0, 5).map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleAddTag(tag)}
                          className="bg-board border border-chalk-white text-chalk-white px-2 py-1 rounded font-casual text-xs hover:bg-board-light transition-colors"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Export Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleExportJSON}
                      className="flex-1 bg-chalk-blue text-board px-4 py-3 rounded-lg font-chalk hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download JSON
                    </button>
                    <button
                      onClick={handleGenerateShareCode}
                      className="flex-1 bg-chalk-green text-board px-4 py-3 rounded-lg font-chalk hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-5 h-5" />
                      Generate Share Code
                    </button>
                  </div>

                  {/* Share Code Display */}
                  {shareCode && (
                    <div className="mt-4 bg-board border-2 border-chalk-green rounded-lg p-4">
                      <p className="font-casual text-chalk-white text-sm mb-2">
                        Share this code with others:
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-board-dark border-2 border-chalk-white rounded-lg px-4 py-3 font-chalk text-2xl text-chalk-green text-center">
                          {shareCode}
                        </div>
                        <button
                          onClick={handleCopyCode}
                          className="bg-chalk-white text-board p-3 rounded-lg hover:bg-opacity-90 transition-colors"
                        >
                          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Import Section */}
                <div className="bg-board-dark p-4 rounded-lg border-2 border-chalk-white">
                  <h3 className="font-chalk text-lg text-chalk-yellow mb-4">Import Profile</h3>

                  {/* Load from Code */}
                  <div className="mb-4">
                    <label className="font-casual text-chalk-white text-sm mb-2 block">
                      Enter Share Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={loadCode}
                        onChange={(e) => setLoadCode(e.target.value.toUpperCase())}
                        placeholder="Enter 6-character code..."
                        maxLength={6}
                        className="flex-1 bg-board border-2 border-chalk-white rounded-lg px-4 py-2 font-casual text-chalk-white placeholder-chalk-white placeholder-opacity-50 focus:border-chalk-yellow outline-none uppercase"
                      />
                      <button
                        onClick={handleLoadFromCode}
                        className="bg-chalk-yellow text-board px-4 py-2 rounded-lg font-casual hover:bg-opacity-90 transition-colors"
                      >
                        Load
                      </button>
                    </div>
                  </div>

                  {/* Upload JSON */}
                  <div>
                    <label className="font-casual text-chalk-white text-sm mb-2 block">
                      Or Upload JSON File
                    </label>
                    <label className="block bg-chalk-white text-board px-4 py-3 rounded-lg font-chalk hover:bg-opacity-90 transition-colors cursor-pointer text-center">
                      <Upload className="w-5 h-5 inline-block mr-2" />
                      Choose File
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportJSON}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
