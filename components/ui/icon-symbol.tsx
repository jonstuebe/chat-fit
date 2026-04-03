import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];
type IconMapping = Record<string, MaterialIconName>;

const MAPPING: IconMapping = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'bubble.left.and.bubble.right.fill': 'chat',
  'figure.run': 'directions-run',
  'square.and.pencil': 'edit',
  'arrow.up': 'arrow-upward',
  'play.fill': 'play-arrow',
  'pause.fill': 'pause',
  'checkmark': 'check',
  'checkmark.circle.fill': 'check-circle',
  'ellipsis.circle': 'more-horiz',
  'trash': 'delete',
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const mappedName = MAPPING[name] || 'help-outline';
  return <MaterialIcons color={color} size={size} name={mappedName} style={style} />;
}
