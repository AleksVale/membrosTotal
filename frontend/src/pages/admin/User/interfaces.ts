export type User = {
  id: string
  email: string
  phone: string
  document: string
  birthDate: string
  instagram: string
  pixKey: string
  firstName: string
  lastName: string
}

export const users: User[] = [
  {
    id: '1',
    email: 'user1@example.com',
    phone: '123-456-7890',
    document: '123456789',
    birthDate: 'John Doe',
    instagram: '@john_doe',
    pixKey: 'john.doe@pix.com',
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    id: '2',
    email: 'user2@example.com',
    phone: '987-654-3210',
    document: '987654321',
    birthDate: 'Jane Smith',
    instagram: '@jane_smith',
    pixKey: 'jane.smith@pix.com',
    firstName: 'Jane',
    lastName: 'Smith',
  },
  {
    id: '3',
    email: 'user3@example.com',
    phone: '555-123-4567',
    document: '555123456',
    birthDate: 'Bob Johnson',
    instagram: '@bob_johnson',
    pixKey: 'bob.johnson@pix.com',
    firstName: 'Bob',
    lastName: 'Johnson',
  },
  {
    id: '4',
    email: 'user4@example.com',
    phone: '111-222-3333',
    document: '111222333',
    birthDate: 'Alice Johnson',
    instagram: '@alice_johnson',
    pixKey: 'alice.johnson@pix.com',
    firstName: 'Alice',
    lastName: 'Johnson',
  },
  {
    id: '5',
    email: 'user5@example.com',
    phone: '999-888-7777',
    document: '999888777',
    birthDate: 'Charlie Brown',
    instagram: '@charlie_brown',
    pixKey: 'charlie.brown@pix.com',
    firstName: 'Charlie',
    lastName: 'Brown',
  },
  {
    id: '6',
    email: 'user6@example.com',
    phone: '444-555-6666',
    document: '444555666',
    birthDate: 'Eva Martinez',
    instagram: '@eva_martinez',
    pixKey: 'eva.martinez@pix.com',
    firstName: 'Eva',
    lastName: 'Martinez',
  },
]
