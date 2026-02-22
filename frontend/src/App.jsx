import styled from 'styled-components';
import { AuthPanel } from './components/AuthPanel';
import { PostDashboard } from './components/PostDashboard';
import { useAuth } from './context/AuthContext';

const ENV_LABELS = {
  development: 'Desenvolvimento',
  homologation: 'Homologacao',
  staging: 'Homologacao',
  production: 'Producao'
};

const ENV_TONES = {
  development: {
    text: '#8a3d00',
    bg: '#ffe8d6',
    border: '#f6b97a'
  },
  homologation: {
    text: '#0b5d3a',
    bg: '#dff6ea',
    border: '#8bd3af'
  },
  production: {
    text: '#0f3d8c',
    bg: '#deebff',
    border: '#8fb5f5'
  }
};

function resolveEnvironment() {
  const raw = (import.meta.env.VITE_APP_ENV || import.meta.env.MODE || 'development').toLowerCase();

  if (['homologacao', 'homologation', 'homolog', 'staging'].includes(raw)) {
    return 'homologation';
  }

  if (raw === 'production' || raw === 'prod') {
    return 'production';
  }

  return 'development';
}

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

const Header = styled.header`
  display: grid;
  gap: 0.5rem;
  justify-items: center;
`;

const HeaderRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
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

const EnvBadge = styled.span`
  font-size: 0.8rem;
  letter-spacing: 0.02em;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  border: 1px solid ${({ $envKey }) => ENV_TONES[$envKey].border};
  color: ${({ $envKey }) => ENV_TONES[$envKey].text};
  background: ${({ $envKey }) => ENV_TONES[$envKey].bg};
`;

function App() {
  const { token } = useAuth();
  const envKey = resolveEnvironment();

  return (
    <Page>
      <Shell>
        <Header>
          <Title>Fivam Posts</Title>
          <Subtitle>React + Styled Components + REST API</Subtitle>
          <HeaderRow>
            <EnvBadge $envKey={envKey}>Ambiente: {ENV_LABELS[envKey]}</EnvBadge>
          </HeaderRow>
        </Header>
        {!token ? <AuthPanel /> : <PostDashboard />}
      </Shell>
    </Page>
  );
}

export default App;
