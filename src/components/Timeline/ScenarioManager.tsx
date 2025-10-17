import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Plus, Trash2, Edit3, Copy, BarChart3, ChevronDown } from 'lucide-react';
import useTimelineStore from '@/stores/timelineStore';

interface ScenarioManagerProps {
  onCreateBranch: () => void;
  onCompareScenarios: () => void;
}

export default function ScenarioManager({ onCreateBranch, onCompareScenarios }: ScenarioManagerProps) {
  const {
    scenarios,
    activeScenarioId,
    switchScenario,
    deleteScenario,
    updateScenarioName,
    duplicateScenario,
    getActiveScenario,
  } = useTimelineStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editingScenarioId, setEditingScenarioId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const activeScenario = getActiveScenario();
  const hasMultipleScenarios = scenarios.length > 1;

  const handleStartEdit = (scenarioId: string, currentName: string) => {
    setEditingScenarioId(scenarioId);
    setEditName(currentName);
  };

  const handleSaveEdit = () => {
    if (editingScenarioId && editName.trim()) {
      updateScenarioName(editingScenarioId, editName.trim());
    }
    setEditingScenarioId(null);
  };

  const handleDelete = (scenarioId: string) => {
    if (scenarios.length <= 1) {
      alert('Cannot delete the last scenario!');
      return;
    }
    if (confirm('Are you sure you want to delete this scenario?')) {
      deleteScenario(scenarioId);
      setIsDropdownOpen(false);
    }
  };

  const handleDuplicate = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      const newName = prompt(`Duplicate "${scenario.name}" as:`, `${scenario.name} (Copy)`);
      if (newName) {
        duplicateScenario(scenarioId, newName);
      }
    }
  };

  // If no scenarios exist, show create first scenario button
  if (scenarios.length === 0) {
    return (
      <div className="bg-board-dark p-4 rounded-lg border-2 border-chalk-yellow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GitBranch className="w-6 h-6 text-chalk-yellow" />
            <div>
              <h3 className="font-chalk text-chalk-yellow">Life Scenarios</h3>
              <p className="text-xs font-casual text-chalk-white opacity-70">
                Create your first scenario to start planning
              </p>
            </div>
          </div>
          <button
            onClick={onCreateBranch}
            className="bg-chalk-yellow text-board font-chalk px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create First Scenario
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-board-dark p-4 rounded-lg border-2 border-chalk-white relative">
      <div className="flex items-center justify-between">
        {/* Active Scenario Display */}
        <div className="flex items-center gap-3">
          <GitBranch className="w-6 h-6" style={{ color: activeScenario?.color.color || '#fff' }} />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-chalk text-lg" style={{ color: activeScenario?.color.color || '#fff' }}>
                {activeScenario?.name || 'Main Timeline'}
              </h3>
              {hasMultipleScenarios && (
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="p-1 hover:bg-board-light rounded transition-colors"
                >
                  <ChevronDown className={`w-4 h-4 text-chalk-white transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>
            {activeScenario?.description && (
              <p className="text-xs font-casual text-chalk-white opacity-70">
                {activeScenario.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-casual text-chalk-white opacity-50">
                {scenarios.length} scenario{scenarios.length !== 1 ? 's' : ''}
              </span>
              {activeScenario?.branchedFrom && (
                <span className="text-xs font-casual px-2 py-0.5 rounded" style={{
                  backgroundColor: activeScenario.color.color + '20',
                  color: activeScenario.color.color
                }}>
                  Branched at age {activeScenario.branchAge}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {hasMultipleScenarios && (
            <button
              onClick={onCompareScenarios}
              className="bg-chalk-blue text-board font-chalk px-3 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Compare
            </button>
          )}
          <button
            onClick={onCreateBranch}
            className="bg-chalk-green text-board font-chalk px-3 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Branch
          </button>
        </div>
      </div>

      {/* Scenario Dropdown */}
      <AnimatePresence>
        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
            />

            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-board-dark border-2 border-chalk-white rounded-lg shadow-xl z-20 max-h-[400px] overflow-y-auto"
            >
              <div className="p-2">
                <div className="text-xs font-chalk text-chalk-yellow px-3 py-2 border-b border-chalk-white border-opacity-30">
                  Switch Scenario
                </div>

                {scenarios.map((scenario) => {
                  const isActive = scenario.id === activeScenarioId;
                  const isEditing = editingScenarioId === scenario.id;

                  return (
                    <div
                      key={scenario.id}
                      className={`p-3 rounded-lg transition-colors ${
                        isActive ? 'bg-board-light' : 'hover:bg-board-light'
                      }`}
                      style={{ borderLeft: `4px solid ${scenario.color.color}` }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        {/* Scenario Name */}
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onBlur={handleSaveEdit}
                              onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                              className="w-full bg-board text-chalk-white font-chalk px-2 py-1 rounded border border-chalk-yellow focus:outline-none"
                              autoFocus
                            />
                          ) : (
                            <button
                              onClick={() => !isActive && switchScenario(scenario.id)}
                              className="text-left w-full"
                            >
                              <div className="font-chalk text-chalk-white flex items-center gap-2">
                                {scenario.name}
                                {isActive && (
                                  <span className="text-xs px-2 py-0.5 bg-chalk-yellow text-board rounded">
                                    Active
                                  </span>
                                )}
                              </div>
                              {scenario.description && (
                                <p className="text-xs font-casual text-chalk-white opacity-70 truncate">
                                  {scenario.description}
                                </p>
                              )}
                            </button>
                          )}
                        </div>

                        {/* Action Buttons */}
                        {!isEditing && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartEdit(scenario.id, scenario.name);
                              }}
                              className="p-1.5 hover:bg-board rounded transition-colors"
                              title="Rename"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-chalk-white opacity-70 hover:opacity-100" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicate(scenario.id);
                              }}
                              className="p-1.5 hover:bg-board rounded transition-colors"
                              title="Duplicate"
                            >
                              <Copy className="w-3.5 h-3.5 text-chalk-white opacity-70 hover:opacity-100" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(scenario.id);
                              }}
                              className="p-1.5 hover:bg-board rounded transition-colors"
                              title="Delete"
                              disabled={scenarios.length <= 1}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-chalk-red opacity-70 hover:opacity-100" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
