import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Settings, Save, RefreshCw, Share2, Upload, Sparkles, FileUp } from 'lucide-react';
import ModuleLibrary from '@/components/Timeline/ModuleLibrary';
import InteractiveTimeline from '@/components/Timeline/InteractiveTimeline';
import IncomeControls from '@/components/Timeline/IncomeControls';
import RetirementGoal from '@/components/Timeline/RetirementGoal';
import FinancialProjectionGraph from '@/components/Timeline/FinancialProjectionGraph';
import ScenarioManager from '@/components/Timeline/ScenarioManager';
import BranchCreationDialog from '@/components/Timeline/BranchCreationDialog';
import ScenarioComparisonView from '@/components/Timeline/ScenarioComparisonView';
import ShareProfileModal from '@/components/ShareProfileModal';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import useTimelineStore from '@/stores/timelineStore';

export default function TimelinePage() {
  const {
    setUserProfile,
    calculateProjections,
    resetTimeline,
    saveScenario,
    timelineModules,
    financial,
    createBranch,
    getNextDefaultColor,
    getActiveScenario,
    importProfile,
  } = useTimelineStore();

  const activeScenario = getActiveScenario();

  const [isBranchDialogOpen, setIsBranchDialogOpen] = useState(false);
  const [isComparisonViewOpen, setIsComparisonViewOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Check if profile exists
  const userProfile = localStorage.getItem('userProfile');
  const hasProfile = userProfile && Object.keys(JSON.parse(userProfile)).length > 0;

  useEffect(() => {
    // Load user profile from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
    }

    // Initial calculation
    calculateProjections();
  }, []);

  const handleSaveScenario = () => {
    const name = prompt('Enter a name for this scenario:');
    if (name) {
      saveScenario(name);
      alert(`Scenario "${name}" saved successfully!`);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset your timeline? This will remove all modules.')) {
      resetTimeline();
    }
  };

  const handleCreateBranch = (name: string, description: string, color: any, branchAge?: number) => {
    createBranch(name, description, color, branchAge);
    calculateProjections();
  };

  // Drag and drop handlers for JSON files ONLY
  const handleDragOver = (e: React.DragEvent) => {
    // Only handle if it's a file drag (not a module drag)
    const items = e.dataTransfer.items;
    if (items && items.length > 0 && items[0].kind === 'file') {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    // Only handle actual file drops
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);

      const file = files[0];
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const json = event.target?.result as string;
            const profile = JSON.parse(json);
            importProfile(profile);
            alert('Profile loaded successfully!');
          } catch (error) {
            alert('Error loading profile. Make sure it\'s a valid JSON file.');
          }
        };
        reader.readAsText(file);
      } else {
        alert('Please drop a JSON file');
      }
    } else {
      // Not a file drop, probably a module drag - don't interfere
      setIsDraggingOver(false);
    }
  };

  // Show "Get Started" screen if no profile
  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full text-center"
        >
          <Sparkles className="w-20 h-20 text-accent-primary mx-auto mb-6" />
          <h1 className="text-5xl font-chalk text-chalk-yellow mb-4">
            Welcome to Life Planner
          </h1>
          <p className="text-xl font-casual text-chalk-white mb-8">
            Your Singapore life planning journey starts here
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Create New Profile */}
            <Link
              to="/profile"
              className="chalk-card hover:bg-board-light transition-all group p-8"
            >
              <Sparkles className="w-12 h-12 text-chalk-green mx-auto mb-4" />
              <h3 className="text-2xl font-chalk text-chalk-yellow mb-2">
                Start Fresh
              </h3>
              <p className="font-casual text-chalk-white mb-4">
                Create your financial profile and plan your future
              </p>
              <span className="font-chalk text-chalk-blue">
                Create Profile →
              </span>
            </Link>

            {/* Import Existing Profile */}
            <div
              className="chalk-card hover:bg-board-light transition-all group p-8 cursor-pointer"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <FileUp className="w-12 h-12 text-chalk-blue mx-auto mb-4" />
              <h3 className="text-2xl font-chalk text-chalk-yellow mb-2">
                Import Profile
              </h3>
              <p className="font-casual text-chalk-white mb-4">
                Drag & drop your saved life plan JSON file here
              </p>
              <span className="font-chalk text-chalk-blue">
                Drop File Here →
              </span>
            </div>
          </div>

          <div className="p-4 bg-board-dark rounded-lg border-2 border-chalk-blue">
            <p className="font-casual text-chalk-white text-sm">
              💡 <strong>New to Singapore?</strong> No worries! Our wizard will guide you through
              setting up your CPF, income, and life goals step by step.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-bg-primary relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Theme Switcher */}
      <ThemeSwitcher />

      {/* Header */}
      <div className="bg-bg-secondary border-b-2 border-accent-primary p-4 shadow-sm">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
            <Calendar className="w-8 h-8 text-accent-primary" />
            Life Timeline Planner
          </h1>
          <p className="text-text-secondary mt-1">
            Drag and drop life events to see your financial future
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        {/* Scenario Manager */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <ScenarioManager
            onCreateBranch={() => setIsBranchDialogOpen(true)}
            onCompareScenarios={() => setIsComparisonViewOpen(true)}
          />
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Sidebar - Module Library */}
          <motion.div
            className="xl:col-span-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="sticky top-20 h-[calc(100vh-6rem)] rounded-lg shadow-xl border-2 border-border-primary flex flex-col bg-bg-secondary overflow-hidden">
              <ModuleLibrary />
            </div>
          </motion.div>

          {/* Center - Timeline */}
          <motion.div
            className="xl:col-span-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div
              className="bg-bg-secondary rounded-lg shadow-xl border-2 h-[800px] overflow-hidden"
              style={{ borderColor: activeScenario?.color.color || 'var(--accent-primary)' }}
            >
              <InteractiveTimeline />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSaveScenario}
                disabled={timelineModules.length === 0}
                className="flex-1 font-bold py-3 px-4 rounded-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                style={{ backgroundColor: '#10b981', color: '#ffffff' }}
              >
                <Save className="w-5 h-5" />
                Save Scenario
              </button>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex-1 font-bold py-3 px-4 rounded-lg hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg"
                style={{ backgroundColor: '#3b82f6', color: '#ffffff' }}
              >
                <Share2 className="w-5 h-5" />
                Share Profile
              </button>
              <button
                onClick={handleReset}
                className="flex-1 font-bold py-3 px-4 rounded-lg hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg"
                style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
              >
                <RefreshCw className="w-5 h-5" />
                Reset Timeline
              </button>
            </div>
          </motion.div>

          {/* Right Sidebar - Controls & Projections */}
          <motion.div
            className="xl:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-6">
              {/* Income Controls */}
              <div className="shadow-xl">
                <IncomeControls />
              </div>

              {/* Retirement Goal */}
              <div className="shadow-xl">
                <RetirementGoal />
              </div>

              {/* Financial Projections */}
              <div className="shadow-xl">
                <FinancialProjectionGraph />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tips Section */}
        <motion.div
          className="mt-8 p-6 bg-bg-secondary rounded-lg border-2 border-accent-primary shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2 text-lg">
            <Settings className="w-5 h-5 text-accent-primary" />
            How to Use
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-text-secondary">
            <div>
              <div className="font-semibold text-accent-info mb-1">1. Drag & Drop</div>
              <p>Drag modules from the library onto your timeline at different ages</p>
            </div>
            <div>
              <div className="font-semibold text-accent-success mb-1">2. Adjust Income</div>
              <p>Use the controls to modify your salary and see instant projections</p>
            </div>
            <div>
              <div className="font-semibold text-accent-warning mb-1">3. Save Scenarios</div>
              <p>Create multiple scenarios to compare different life paths</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Branch Creation Dialog */}
      <BranchCreationDialog
        isOpen={isBranchDialogOpen}
        onClose={() => setIsBranchDialogOpen(false)}
        onConfirm={handleCreateBranch}
        currentAge={financial.currentAge}
        suggestedColor={getNextDefaultColor()}
      />

      {/* Scenario Comparison View */}
      <ScenarioComparisonView
        isOpen={isComparisonViewOpen}
        onClose={() => setIsComparisonViewOpen(false)}
      />

      {/* Share Profile Modal */}
      <ShareProfileModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Drag and Drop Overlay */}
      <AnimatePresence>
        {isDraggingOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-bg-secondary border-4 border-dashed border-accent-primary rounded-lg p-12 text-center shadow-2xl">
              <Upload className="w-16 h-16 text-accent-primary mx-auto mb-4" />
              <p className="font-bold text-3xl text-text-primary mb-2">Drop JSON File Here</p>
              <p className="text-text-secondary">
                Load a saved life plan profile
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}