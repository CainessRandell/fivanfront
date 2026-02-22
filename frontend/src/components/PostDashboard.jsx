import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { postsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

const Wrapper = styled.section`
  width: 100%;
  max-width: 860px;
  padding: 1.25rem;
  border-radius: 1rem;
  background: ${({ theme }) => theme.colors.panel};
  box-shadow: ${({ theme }) => theme.shadow.soft};
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const Name = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 0.75rem;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.6rem;
  padding: 0.65rem 0.75rem;
  font-size: 0.95rem;
`;

const Textarea = styled.textarea`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.6rem;
  padding: 0.65rem 0.75rem;
  min-height: 120px;
  font-size: 0.95rem;
`;

const Button = styled.button`
  border: 0;
  border-radius: 0.6rem;
  padding: 0.55rem 0.8rem;
  cursor: pointer;
  background: ${({ theme, $kind }) => {
    if ($kind === 'danger') return theme.colors.danger;
    if ($kind === 'ghost') return '#eef1f6';
    return theme.colors.primary;
  }};
  color: ${({ theme, $kind }) => ($kind === 'ghost' ? theme.colors.text : '#fff')};
`;

const Actions = styled.div`
  display: flex;
  gap: 0.6rem;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
  display: grid;
  gap: 0.8rem;
`;

const Item = styled.li`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.8rem;
  padding: 0.85rem;
`;

const ItemTitle = styled.h3`
  margin: 0;
  font-size: 1.05rem;
`;

const ItemMeta = styled.p`
  margin: 0.35rem 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.9rem;
`;

const ItemBody = styled.p`
  margin: 0.4rem 0 0.7rem;
  line-height: 1.45;
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.danger};
`;

export function PostDashboard() {
  const { token, user, logout } = useAuth();
  const canWrite = useMemo(() => user?.role === 'professor', [user]);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState({ titulo: '', conteudo: '', autor: '' });

  const resetForm = () => {
    setEditingId('');
    setForm({ titulo: '', conteudo: '', autor: '' });
  };

  const handleRequestError = (err) => {
    if (err?.status === 401) {
      logout();
      return;
    }
    setError(err.message);
  };

  const loadPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await postsApi.list(token);
      setPosts(data);
    } catch (err) {
      handleRequestError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const startEdit = (post) => {
    setEditingId(post._id);
    setForm({
      titulo: post.titulo,
      conteudo: post.conteudo,
      autor: post.autor || ''
    });
  };

  const onChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      if (editingId) {
        await postsApi.update(editingId, form, token);
      } else {
        await postsApi.create(form, token);
      }
      resetForm();
      await loadPosts();
    } catch (err) {
      handleRequestError(err);
    }
  };

  const onDelete = async (id) => {
    try {
      await postsApi.remove(id, token);
      await loadPosts();
    } catch (err) {
      handleRequestError(err);
    }
  };

  return (
    <Wrapper>
      <Header>
        <div>
          <h2>Painel de posts</h2>
          <Name>
            {user?.nome || user?.email} ({user?.role})
          </Name>
        </div>
        <Button $kind="ghost" onClick={logout}>
          Sair
        </Button>
      </Header>

      {canWrite && (
        <form onSubmit={onSubmit}>
          <Row>
            <label htmlFor="titulo">Titulo</label>
            <Input id="titulo" value={form.titulo} onChange={onChange('titulo')} required />
          </Row>

          <Row>
            <label htmlFor="conteudo">Conteudo</label>
            <Textarea id="conteudo" value={form.conteudo} onChange={onChange('conteudo')} required />
          </Row>

          <Row>
            <label htmlFor="autor">Autor</label>
            <Input id="autor" value={form.autor} onChange={onChange('autor')} />
          </Row>

          <Actions>
            <Button type="submit">{editingId ? 'Salvar alteracoes' : 'Criar post'}</Button>
            {editingId && (
              <Button type="button" $kind="ghost" onClick={resetForm}>
                Cancelar
              </Button>
            )}
          </Actions>
        </form>
      )}

      {!canWrite && <Name>Perfil aluno: somente leitura de posts.</Name>}

      {error && <ErrorText>{error}</ErrorText>}

      {loading ? (
        <p>Carregando posts...</p>
      ) : (
        <List>
          {posts.map((post) => (
            <Item key={post._id}>
              <ItemTitle>{post.titulo}</ItemTitle>
              <ItemMeta>{post.autor || 'Sem autor'} - {new Date(post.dataCriacao).toLocaleString()}</ItemMeta>
              <ItemBody>{post.conteudo}</ItemBody>
              {canWrite && (
                <Actions>
                  <Button type="button" $kind="ghost" onClick={() => startEdit(post)}>
                    Editar
                  </Button>
                  <Button type="button" $kind="danger" onClick={() => onDelete(post._id)}>
                    Excluir
                  </Button>
                </Actions>
              )}
            </Item>
          ))}
        </List>
      )}
    </Wrapper>
  );
}
