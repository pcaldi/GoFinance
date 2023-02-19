import { Container, Icon, Title, Button } from './styles';

import { RectButtonProps } from 'react-native-gesture-handler';

const icons = {
  up: 'arrow-up-circle',
  down: 'arrow-down-circle',
};

type TransactionTypeButtonProps = RectButtonProps & {
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
    <Container isActive={isActive} type={type}>
      <Button {...rest}>
        <Icon type={type} name={icons[type]} />
        <Title>{title}</Title>
      </Button>
    </Container>
  );
}
