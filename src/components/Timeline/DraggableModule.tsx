import { motion } from 'framer-motion';
import { X, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { TimelineModule } from '@/stores/timelineStore';

interface DraggableModuleProps {
  module: TimelineModule;
  isInLibrary?: boolean;
  onRemove?: () => void;
  isDragging?: boolean;
}

export default function DraggableModule({
  module,
  isInLibrary = false,
  onRemove,
  isDragging = false
}: DraggableModuleProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getModuleStyle = () => {
    const baseStyle = 'relative p-3 rounded-lg cursor-move transition-all bg-bg-tertiary';
    const colorStyle = module.color ? `border-2` : 'border-2 border-border-primary';

    if (isDragging) {
      return `${baseStyle} ${colorStyle} opacity-80 scale-105 shadow-xl`;
    }

    if (isInLibrary) {
      return `${baseStyle} ${colorStyle} hover:scale-105 hover:bg-bg-hover`;
    }

    return `${baseStyle} ${colorStyle} hover:bg-bg-hover`;
  };

  return (
    <motion.div
      className={getModuleStyle()}
      style={{ borderColor: module.color }}
      whileHover={{ scale: isInLibrary ? 1.05 : 1 }}
      whileTap={{ scale: 0.95 }}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      {/* Remove button for timeline modules */}
      {!isInLibrary && module.removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-accent-error rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      )}

      {/* Module Icon and Name */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{module.icon}</span>
        <span className="font-semibold text-text-primary">{module.name}</span>
      </div>

      {/* Cost Information - Only show for placed modules, not library */}
      {!isInLibrary && (
        <div className="space-y-1 text-sm font-casual">
          {module.costs.oneTime && module.costs.oneTime > 0 && (
            <div className="flex items-center gap-1 text-chalk-red">
              <TrendingDown className="w-3 h-3" />
              <span>Initial: {formatCurrency(module.costs.oneTime)}</span>
            </div>
          )}

          {/* Show CPF usage if applicable */}
          {module.costs.cpfDeduction && module.costs.cpfDeduction > 0 && (
            <div className="flex items-center gap-1 text-chalk-blue text-xs">
              <span>CPF Used: {formatCurrency(module.costs.cpfDeduction)}</span>
            </div>
          )}

          {/* Show grants if applicable */}
          {module.costs.grants && module.costs.grants > 0 && (
            <div className="flex items-center gap-1 text-chalk-green text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>Grants: {formatCurrency(module.costs.grants)}</span>
            </div>
          )}

          {module.costs.monthly && module.costs.monthly !== 0 && (
            <div className="flex items-center gap-1">
              {module.costs.monthly > 0 ? (
                <>
                  <TrendingDown className="w-3 h-3 text-chalk-red" />
                  <span className="text-chalk-red">
                    Monthly: {formatCurrency(Math.abs(module.costs.monthly))}
                  </span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-3 h-3 text-chalk-green" />
                  <span className="text-chalk-green">
                    Income: {formatCurrency(Math.abs(module.costs.monthly))}
                  </span>
                </>
              )}
            </div>
          )}

          {module.costs.duration && (
            <div className="flex items-center gap-1 text-chalk-blue">
              <Calendar className="w-3 h-3" />
              <span>{Math.floor(module.costs.duration / 12)} years</span>
            </div>
          )}

          {module.income?.monthly && (
            <div className="flex items-center gap-1 text-chalk-green">
              <TrendingUp className="w-3 h-3" />
              <span>+{formatCurrency(module.income.monthly)}/mo</span>
            </div>
          )}
        </div>
      )}

      {/* Description for library modules */}
      {isInLibrary && (
        <p className="text-xs font-casual text-chalk-white opacity-70">
          Drag to timeline to customize
        </p>
      )}

      {/* Age/Year display for placed modules */}
      {!isInLibrary && module.age > 0 && (
        <div className="mt-2 pt-2 border-t border-chalk-white border-opacity-30">
          <div className="text-xs font-casual text-chalk-white">
            Age {module.age} • Year {module.year}
          </div>
        </div>
      )}
    </motion.div>
  );
}