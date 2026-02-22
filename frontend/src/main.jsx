import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import { GlobalStyle } from './styles/globalStyles';
import { theme } from './styles/theme';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <GlobalStyle />
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
