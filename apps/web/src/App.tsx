import { useState, useRef } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { UsersTable, type UsersTableRef } from './components/UsersTable';
import { CreateUserDialog } from './components/CreateUserDialog';

function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const tableRef = useRef<UsersTableRef>(null);

  const handleCreateSuccess = () => {
    // Refresh the table after successful creation
    tableRef.current?.refresh();
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Create User
        </Button>
      </Box>
      <UsersTable ref={tableRef} />
      <CreateUserDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </Container>
  );
}

export default App;
