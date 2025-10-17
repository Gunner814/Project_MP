import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Info, Plus, Sparkles } from 'lucide-react';
import useTimelineStore from '@/stores/timelineStore';
import DraggableModule from './DraggableModule';
import CustomModuleCreator from './CustomModuleCreator';

export default function ModuleLibrary() {
  const { availableModules, customModules } = useTimelineStore();
  const [activeTab, setActiveTab] = useState<string>('housing');
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  const handleDragStart = (e: React.DragEvent, module: any) => {
    e.dataTransfer.setData('module', JSON.stringify(module));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const categories = {
    housing: {
      name: 'Housing',
      icon: '🏠',
      color: '#ff6b9d',
      modules: availableModules.filter(m => m.type === 'house')
    },
    transport: {
      name: 'Transport',
      icon: '🚗',
      color: '#66d9ef',
      modules: availableModules.filter(m => m.type === 'car')
    },
    family: {
      name: 'Family',
      icon: '👨‍👩‍👦',
      color: '#a6e22e',
      modules: availableModules.filter(m => m.type === 'marriage' || m.type === 'child')
    },
    career: {
      name: 'Career',
      icon: '💼',
      color: '#66d9ef',
      modules: availableModules.filter(m => m.type === 'career' || m.type === 'retirement' || m.type === 'education')
    },
    health: {
      name: 'Health',
      icon: '🏥',
      color: '#f92672',
      modules: availableModules.filter(m =>
        m.id.includes('illness') ||
        m.id.includes('surgery') ||
        m.id.includes('hospitalization') ||
        m.id.includes('disability') ||
        m.id.includes('chronic')
      )
    },
    insurance: {
      name: 'Insurance',
      icon: '🛡️',
      color: '#66d9ef',
      modules: availableModules.filter(m =>
        m.id.includes('insurance') ||
        m.id.includes('shield') ||
        m.id.includes('protection') ||
        m.id.includes('eci')
      )
    },
    savings: {
      name: 'Savings',
      icon: '💰',
      color: '#ffeb3b',
      modules: availableModules.filter(m =>
        m.id.includes('endowment') ||
        m.id.includes('ilp') ||
        m.id.includes('retirement-income') ||
        m.id.includes('education-plan') ||
        m.id.includes('srs')
      )
    },
    investment: {
      name: 'Investments',
      icon: '📈',
      color: '#ae81ff',
      modules: availableModules.filter(m =>
        m.type === 'investment' &&
        !m.id.includes('insurance') &&
        !m.id.includes('shield') &&
        !m.id.includes('protection') &&
        !m.id.includes('eci') &&
        !m.id.includes('endowment') &&
        !m.id.includes('ilp') &&
        !m.id.includes('retirement-income') &&
        !m.id.includes('education-plan') &&
        !m.id.includes('srs')
      )
    },
    custom: {
      name: 'Custom',
      icon: '✨',
      color: '#ffeb3b',
      modules: customModules
    }
  };

  const activeCategory = categories[activeTab as keyof typeof categories];

  return (
    <div className="h-full bg-bg-secondary flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 p-4 border-b border-border-primary flex-shrink-0 backdrop-blur-md bg-bg-secondary/90">
        <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <Package className="w-5 h-5 text-accent-primary" />
          Life Modules
        </h3>
        <p className="text-sm text-text-secondary mt-1">
          Drag modules onto your timeline
        </p>
      </div>

      {/* Tabs */}
      <div className="sticky top-[76px] z-10 border-b border-border-primary flex-shrink-0 backdrop-blur-md bg-bg-secondary/90">
        <div className="flex overflow-x-auto">
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap transition-colors border-b-2 ${
                activeTab === key
                  ? 'text-accent-primary border-accent-primary bg-bg-hover font-semibold'
                  : 'text-text-secondary border-transparent hover:bg-bg-hover hover:text-text-primary'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
              <span className="text-xs opacity-70">({category.modules.length})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Instructions */}
        <div className="mb-4 p-3 bg-bg-tertiary rounded-lg border border-accent-info">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-accent-info mt-0.5 flex-shrink-0" />
            <div className="text-xs text-text-secondary">
              <p>Drag and drop modules onto your timeline to see how they impact your financial future.</p>
              <p className="mt-1">You can add the same module multiple times at different ages.</p>
            </div>
          </div>
        </div>

        {/* Active Category Modules */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-2"
        >
          {/* Custom Tab - Show Create Button */}
          {activeTab === 'custom' && (
            <button
              onClick={() => setIsCreatorOpen(true)}
              className="w-full font-bold py-3 px-4 rounded-lg hover:scale-105 transition-all flex items-center justify-center gap-2 mb-4 shadow-lg"
              style={{ backgroundColor: '#7c3aed', color: '#ffffff' }}
            >
              <Plus className="w-5 h-5" />
              Create Custom Module
            </button>
          )}

          {activeCategory.modules.length === 0 && activeTab !== 'custom' ? (
            <div className="text-center py-8 text-text-muted text-sm">
              No modules in this category yet
            </div>
          ) : activeTab === 'custom' && customModules.length === 0 ? (
            <div className="text-center py-8 text-text-secondary text-sm">
              <Sparkles className="w-12 h-12 text-accent-warning mx-auto mb-3 opacity-50" />
              <p className="mb-2 font-semibold">No custom modules yet</p>
              <p className="text-xs text-text-muted">Create your own life events with custom costs and frequencies</p>
            </div>
          ) : (
            activeCategory.modules.map((module) => (
              <div
                key={module.id}
                draggable
                onDragStart={(e) => handleDragStart(e, module)}
                className="cursor-move"
              >
                <DraggableModule
                  module={module}
                  isInLibrary={true}
                />
              </div>
            ))
          )}
        </motion.div>

        {/* Category-specific Tips */}
        {activeTab === 'housing' && (
          <div className="mt-6 p-3 border-2 border-accent-info border-dashed rounded-lg bg-bg-tertiary">
            <h4 className="font-semibold text-text-primary text-sm mb-2">
              🏠 Housing Tips
            </h4>
            <ul className="space-y-1 text-xs text-text-secondary">
              <li>• 1-2 room flats are for singles or elderly</li>
              <li>• 3-room is good for couples/small families</li>
              <li>• 4-room is most popular family size</li>
              <li>• 5-room for larger families</li>
              <li>• BTO is cheaper but 4-year wait</li>
              <li>• Resale is immediate but more expensive</li>
            </ul>
          </div>
        )}

        {activeTab === 'family' && (
          <div className="mt-6 p-3 border-2 border-accent-success border-dashed rounded-lg bg-bg-tertiary">
            <h4 className="font-semibold text-text-primary text-sm mb-2">
              👨‍👩‍👦 Family Tips
            </h4>
            <ul className="space-y-1 text-xs text-text-secondary">
              <li>• Each child costs ~$200k-300k to raise</li>
              <li>• Baby Bonus: $10k cash (1st/2nd)</li>
              <li>• Childcare subsidies available</li>
              <li>• Consider spacing between children</li>
              <li>• 2 kids is Singapore average</li>
            </ul>
          </div>
        )}

        {activeTab === 'career' && (
          <div className="mt-6 p-3 border-2 border-accent-primary border-dashed rounded-lg bg-bg-tertiary">
            <h4 className="font-semibold text-text-primary text-sm mb-2">
              💼 Career Tips
            </h4>
            <ul className="space-y-1 text-xs text-text-secondary">
              <li>• Add "Starting Job" at current age first</li>
              <li>• Job changes replace base salary</li>
              <li>• Side hustles add to income</li>
              <li>• Promotions multiply current salary</li>
              <li>• Career breaks pause income</li>
            </ul>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="mt-6 p-3 border-2 border-accent-error border-dashed rounded-lg bg-bg-tertiary">
            <h4 className="font-semibold text-text-primary text-sm mb-2">
              🏥 Health Tips
            </h4>
            <ul className="space-y-1 text-xs text-text-secondary">
              <li>• Critical Illness insurance covers cancer</li>
              <li>• Hospitalization covered by Medishield/Shield</li>
              <li>• Income protection covers disability</li>
              <li>• Add insurance modules to offset costs</li>
            </ul>
          </div>
        )}

        {activeTab === 'transport' && (
          <div className="mt-6 p-3 border-2 border-accent-info border-dashed rounded-lg bg-bg-tertiary">
            <h4 className="font-semibold text-text-primary text-sm mb-2">
              🚗 Transport Tips
            </h4>
            <ul className="space-y-1 text-xs text-text-secondary">
              <li>• COE renews every 10 years</li>
              <li>• Monthly includes fuel, parking, insurance</li>
              <li>• Consider public transport cost vs car</li>
            </ul>
          </div>
        )}

        {activeTab === 'insurance' && (
          <div className="mt-6 p-3 border-2 border-accent-secondary border-dashed rounded-lg bg-bg-tertiary">
            <h4 className="font-semibold text-text-primary text-sm mb-2">
              🛡️ Insurance Tips
            </h4>
            <ul className="space-y-1 text-xs text-text-secondary">
              <li>• Term life is cheaper than whole life</li>
              <li>• Get life insurance early (lower premiums)</li>
              <li>• Critical Illness covers cancer, heart attack, stroke</li>
              <li>• Integrated Shield for private hospital coverage</li>
              <li>• Income protection replaces lost wages</li>
            </ul>
          </div>
        )}

        {activeTab === 'savings' && (
          <div className="mt-6 p-3 border-2 border-accent-warning border-dashed rounded-lg bg-bg-tertiary">
            <h4 className="font-semibold text-text-primary text-sm mb-2">
              💰 Savings Tips
            </h4>
            <ul className="space-y-1 text-xs text-text-secondary">
              <li>• Endowment plans have guaranteed returns</li>
              <li>• ILPs have higher potential but no guarantees</li>
              <li>• SRS contributions are tax deductible</li>
              <li>• Retirement income plans provide monthly payouts</li>
              <li>• Children's education plans mature at age 18</li>
            </ul>
          </div>
        )}

        {activeTab === 'investment' && (
          <div className="mt-6 p-3 border-2 border-accent-secondary border-dashed rounded-lg bg-bg-tertiary">
            <h4 className="font-semibold text-text-primary text-sm mb-2">
              📈 Investment Tips
            </h4>
            <ul className="space-y-1 text-xs text-text-secondary">
              <li>• Investment property has ABSD tax</li>
              <li>• Rental income can offset mortgage</li>
              <li>• Consider capital appreciation</li>
            </ul>
          </div>
        )}
      </div>

      {/* Custom Module Creator Modal */}
      <CustomModuleCreator
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
      />
    </div>
  );
}
