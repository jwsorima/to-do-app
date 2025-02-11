import { lazy, Suspense } from 'react';
import { Loading } from './components/Loading';
import { createTheme, CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const ProtectedRoute = lazy(() => import('./pages/ProtectedRoute'))
const TodoList = lazy(() => import('./pages/TodoList'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

import './App.css'


function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#A3D1C6',
      },
      secondary: {
        main: '#666666',
      },
    },
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: "#666666",
          },
        },
      },
    },
  });

  const globalStyles = (
    <GlobalStyles
      styles={{
        body: {
          backgroundColor: 'transparent',
        },
      }}
    />
  );


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {globalStyles}
      <Suspense fallback={<Loading />}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/todolist"
              element={
                <Suspense fallback={<Loading />}>
                  <TodoList />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </Router>
      </Suspense>
    </ThemeProvider>
  )
}

export default App
