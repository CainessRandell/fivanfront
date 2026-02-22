import styled from 'styled-components';
import { AuthPanel } from './components/AuthPanel';
import { PostDashboard } from './components/PostDashboard';
import { useAuth } from './context/AuthContext';

const Page = styled.main`
  min-height: 100vh;
  padding: 2rem 1rem;
  background: radial-gradient(circle at top right, #f7f0de 0%, #f2f5fb 45%, #eef3f9 100%);
`;

const Shell = styled.div`
  width: min(1080px, 100%);
  margin: 0 auto;
  display: grid;
  gap: 1rem;
  justify-items: center;
`;

const Title = styled.h1`
  margin: 0;
  text-align: center;
`;

const Subtitle = styled.p`
  margin: 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
`;

function App() {
  const { token } = useAuth();

  return (
    <Page>
      <Shell>
        <Title>Fivam Posts</Title>
        <Subtitle>React + Styled Components + REST API</Subtitle>
        {!token ? <AuthPanel /> : <PostDashboard />}
      </Shell>
    </Page>
  );
}

export default App;
