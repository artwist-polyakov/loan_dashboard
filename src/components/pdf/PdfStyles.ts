import { StyleSheet, Font } from '@react-pdf/renderer';

// Регистрация шрифтов для кириллицы
Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
  ],
});

// Цветовая палитра
export const colors = {
  primary: '#3b82f6',
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#f59e0b',
  muted: '#6b7280',
  border: '#e5e7eb',
  background: '#f9fafb',
  white: '#ffffff',
  black: '#111827',
};

// Стили документа
export const styles = StyleSheet.create({
  // Страница
  page: {
    fontFamily: 'Roboto',
    fontSize: 10,
    padding: 40,
    backgroundColor: colors.white,
    color: colors.black,
  },

  // Заголовки
  h1: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.black,
  },
  h2: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
    color: colors.black,
  },
  h3: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    color: colors.black,
  },

  // Текст
  text: {
    fontSize: 10,
    marginBottom: 4,
    lineHeight: 1.4,
  },
  textMuted: {
    fontSize: 9,
    color: colors.muted,
  },
  textSuccess: {
    color: colors.success,
  },
  textDanger: {
    color: colors.danger,
  },
  textBold: {
    fontWeight: 'bold',
  },

  // Контейнеры
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  col: {
    flex: 1,
  },
  col2: {
    flex: 2,
  },

  // Карточки
  card: {
    backgroundColor: colors.background,
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardBadge: {
    backgroundColor: colors.success,
    color: colors.white,
    fontSize: 8,
    padding: '2 6',
    borderRadius: 10,
  },

  // Таблицы
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.muted,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  tableRowAlt: {
    backgroundColor: colors.background,
  },
  tableCell: {
    fontSize: 9,
  },
  tableCellRight: {
    textAlign: 'right',
  },

  // Блок победителя
  winnerBlock: {
    backgroundColor: '#dcfce7',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.success,
  },
  winnerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.success,
    marginBottom: 4,
  },

  // Разделители
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginVertical: 12,
  },

  // Сетка из 3 колонок
  grid3: {
    flexDirection: 'row',
    gap: 8,
  },
  gridItem: {
    flex: 1,
  },

  // Метка + значение
  labelValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 9,
    color: colors.muted,
  },
  value: {
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Футер
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: colors.muted,
  },

  // Графики
  chartContainer: {
    marginVertical: 12,
  },
  chartImage: {
    width: '100%',
    height: 200,
    objectFit: 'contain',
  },

  // Заголовок страницы
  pageHeader: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 10,
    color: colors.muted,
  },
});
