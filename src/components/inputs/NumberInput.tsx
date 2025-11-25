import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatNumber, parseNumberInput } from '@/lib/utils/formatting';
import { HelpCircle } from 'lucide-react';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  tooltip?: string;
  min?: number;
  max?: number;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  decimals?: number;
}

export function NumberInput({
  label,
  value,
  onChange,
  suffix,
  tooltip,
  min,
  max,
  required,
  disabled,
  readOnly,
  error,
  decimals = 0,
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  // Форматируем значение при изменении извне
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(value ? formatNumber(value, decimals) : '');
    }
  }, [value, isFocused, decimals]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      setDisplayValue(rawValue);

      const parsed = parseNumberInput(rawValue);
      if (!isNaN(parsed)) {
        let newValue = parsed;
        if (min !== undefined && newValue < min) newValue = min;
        if (max !== undefined && newValue > max) newValue = max;
        onChange(newValue);
      }
    },
    [onChange, min, max]
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    // Показываем чистое число при фокусе
    setDisplayValue(value ? String(value) : '');
  }, [value]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    // Форматируем при потере фокуса
    setDisplayValue(value ? formatNumber(value, decimals) : '');
  }, [value, decimals]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        <Label required={required}>{label}</Label>
        {tooltip && (
          <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen} delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="text-muted hover:text-foreground transition-colors touch-manipulation"
                aria-label="Справка"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setTooltipOpen(!tooltipOpen);
                }}
                onPointerDown={(e) => {
                  // Предотвращаем стандартное поведение для touch events
                  if (e.pointerType === 'touch') {
                    e.preventDefault();
                  }
                }}
              >
                <HelpCircle className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              className="max-w-xs"
              side="top"
              align="center"
              sideOffset={8}
              onPointerDownOutside={() => setTooltipOpen(false)}
            >
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <Input
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        suffix={suffix}
        disabled={disabled}
        readOnly={readOnly}
        error={error}
        className={readOnly ? 'bg-muted/10 cursor-default' : ''}
      />
    </div>
  );
}
