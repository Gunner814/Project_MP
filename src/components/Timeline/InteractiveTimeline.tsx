import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, PiggyBank } from 'lucide-react';
import useTimelineStore from '@/stores/timelineStore';
import DraggableModule from './DraggableModule';
import ModuleCustomizationDialog from './ModuleCustomizationDialog';
import { TimelineModule } from '@/stores/timelineStore';

export default function InteractiveTimeline() {
  const {
    financial,
    timelineModules,
    projections,
    addModule,
    removeModule,
    moveModule,
    calculateProjections,
    getActiveScenario,
  } = useTimelineStore();

  const activeScenario = getActiveScenario();

  const [dragOverAge, setDragOverAge] = useState<number | null>(null);
  const [customizationDialog, setCustomizationDialog] = useState<{
    isOpen: boolean;
    module: TimelineModule | null;
    age: number;
  }>({ isOpen: false, module: null, age: 0 });

  const currentYear = new Date().getFullYear();
  const startAge = financial.currentAge;
  const endAge = 123;

  // Create age slots
  const ageSlots = Array.from({ length: endAge - startAge + 1 }, (_, i) => startAge + i);

  const handleDragOver = (e: React.DragEvent, age: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOverAge(age);
  };

  const handleDragLeave = () => {
    setDragOverAge(null);
  };

  const handleDrop = (e: React.DragEvent, age: number) => {
    e.preventDefault();
    setDragOverAge(null);

    const moduleData = e.dataTransfer.getData('module');
    if (moduleData) {
      const module = JSON.parse(moduleData);
      // Open customization dialog instead of adding directly
      setCustomizationDialog({
        isOpen: true,
        module: {
          ...module,
          age,
          year: currentYear + (age - financial.currentAge)
        },
        age
      });
    }
  };

  const handleAddCustomizedModule = (customizedModule: TimelineModule) => {
    addModule(customizedModule);
    calculateProjections();
    setCustomizationDialog({ isOpen: false, module: null, age: 0 });
  };

  const handleRemoveModule = (moduleId: string) => {
    removeModule(moduleId);
    calculateProjections();
  };

  // Group modules by age
  const modulesByAge = timelineModules.reduce((acc, module) => {
    if (!acc[module.age]) acc[module.age] = [];
    acc[module.age].push(module);
    return acc;
  }, {} as Record<number, typeof timelineModules>);

  // Get projection for specific age
  const getProjectionForAge = (age: number) => {
    return projections.find(p => p.age === age);
  };

  const scenarioColor = activeScenario?.color.color || '#fff';

  return (
    <div className="h-full bg-bg-secondary overflow-auto">
      {/* Timeline Header with Scenario Indicator */}
      <div
        className="sticky top-0 z-10 p-4 border-b-2 backdrop-blur-md bg-bg-secondary/80"
        style={{ borderColor: scenarioColor }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-xl text-text-primary flex items-center">
              Your Life Timeline
              {activeScenario && (
                <span className="ml-3 text-sm px-3 py-1 rounded-full border-2 font-semibold" style={{
                  borderColor: scenarioColor,
                  color: scenarioColor,
                }}>
                  {activeScenario.name}
                </span>
              )}
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Drop modules at different ages to see your financial journey
            </p>
          </div>
          {activeScenario && (
            <div
              className="w-12 h-12 rounded-lg"
              style={{ backgroundColor: scenarioColor }}
            />
          )}
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="p-4">
        {/* Decade Markers */}
        <div className="grid grid-cols-11 gap-2 mb-6">
          {['20s', '30s', '40s', '50s', '60s', '70s', '80s', '90s', '100s', '110s', '120s'].map((decade, i) => (
            <div
              key={decade}
              className="text-center font-semibold text-accent-primary border-b-2 border-accent-primary pb-1 text-sm"
            >
              {decade}
            </div>
          ))}
        </div>

        {/* Age Slots */}
        <div className="space-y-3">
          {ageSlots.map(age => {
            const modules = modulesByAge[age] || [];
            const projection = getProjectionForAge(age);
            const year = currentYear + (age - financial.currentAge);
            const isCurrentAge = age === financial.currentAge;
            const isFutureAge = age > financial.currentAge;
            // Brighter colors that work in both light and dark modes
            const decadeColor = age < 30 ? '#0891b2' :  // Cyan
                               age < 40 ? '#16a34a' :   // Green
                               age < 50 ? '#dc2626' :   // Red
                               age < 60 ? '#ea580c' :   // Orange
                               age < 70 ? '#7c3aed' :   // Purple
                               age < 80 ? '#db2777' :   // Pink
                               age < 90 ? '#2563eb' :   // Blue
                               age < 100 ? '#059669' :  // Emerald
                               age < 110 ? '#c026d3' :  // Fuchsia
                               '#6366f1';               // Indigo

            return (
              <motion.div
                key={age}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (age - startAge) * 0.01 }}
                className={`relative ${isCurrentAge ? 'ring-2 ring-chalk-yellow' : ''}`}
              >
                {/* Age Row */}
                <div className="flex items-start gap-4">
                  {/* Age & Year Label */}
                  <div
                    className="w-24 text-right"
                    style={{ color: decadeColor }}
                  >
                    <div className="font-semibold text-lg">Age {age}</div>
                    <div className="text-xs text-text-muted">{year}</div>
                    {isCurrentAge && (
                      <div className="text-xs font-semibold text-accent-warning mt-1">← NOW</div>
                    )}
                  </div>

                  {/* Drop Zone */}
                  <div
                    className={`flex-1 min-h-[80px] p-3 border-2 border-dashed rounded-lg transition-all ${
                      dragOverAge === age
                        ? 'border-accent-primary bg-bg-hover scale-105'
                        : 'border-border-primary hover:border-border-secondary'
                    } ${!isFutureAge ? 'opacity-50 pointer-events-none' : ''}`}
                    onDragOver={(e) => isFutureAge && handleDragOver(e, age)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => isFutureAge && handleDrop(e, age)}
                  >
                    {/* Modules at this age */}
                    <div className="flex flex-wrap gap-2">
                      {modules.length === 0 && isFutureAge && (
                        <div className="text-text-muted text-sm">
                          {dragOverAge === age ? '📦 Drop module here' : '+ Drop modules here'}
                        </div>
                      )}

                      <AnimatePresence>
                        {modules.map(module => (
                          <motion.div
                            key={module.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="inline-block"
                          >
                            <DraggableModule
                              module={module}
                              onRemove={() => handleRemoveModule(module.id)}
                              isDragging={false}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Financial Projection for this age */}
                  {projection && (
                    <div className="w-40 text-right text-sm space-y-1">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-text-muted">Net Worth:</span>
                        <span
                          className={projection.netWorth >= 0 ? 'text-money-positive font-semibold' : 'text-money-negative font-semibold'}
                        >
                          ${(projection.netWorth / 1000).toFixed(0)}k
                        </span>
                      </div>

                      {projection.cashFlow !== undefined && (
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-text-muted">Cash Flow:</span>
                          <span
                            className={projection.cashFlow >= 0 ? 'text-money-positive font-semibold' : 'text-money-negative font-semibold'}
                          >
                            {projection.cashFlow >= 0 ? '+' : ''}{(projection.cashFlow / 1000).toFixed(1)}k/mo
                          </span>
                        </div>
                      )}

                      {projection.cpfTotal > 0 && (
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-text-muted">CPF:</span>
                          <span className="text-accent-info font-semibold">
                            ${(projection.cpfTotal / 1000).toFixed(0)}k
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Milestone Markers */}
                {age === 55 && (
                  <div className="absolute left-0 -bottom-6 px-3 py-1 rounded text-xs font-bold shadow-lg z-10"
                       style={{ backgroundColor: '#fbbf24', color: '#000' }}>
                    💰 CPF Withdrawal Age
                  </div>
                )}
                {age === 62 && (
                  <div className="absolute left-0 -bottom-6 px-3 py-1 rounded text-xs font-bold shadow-lg z-10"
                       style={{ backgroundColor: '#10b981', color: '#000' }}>
                    🎉 Retirement Age
                  </div>
                )}
                {age === 65 && (
                  <div className="absolute left-0 -bottom-6 px-3 py-1 rounded text-xs font-bold shadow-lg z-10"
                       style={{ backgroundColor: '#3b82f6', color: '#fff' }}>
                    🏦 CPF Life Starts
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Module Customization Dialog */}
      {customizationDialog.module && (
        <ModuleCustomizationDialog
          module={customizationDialog.module}
          age={customizationDialog.age}
          isOpen={customizationDialog.isOpen}
          onClose={() => setCustomizationDialog({ isOpen: false, module: null, age: 0 })}
          onConfirm={handleAddCustomizedModule}
        />
      )}
    </div>
  );
}