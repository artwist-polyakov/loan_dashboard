import { View, Text } from '@react-pdf/renderer';
import { styles } from '../PdfStyles';
import type { ComparisonResult } from '@/lib/types/results';
import type { InputParameters } from '@/lib/types/inputs';
import { formatCurrency } from '@/lib/utils/formatting';

interface TablesSectionProps {
  result: ComparisonResult;
  inputs: InputParameters;
}

export function TablesSection({ result, inputs }: TablesSectionProps) {
  // Группируем данные по годам для компактности
  const mortgageByYear = groupMortgageByYear(result.mortgageSchedule);
  const depositByYear = groupDepositByYear(result.depositSchedule);

  return (
    <View>
      <Text style={styles.h2}>Таблицы платежей</Text>

      {/* Таблица ипотеки */}
      <View style={styles.card}>
        <Text style={styles.h3}>Ипотека (по годам)</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Год</Text>
            <Text style={[styles.tableHeaderCell, { width: '18%', textAlign: 'right' }]}>Платежи</Text>
            <Text style={[styles.tableHeaderCell, { width: '18%', textAlign: 'right' }]}>Основной долг</Text>
            <Text style={[styles.tableHeaderCell, { width: '18%', textAlign: 'right' }]}>Проценты</Text>
            <Text style={[styles.tableHeaderCell, { width: '18%', textAlign: 'right' }]}>Остаток</Text>
            <Text style={[styles.tableHeaderCell, { width: '18%', textAlign: 'right' }]}>Всего выплачено</Text>
          </View>
          {mortgageByYear.slice(0, inputs.analysisPeriod).map((row, index) => (
            <View key={index} style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={[styles.tableCell, { width: '10%' }]}>{row.year}</Text>
              <Text style={[styles.tableCell, styles.tableCellRight, { width: '18%' }]}>
                {formatCurrency(row.totalPayments, true)}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellRight, { width: '18%' }]}>
                {formatCurrency(row.principalPaid, true)}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellRight, { width: '18%' }]}>
                {formatCurrency(row.interestPaid, true)}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellRight, { width: '18%' }]}>
                {formatCurrency(row.balance, true)}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellRight, { width: '18%' }]}>
                {formatCurrency(row.cumulativePaid, true)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Таблица вклада */}
      <View style={styles.card} break>
        <Text style={styles.h3}>Банковский вклад (по годам)</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: '12%' }]}>Год</Text>
            <Text style={[styles.tableHeaderCell, { width: '22%', textAlign: 'right' }]}>Внесено за год</Text>
            <Text style={[styles.tableHeaderCell, { width: '22%', textAlign: 'right' }]}>Проценты за год</Text>
            <Text style={[styles.tableHeaderCell, { width: '22%', textAlign: 'right' }]}>Баланс</Text>
            <Text style={[styles.tableHeaderCell, { width: '22%', textAlign: 'right' }]}>Всего внесено</Text>
          </View>
          {depositByYear.slice(0, inputs.analysisPeriod).map((row, index) => (
            <View key={index} style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={[styles.tableCell, { width: '12%' }]}>{row.year}</Text>
              <Text style={[styles.tableCell, styles.tableCellRight, { width: '22%' }]}>
                {formatCurrency(row.contributionsThisYear, true)}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellRight, { width: '22%' }]}>
                {formatCurrency(row.interestThisYear, true)}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellRight, { width: '22%' }]}>
                {formatCurrency(row.balance, true)}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellRight, { width: '22%' }]}>
                {formatCurrency(row.cumulativeContributions, true)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

interface MortgageYearRow {
  year: number;
  totalPayments: number;
  principalPaid: number;
  interestPaid: number;
  balance: number;
  cumulativePaid: number;
}

function groupMortgageByYear(schedule: ComparisonResult['mortgageSchedule']): MortgageYearRow[] {
  const years: MortgageYearRow[] = [];
  let currentYear = 1;
  let yearPayments = 0;
  let yearPrincipal = 0;
  let yearInterest = 0;
  let lastBalance = 0;
  let cumulativePaid = 0;

  for (let i = 0; i < schedule.length; i++) {
    const row = schedule[i];
    const rowYear = Math.ceil((i + 1) / 12);

    if (rowYear !== currentYear) {
      years.push({
        year: currentYear,
        totalPayments: yearPayments,
        principalPaid: yearPrincipal,
        interestPaid: yearInterest,
        balance: lastBalance,
        cumulativePaid,
      });
      currentYear = rowYear;
      yearPayments = 0;
      yearPrincipal = 0;
      yearInterest = 0;
    }

    yearPayments += row.payment;
    yearPrincipal += row.principal;
    yearInterest += row.interest;
    lastBalance = row.balance;
    cumulativePaid = row.cumulativeInterest + row.cumulativePrincipal;
  }

  // Последний год
  if (yearPayments > 0) {
    years.push({
      year: currentYear,
      totalPayments: yearPayments,
      principalPaid: yearPrincipal,
      interestPaid: yearInterest,
      balance: lastBalance,
      cumulativePaid,
    });
  }

  return years;
}

interface DepositYearRow {
  year: number;
  contributionsThisYear: number;
  interestThisYear: number;
  balance: number;
  cumulativeContributions: number;
}

function groupDepositByYear(schedule: ComparisonResult['depositSchedule']): DepositYearRow[] {
  const years: DepositYearRow[] = [];
  let currentYear = 1;
  let yearContributions = 0;
  let yearInterest = 0;
  let prevYearInterest = 0;
  let prevYearContributions = 0;
  let lastBalance = 0;
  let lastCumulativeContributions = 0;

  for (let i = 0; i < schedule.length; i++) {
    const row = schedule[i];
    const rowYear = Math.ceil((i + 1) / 12);

    if (rowYear !== currentYear) {
      years.push({
        year: currentYear,
        contributionsThisYear: yearContributions,
        interestThisYear: yearInterest,
        balance: lastBalance,
        cumulativeContributions: lastCumulativeContributions,
      });
      currentYear = rowYear;
      prevYearContributions = lastCumulativeContributions;
      prevYearInterest = row.cumulativeInterest - row.interest;
      yearContributions = 0;
      yearInterest = 0;
    }

    yearContributions = row.cumulativeContributions - prevYearContributions;
    yearInterest = row.cumulativeInterest - prevYearInterest;
    lastBalance = row.balance;
    lastCumulativeContributions = row.cumulativeContributions;
  }

  // Последний год
  if (lastBalance > 0) {
    years.push({
      year: currentYear,
      contributionsThisYear: yearContributions,
      interestThisYear: yearInterest,
      balance: lastBalance,
      cumulativeContributions: lastCumulativeContributions,
    });
  }

  return years;
}
