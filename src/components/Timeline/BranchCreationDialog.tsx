import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GitBranch, Palette, FileText, Calendar } from 'lucide-react';
import { SCENARIO_COLORS, ScenarioColor } from '@/stores/timelineStore';

interface BranchCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, description: string, color: ScenarioColor, branchAge?: number) => void;
  currentAge: number;
  suggestedColor: ScenarioColor;
}

export default function BranchCreationDialog({
  isOpen,
  onClose,
  onConfirm,
  currentAge,
  suggestedColor,
}: BranchCreationDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState<ScenarioColor>(suggestedColor);
  const [branchAge, setBranchAge] = useState<number | undefined>(currentAge);
  const [customColor, setCustomColor] = useState('');
  const [isCustomColorMode, setIsCustomColorMode] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('Please enter a scenario name');
      return;
    }

    let finalColor = selectedColor;

    // If using custom color, create custom color object
    if (isCustomColorMode && customColor) {
      finalColor = {
        id: `custom-${Date.now()}`,
        name: 'Custom Color',
        color: customColor,
        dark: customColor, // Use same for simplicity, could darken it
      };
    }

    onConfirm(name.trim(), description.trim(), finalColor, branchAge);
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setSelectedColor(suggestedColor);
    setBranchAge(currentAge);
    setCustomColor('');
    setIsCustomColorMode(false);
    onClose();
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={handleClose}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="backdrop-blur-xl bg-bg-secondary/95 rounded-lg shadow-2xl border-2 border-accent-primary
                       p-6 w-full max-w-lg pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <GitBranch className="w-6 h-6 text-accent-primary" />
                  <h2 className="text-2xl font-bold text-text-primary">Create Life Branch</h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-bg-hover rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-text-primary" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-5">
                {/* Scenario Name */}
                <div>
                  <label className="block text-sm font-chalk text-chalk-white mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Scenario Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Entrepreneur Path, Single Life, Family First"
                    className="w-full bg-board-light text-chalk-white font-casual text-lg px-4 py-3 rounded
                             border-2 border-chalk-white border-opacity-30 focus:border-chalk-yellow focus:outline-none"
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-chalk text-chalk-white mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what makes this scenario unique..."
                    rows={3}
                    className="w-full bg-board-light text-chalk-white font-casual px-4 py-3 rounded
                             border-2 border-chalk-white border-opacity-30 focus:border-chalk-yellow focus:outline-none resize-none"
                  />
                </div>

                {/* Color Picker */}
                <div>
                  <label className="block text-sm font-chalk text-chalk-white mb-3 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Scenario Color
                  </label>

                  {/* Preset Colors */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {SCENARIO_COLORS.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => {
                          setSelectedColor(color);
                          setIsCustomColorMode(false);
                        }}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedColor.id === color.id && !isCustomColorMode
                            ? 'border-chalk-yellow scale-105'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.color }}
                      >
                        <div className="text-xs font-chalk text-board text-center">
                          {color.name.split(' ')[0]}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Custom Color */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsCustomColorMode(!isCustomColorMode)}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 font-casual text-sm transition-all ${
                        isCustomColorMode
                          ? 'border-chalk-yellow bg-board-light text-chalk-yellow'
                          : 'border-chalk-white border-opacity-30 text-chalk-white hover:bg-board-light'
                      }`}
                    >
                      Use Custom Color
                    </button>
                    {isCustomColorMode && (
                      <input
                        type="color"
                        value={customColor || '#66d9ef'}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="w-16 h-10 rounded border-2 border-chalk-yellow cursor-pointer"
                      />
                    )}
                  </div>
                </div>

                {/* Branch Age */}
                <div>
                  <label className="block text-sm font-chalk text-chalk-white mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Branch from Age (optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={currentAge}
                      max={90}
                      value={branchAge || currentAge}
                      onChange={(e) => setBranchAge(Number(e.target.value))}
                      className="flex-1 bg-board-light text-chalk-white font-casual px-4 py-2 rounded
                               border-2 border-chalk-white border-opacity-30 focus:border-chalk-yellow focus:outline-none"
                    />
                    <button
                      onClick={() => setBranchAge(undefined)}
                      className="px-3 py-2 text-sm font-casual text-chalk-white opacity-70 hover:opacity-100"
                    >
                      Clear
                    </button>
                  </div>
                  <p className="text-xs font-casual text-chalk-white opacity-70 mt-1">
                    {branchAge
                      ? `This scenario will diverge from age ${branchAge}`
                      : 'Copy current timeline as-is'}
                  </p>
                </div>

                {/* Preview */}
                <div className="bg-board-light p-4 rounded-lg border-2"
                     style={{ borderColor: isCustomColorMode && customColor ? customColor : selectedColor.color }}>
                  <div className="text-xs font-chalk text-chalk-white mb-2 opacity-70">Preview:</div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg"
                         style={{
                           backgroundColor: isCustomColorMode && customColor ? customColor : selectedColor.color
                         }}
                    />
                    <div className="flex-1">
                      <div className="font-chalk text-lg"
                           style={{ color: isCustomColorMode && customColor ? customColor : selectedColor.color }}>
                        {name || 'Scenario Name'}
                      </div>
                      {description && (
                        <p className="text-xs font-casual text-chalk-white opacity-70 line-clamp-2">
                          {description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 border-2 border-chalk-white border-opacity-30
                           text-chalk-white font-chalk rounded-lg hover:bg-board-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!name.trim()}
                  className="flex-1 py-3 px-4 bg-chalk-yellow text-board font-chalk
                           rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Branch
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
