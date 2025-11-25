import * as Dialog from '@radix-ui/react-dialog';
import { useUIStore } from '@/store/uiStore';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function InfoModal() {
  const { infoModalOpen, closeInfoModal } = useUIStore();

  return (
    <Dialog.Root open={infoModalOpen} onOpenChange={closeInfoModal}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-lg translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-lg border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <Dialog.Title className="text-lg font-semibold">
            О калькуляторе
          </Dialog.Title>

          <div className="mt-4 space-y-4 text-sm">
            <p>
              Этот калькулятор сравнивает три финансовые стратегии на заданном
              временном горизонте:
            </p>

            <div className="space-y-2">
              <h3 className="font-medium">Стратегия A: Ипотека + продажа</h3>
              <p className="text-muted">
                Покупка квартиры в ипотеку и продажа через N лет. Рассчитывается
                чистая выручка после погашения остатка долга.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Стратегия B: Ипотека + аренда</h3>
              <p className="text-muted">
                Покупка квартиры в ипотеку и сдача в аренду. Учитывается доход от
                аренды и рост стоимости актива.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Стратегия C: Банковский вклад</h3>
              <p className="text-muted">
                Вместо покупки недвижимости деньги кладутся на вклад. Первоначальный
                взнос и ежемесячные платежи по ипотеке идут на пополнение вклада.
              </p>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Допущения модели</h3>
              <ul className="list-disc list-inside space-y-1 text-muted">
                <li>Ставка ипотеки фиксирована на весь срок</li>
                <li>Капитализация процентов по вкладу ежемесячная</li>
                <li>Аренда индексируется на уровень инфляции ежегодно</li>
                <li>Цена недвижимости растёт согласно выбранному сценарию</li>
                <li>Налоги, страхование и прочие расходы не учтены</li>
                <li>Ремонт увеличивает стоимость квартиры (не вычитается из прибыли)</li>
              </ul>
            </div>
          </div>

          <Dialog.Close asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
            >
              <X className="h-4 w-4" />
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
