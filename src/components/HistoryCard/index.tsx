import { Container, Title, Amount } from './styles';

type HistoryCardProps = {
  color: string;
  title: string;
  amount: string;
};

export function HistoryCard({ color, amount, title }: HistoryCardProps) {
  return (
    <Container color={color}>
      <Title>{title}</Title>
      <Amount>{amount}</Amount>
    </Container>
  );
}
