import { Container, Category, Icon } from './styles';

type CategoryProps = {
  title: string;
};

export function CategorySelect({ title }: CategoryProps) {
  return (
    <Container>
      <Category>{title}</Category>
      <Icon name="chevron-down" />
    </Container>
  );
}
