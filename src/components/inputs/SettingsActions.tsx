import { useRef } from 'react';
import { useInputStore } from '@/store/inputStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { exportSettings, importSettings } from '@/lib/utils/settings-io';
import { Download, Upload, RotateCcw } from 'lucide-react';

export function SettingsActions() {
  const { inputs, setMultipleInputs, resetToDefaults } = useInputStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportSettings(inputs);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedInputs = await importSettings(file);
      setMultipleInputs(importedInputs);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка загрузки');
    }

    // Сбрасываем input для повторной загрузки того же файла
    e.target.value = '';
  };

  const handleReset = () => {
    if (confirm('Сбросить все настройки к значениям по умолчанию?')) {
      resetToDefaults();
    }
  };

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleExport}
            title="Сохранить настройки в файл"
          >
            <Download className="h-4 w-4 mr-1" />
            Экспорт
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleImportClick}
            title="Загрузить настройки из файла"
          >
            <Upload className="h-4 w-4 mr-1" />
            Импорт
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            title="Сбросить к значениям по умолчанию"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
}
