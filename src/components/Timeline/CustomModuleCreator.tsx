import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, DollarSign, Plus, Minus, Calendar, Clock, Palette } from 'lucide-react';
import { CostFrequency } from '@/stores/timelineStore';
import useTimelineStore from '@/stores/timelineStore';

interface CustomModuleCreatorProps {
  isOpen: boolean;
  onClose: () => void;
}

// Emoji picker (simple version - can be expanded)
const COMMON_EMOJIS = [
  '💰', '🏠', '🚗', '✈️', '🎓', '💼', '🏖️', '🐕', '🐱', '☕',
  '🍕', '📱', '💍', '🎮', '🎨', '🏋️', '📚', '🎭', '🎸', '⛳',
  '🚴', '🏊', '🎿', '🎯', '🎪', '🌴', '🌺', '🌟', '⭐', '🎉',
];

const FREQUENCY_OPTIONS: { value: CostFrequency; label: string; hint: string }[] = [
  { value: 'one-time', label: 'One-Time', hint: 'Happens once' },
  { value: 'daily', label: 'Daily', hint: 'Every day' },
  { value: 'weekly', label: 'Weekly', hint: 'Every week' },
  { value: 'monthly', label: 'Monthly', hint: 'Every month' },
  { value: 'yearly', label: 'Yearly', hint: 'Every year' },
  { value: 'custom', label: 'Custom', hint: 'Custom period' },
];

export default function CustomModuleCreator({ isOpen, onClose }: CustomModuleCreatorProps) {
  const { addCustomModule } = useTimelineStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('💰');
  const [category, setCategory] = useState('Personal');
  const [color, setColor] = useState('#66d9ef');
  const [isExpense, setIsExpense] = useState(true);

  // Cost/Income fields
  const [amount, setAmount] = useState<number>(0);
  const [frequency, setFrequency] = useState<CostFrequency>('one-time');
  const [customPeriodDays, setCustomPeriodDays] = useState<number>(1);
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [startAge, setStartAge] = useState<number | undefined>(undefined);
  const [endAge, setEndAge] = useState<number | undefined>(undefined);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmit = () => {
    if (!name.trim() || amount <= 0) {
      alert('Please enter a module name and valid amount');
      return;
    }

    const costData = {
      amount,
      frequency,
      ...(frequency === 'custom' && { customPeriodDays }),
      ...(duration !== undefined && { duration }),
      ...(startAge !== undefined && { startAge }),
      ...(endAge !== undefined && { endAge }),
    };

    addCustomModule({
      type: 'custom',
      name: name.trim(),
      description: description.trim(),
      icon,
      color,
      category,
      costs: isExpense ? costData : {},
      income: !isExpense ? costData : undefined,
      removable: true,
    });

    handleClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setIcon('💰');
    setCategory('Personal');
    setColor('#66d9ef');
    setIsExpense(true);
    setAmount(0);
    setFrequency('one-time');
    setCustomPeriodDays(1);
    setDuration(undefined);
    setStartAge(undefined);
    setEndAge(undefined);
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="backdrop-blur-xl bg-bg-secondary/95 rounded-lg shadow-2xl border-2 border-accent-primary
                       p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-accent-secondary" />
                  <h2 className="text-2xl font-bold text-text-primary">Create Custom Module</h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-board-light rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-chalk-white" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-chalk text-chalk-white mb-2">
                    Module Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Coffee Addiction, Pet Care, Side Hustle"
                    className="w-full bg-board-light text-chalk-white font-casual text-lg px-4 py-3 rounded
                             border-2 border-chalk-white border-opacity-30 focus:border-chalk-yellow focus:outline-none"
                    autoFocus
                  />
                </div>

                {/* Icon & Color Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Icon Picker */}
                  <div>
                    <label className="block text-sm font-chalk text-chalk-white mb-2">Icon</label>
                    <div className="relative">
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="w-full bg-board-light text-4xl px-4 py-3 rounded
                                 border-2 border-chalk-white border-opacity-30 hover:border-chalk-yellow transition-colors"
                      >
                        {icon}
                      </button>

                      {/* Emoji Picker Dropdown */}
                      {showEmojiPicker && (
                        <div className="absolute top-full left-0 mt-2 bg-board-dark border-2 border-chalk-white rounded-lg p-3 z-10
                                      grid grid-cols-5 gap-2 max-h-60 overflow-y-auto">
                          {COMMON_EMOJIS.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => {
                                setIcon(emoji);
                                setShowEmojiPicker(false);
                              }}
                              className="text-2xl hover:bg-board-light p-2 rounded transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Color Picker */}
                  <div>
                    <label className="block text-sm font-chalk text-chalk-white mb-2 flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Color
                    </label>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full h-14 rounded border-2 border-chalk-white border-opacity-30 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-chalk text-chalk-white mb-2">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Lifestyle, Hobbies, Business"
                    className="w-full bg-board-light text-chalk-white font-casual px-4 py-2 rounded
                             border-2 border-chalk-white border-opacity-30 focus:border-chalk-yellow focus:outline-none"
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
                    placeholder="Add details about this module..."
                    rows={2}
                    className="w-full bg-board-light text-chalk-white font-casual px-4 py-3 rounded
                             border-2 border-chalk-white border-opacity-30 focus:border-chalk-yellow focus:outline-none resize-none"
                  />
                </div>

                {/* Expense/Income Toggle */}
                <div>
                  <label className="block text-sm font-chalk text-chalk-white mb-2">Type</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsExpense(true)}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 font-casual transition-all ${
                        isExpense
                          ? 'border-chalk-red bg-chalk-red bg-opacity-20 text-chalk-red'
                          : 'border-chalk-white border-opacity-30 text-chalk-white'
                      }`}
                    >
                      <Minus className="w-4 h-4 inline mr-2" />
                      Expense
                    </button>
                    <button
                      onClick={() => setIsExpense(false)}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 font-casual transition-all ${
                        !isExpense
                          ? 'border-chalk-green bg-chalk-green bg-opacity-20 text-chalk-green'
                          : 'border-chalk-white border-opacity-30 text-chalk-white'
                      }`}
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      Income
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-chalk text-chalk-white mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Amount (SGD) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-board-light text-chalk-white font-casual text-lg px-4 py-3 rounded
                             border-2 border-chalk-white border-opacity-30 focus:border-chalk-yellow focus:outline-none"
                  />
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-sm font-chalk text-chalk-white mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Frequency
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {FREQUENCY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setFrequency(opt.value)}
                        className={`py-2 px-3 rounded-lg border-2 font-casual text-sm transition-all ${
                          frequency === opt.value
                            ? 'border-chalk-blue bg-chalk-blue bg-opacity-20 text-chalk-blue'
                            : 'border-chalk-white border-opacity-30 text-chalk-white hover:border-chalk-blue'
                        }`}
                      >
                        <div>{opt.label}</div>
                        <div className="text-xs opacity-70">{opt.hint}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Period (if custom selected) */}
                {frequency === 'custom' && (
                  <div>
                    <label className="block text-sm font-chalk text-chalk-white mb-2">
                      Custom Period (days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={customPeriodDays}
                      onChange={(e) => setCustomPeriodDays(parseInt(e.target.value) || 1)}
                      className="w-full bg-board-light text-chalk-white font-casual px-4 py-2 rounded
                               border-2 border-chalk-white border-opacity-30 focus:border-chalk-yellow focus:outline-none"
                    />
                    <p className="text-xs font-casual text-chalk-white opacity-70 mt-1">
                      Repeat every {customPeriodDays} day{customPeriodDays !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}

                {/* Duration (for recurring) */}
                {frequency !== 'one-time' && (
                  <div>
                    <label className="block text-sm font-chalk text-chalk-white mb-2">
                      Duration (optional)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="1"
                        value={duration || ''}
                        onChange={(e) => setDuration(e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder="Forever"
                        className="flex-1 bg-board-light text-chalk-white font-casual px-4 py-2 rounded
                                 border-2 border-chalk-white border-opacity-30 focus:border-chalk-yellow focus:outline-none"
                      />
                      <span className="text-sm font-casual text-chalk-white opacity-70">
                        {frequency === 'daily' && 'days'}
                        {frequency === 'weekly' && 'weeks'}
                        {frequency === 'monthly' && 'months'}
                        {frequency === 'yearly' && 'years'}
                        {frequency === 'custom' && 'periods'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Age Range */}
                <div>
                  <label className="block text-sm font-chalk text-chalk-white mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Age Range (optional)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={startAge || ''}
                        onChange={(e) => setStartAge(e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder="Start age"
                        className="w-full bg-board-light text-chalk-white font-casual px-4 py-2 rounded
                                 border-2 border-chalk-white border-opacity-30 focus:border-chalk-yellow focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={endAge || ''}
                        onChange={(e) => setEndAge(e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder="End age"
                        className="w-full bg-board-light text-chalk-white font-casual px-4 py-2 rounded
                                 border-2 border-chalk-white border-opacity-30 focus:border-chalk-yellow focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-board-light p-4 rounded-lg border-2" style={{ borderColor: color }}>
                  <div className="text-xs font-chalk text-chalk-white mb-2 opacity-70">Preview:</div>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{icon}</span>
                    <div className="flex-1">
                      <div className="font-chalk text-lg text-chalk-yellow">
                        {name || 'Your Module Name'}
                      </div>
                      {description && (
                        <p className="text-xs font-casual text-chalk-white opacity-70 mt-1">
                          {description}
                        </p>
                      )}
                      <div className={`text-sm font-casual mt-1 ${isExpense ? 'text-chalk-red' : 'text-chalk-green'}`}>
                        {isExpense ? '-' : '+'} ${amount.toFixed(2)}/{frequency === 'one-time' ? 'once' : frequency}
                      </div>
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
                  disabled={!name.trim() || amount <= 0}
                  className="flex-1 py-3 px-4 bg-chalk-yellow text-board font-chalk
                           rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Module
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
