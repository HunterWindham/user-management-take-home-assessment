import { Container, Typography } from '@mui/material';
import { UsersTable } from './components/UsersTable';

function App() {
  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" component="h1" gutterBottom className="mb-6">
        User Management
      </Typography>
      <UsersTable />
    </Container>
  );
}

export default App;
