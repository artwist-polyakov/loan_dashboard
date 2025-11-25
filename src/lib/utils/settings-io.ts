import type { InputParameters } from '../types/inputs';
import { DEFAULT_INPUTS } from '../types/inputs';

const SETTINGS_VERSION = 1;

interface ExportedSettings {
  version: number;
  exportedAt: string;
  inputs: InputParameters;
}

/**
 * Экспорт настроек в JSON файл
 */
export function exportSettings(inputs: InputParameters): void {
  const data: ExportedSettings = {
    version: SETTINGS_VERSION,
    exportedAt: new Date().toISOString(),
    inputs,
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `mortgage-calc-settings-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Импорт настроек из JSON файла
 */
export function importSettings(file: File): Promise<InputParameters> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const data = JSON.parse(text) as ExportedSettings;

        // Проверяем структуру
        if (!data.inputs) {
          throw new Error('Неверный формат файла: отсутствует поле inputs');
        }

        // Мержим с дефолтами для обратной совместимости
        const inputs: InputParameters = {
          ...DEFAULT_INPUTS,
          ...data.inputs,
        };

        // Валидация основных полей
        if (typeof inputs.propertyPrice !== 'number' || inputs.propertyPrice <= 0) {
          throw new Error('Неверное значение стоимости недвижимости');
        }

        resolve(inputs);
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Ошибка парсинга файла'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Ошибка чтения файла'));
    };

    reader.readAsText(file);
  });
}
