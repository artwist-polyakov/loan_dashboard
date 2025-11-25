import { View, Text } from '@react-pdf/renderer';
import { styles } from '../PdfStyles';
import type { InputParameters } from '@/lib/types/inputs';
import { formatCurrency, formatPercent } from '@/lib/utils/formatting';

interface InputsSectionProps {
  inputs: InputParameters;
}

export function InputsSection({ inputs }: InputsSectionProps) {
  return (
    <View>
      <Text style={styles.h2}>Входные параметры</Text>

      {/* Основные параметры в 2 колонки */}
      <View style={styles.grid2}>
        {/* Недвижимость */}
        <View style={[styles.card, styles.grid2Item]}>
          <Text style={styles.h3}>Недвижимость</Text>
          <ParamRow label="Стоимость" value={formatCurrency(inputs.propertyPrice)} />
          <ParamRow label="Первоначальный взнос" value={formatCurrency(inputs.downPayment)} />
          {inputs.area && <ParamRow label="Площадь" value={`${inputs.area} м²`} />}
          <ParamRow label="Срок анализа" value={`${inputs.analysisPeriod} лет`} />
          {inputs.expectedPricePerSqmAtSale && (
            <ParamRow
              label="Ожид. цена м² при продаже"
              value={formatCurrency(inputs.expectedPricePerSqmAtSale)}
            />
          )}
        </View>

        {/* Ипотека */}
        <View style={[styles.card, styles.grid2Item]}>
          <Text style={styles.h3}>Ипотека</Text>
          <ParamRow label="Ставка" value={formatPercent(inputs.mortgageRate)} />
          <ParamRow label="Срок" value={`${inputs.loanTerm} лет`} />
          <ParamRow label="Доп. платёж" value={formatCurrency(inputs.extraMonthlyPayment)} />
        </View>
      </View>

      <View style={styles.grid2}>
        {/* Вклад и инфляция */}
        <View style={[styles.card, styles.grid2Item]}>
          <Text style={styles.h3}>Вклад и инфляция</Text>
          <ParamRow label="Ставка вклада" value={formatPercent(inputs.depositRate)} />
          <ParamRow
            label="Инфляция"
            value={
              inputs.useEqualizer
                ? `Эквалайзер (${inputs.yearlyInflation.length} лет)`
                : formatPercent(inputs.inflationRate)
            }
          />
        </View>

        {/* Аренда */}
        <View style={[styles.card, styles.grid2Item]}>
          <Text style={styles.h3}>Аренда</Text>
          <ParamRow label="Начальная ставка" value={`${formatCurrency(inputs.monthlyRent)}/мес`} />
          <ParamRow label="Индексация" value="По инфляции" />
        </View>
      </View>

      {/* Ремонт */}
      {inputs.renovationRequired && (
        <View style={styles.grid2}>
          <View style={[styles.card, styles.grid2Item]}>
            <Text style={styles.h3}>Ремонт</Text>
            <ParamRow label="Требуется" value="Да" />
            <ParamRow label="Стоимость за м²" value={formatCurrency(inputs.renovationCostPerSqm)} />
            <ParamRow label="Возврат при продаже" value={formatPercent(inputs.renovationReturnRate)} />
            <ParamRow label="Год сдачи дома" value={String(inputs.completionYear)} />
          </View>

          {/* Эквалайзер инфляции (если включён) */}
          {inputs.useEqualizer && inputs.yearlyInflation.length > 0 && (
            <View style={[styles.card, styles.grid2Item]}>
              <Text style={styles.h3}>Инфляция по годам</Text>
              {inputs.yearlyInflation.slice(0, 6).map((rate, index) => (
                <ParamRow key={index} label={`Год ${index + 1}`} value={formatPercent(rate)} />
              ))}
              {inputs.yearlyInflation.length > 6 && (
                <Text style={[styles.textMuted, { marginTop: 4 }]}>
                  ...и ещё {inputs.yearlyInflation.length - 6} лет
                </Text>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

function ParamRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.labelValue}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}
