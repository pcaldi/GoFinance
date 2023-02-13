import { Container, Icon, Title } from './styles';

import { TouchableOpacityProps } from 'react-native';

const icons = {
  up: 'arrow-up-circle',
  down: 'arrow-down-circle',
};

type TransactionTypeButtonProps = TouchableOpacityProps & {
  type: 'up' | 'down';
  title: string;
  isActive: boolean;
};

export function TransactionTypeButton({
  type,
  title,
  isActive,
  ...rest
}: TransactionTypeButtonProps) {
  return (
    <Container isActive={isActive} type={type} {...rest}>
      <Icon type={type} name={icons[type]} />
      <Title>{title}</Title>
    </Container>
  );
}
