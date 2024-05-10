import './App.css';

import { Provider } from 'react-redux';
import { store } from './store'
import { HashRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './features/home/home.page';
import { Layout } from './components/layout';
import { ThemeProvider, createTheme } from '@mui/material';
import { PlanPage } from './features/plan/plan.page';
import { TransactionsPage } from './features/transactions/transactions.page';

const theme = createTheme({
  palette: {
    secondary: {
      main: '#eee',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <HashRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/plan" element={<PlanPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
            </Route>
          </Routes>
        </HashRouter>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
