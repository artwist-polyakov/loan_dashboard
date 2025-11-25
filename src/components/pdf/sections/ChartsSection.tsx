import { View, Text, Image } from '@react-pdf/renderer';
import { styles } from '../PdfStyles';

interface ChartsSectionProps {
  debtVsDepositImage?: string;
  netWorthImage?: string;
}

export function ChartsSection({ debtVsDepositImage, netWorthImage }: ChartsSectionProps) {
  if (!debtVsDepositImage && !netWorthImage) {
    return null;
  }

  return (
    <View>
      <Text style={styles.h2}>Графики</Text>

      {debtVsDepositImage && (
        <View style={styles.card}>
          <Text style={styles.h3}>Остаток долга vs Баланс вклада</Text>
          <View style={styles.chartContainer}>
            <Image src={debtVsDepositImage} style={styles.chartImage} />
          </View>
        </View>
      )}

      {netWorthImage && (
        <View style={styles.card}>
          <Text style={styles.h3}>Чистая стоимость по стратегиям</Text>
          <View style={styles.chartContainer}>
            <Image src={netWorthImage} style={styles.chartImage} />
          </View>
        </View>
      )}
    </View>
  );
}
