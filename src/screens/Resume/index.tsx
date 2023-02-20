import { HistoryCard } from '../../components/HistoryCard';
import { Container, Title, Header } from './styles';

export function Resume() {
  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      <HistoryCard amount="R$ 150,50" title="Compras" color="red" />
    </Container>
  );
}
