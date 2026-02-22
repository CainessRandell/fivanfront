import { useState } from 'react';
import styled from 'styled-components';
import { authApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

const Wrapper = styled.section`
  width: 100%;
  max-width: 420px;
  padding: 1.25rem;
  border-radius: 1rem;
  background: ${({ theme }) => theme.colors.panel};
  box-shadow: ${({ theme }) => theme.shadow.soft};
`;

const Title = styled.h2`
  margin: 0 0 1rem;
  font-size: 1.2rem;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 0.85rem;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.6rem;
  padding: 0.65rem 0.75rem;
  font-size: 0.95rem;
`;

const Select = styled.select`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.6rem;
  padding: 0.65rem 0.75rem;
  font-size: 0.95rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.65rem;
`;

const Button = styled.button`
  border: 0;
  border-radius: 0.6rem;
  background: ${({ theme, $ghost }) => ($ghost ? '#f0f2f7' : theme.colors.primary)};
  color: ${({ theme, $ghost }) => ($ghost ? theme.colors.text : '#fff')};
  padding: 0.6rem 0.85rem;
  cursor: pointer;
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  margin: 0.5rem 0 0;
`;

export function AuthPanel() {
  const { login } = useAuth();
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ nome: '', email: '', senha: '', role: 'aluno' });

  const onChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        await authApi.register({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          role: form.role
        });
        setMode('login');
      } else {
        const response = await authApi.login({ email: form.email, senha: form.senha });
        login(response);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>{mode === 'login' ? 'Login' : 'Criar conta'}</Title>
      <form onSubmit={onSubmit}>
        {mode === 'register' && (
          <Row>
            <label htmlFor="nome">Nome</label>
            <Input id="nome" value={form.nome} onChange={onChange('nome')} required />
          </Row>
        )}

        <Row>
          <label htmlFor="email">Email</label>
          <Input id="email" type="email" value={form.email} onChange={onChange('email')} required />
        </Row>

        <Row>
          <label htmlFor="senha">Senha</label>
          <Input id="senha" type="password" value={form.senha} onChange={onChange('senha')} required />
        </Row>

        {mode === 'register' && (
          <Row>
            <label htmlFor="role">Perfil</label>
            <Select id="role" value={form.role} onChange={onChange('role')}>
              <option value="aluno">Aluno</option>
              <option value="professor">Professor</option>
            </Select>
          </Row>
        )}

        <Actions>
          <Button type="submit" disabled={loading}>
            {loading ? 'Carregando...' : mode === 'login' ? 'Entrar' : 'Registrar'}
          </Button>
          <Button
            type="button"
            $ghost
            onClick={() => {
              setError('');
              setMode((prev) => (prev === 'login' ? 'register' : 'login'));
            }}
          >
            {mode === 'login' ? 'Criar conta' : 'Voltar'}
          </Button>
        </Actions>
      </form>
      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
}
