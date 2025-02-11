import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

interface Errors {
  email?: string;
  password?: string;
}

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export default function LoginPage() {
  // const theme = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});
  const [loginStatus, setLoginStatus] = useState<{ message: string, success: boolean } | null>(null);



  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const newErrors: Errors = {
      email: validateField('email', email),
      password: validateField('password', password)
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BE_DOMAIN_NAME}/api/login`, {
        email,
        password
      });

      if (response.data.login) {
        setEmail('');
        setPassword('');
        setErrors({});
        setLoginStatus({ message: 'Login successful', success: true });
        navigate('/todolist', { replace: true });
      } else {
        setLoginStatus({ message: 'Invalid email or password', success: false });
      }
    } catch (error) {
      setLoginStatus({ message: 'Invalid email or password', success: false });
    }
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'email':
        return value ? '' : 'Email is required';
      case 'password':
        return value ? '' : 'Password is required';
      default:
        return '';
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
    setErrors({
      ...errors,
      [name]: validateField(name, value)
    });
  };

  return (
    <Card variant="outlined" sx={{ mt: 8 }}>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Sign in
      </Typography>
      {loginStatus && (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 1,
          color: loginStatus.success ? 'success.main' : 'error.main',
        }}>
          {loginStatus.success ? <CheckCircleIcon /> : <ErrorIcon />}
          <Typography variant="body1" ml={1}>{loginStatus.message}</Typography>
        </Box>
      )}
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >
        <TextField
          margin="normal"
          id="email"
          type="email"
          name="email"
          placeholder="your@email.com"
          autoComplete="email"
          autoFocus
          required
          fullWidth
          variant="outlined"
          value={email}
          onChange={handleInputChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          margin="normal"
          name="password"
          placeholder="••••••"
          type="password"
          id="password"
          autoComplete="current-password"
          autoFocus
          required
          fullWidth
          variant="outlined"
          value={password}
          onChange={handleInputChange}
          error={!!errors.password}
          helperText={errors.password}
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
        <Button type="submit" fullWidth color='primary' variant="contained">
          Login
        </Button>
      </Box>
    </Card>
  );
}