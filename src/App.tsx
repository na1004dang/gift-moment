import { createGlobalStyle } from 'styled-components';
import Router from './routes/Router';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #fff;
    color: #1a1a1a;
    -webkit-font-smoothing: antialiased;
  }
  a { text-decoration: none; color: inherit; }
`;

export default function App() {
  return (
    <>
      <GlobalStyle />
      <Router />
    </>
  );
}
