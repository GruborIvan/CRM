import { Colors } from './colors';

export const Typography = {
  screenTitle:  { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5,  color: Colors.textPrimary },
  sectionLabel: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.6,   textTransform: 'uppercase' as const, color: Colors.textHint },
  cardTitle:    { fontSize: 15, fontWeight: '600' as const, color: Colors.textPrimary },
  cardSubtitle: { fontSize: 12, color: Colors.textMuted },
  detailName:   { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3,  color: Colors.textPrimary },
  label:        { fontSize: 12, color: Colors.textMuted },
  value:        { fontSize: 13, fontWeight: '500' as const, color: '#dddddd' },
  buttonLabel:  { fontSize: 11, color: Colors.textSecondary },
  tabLabel:     { fontSize: 10 },
  body:         { fontSize: 14, color: Colors.textSecondary },
} as const;
