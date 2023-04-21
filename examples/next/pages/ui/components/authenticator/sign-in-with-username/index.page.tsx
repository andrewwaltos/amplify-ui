import { Amplify } from 'aws-amplify';

import {
  useAuthenticator,
  withAuthenticator,
} from '@aws-amplify/ui-react-auth';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

function App() {
  const { user, signOut } = useAuthenticator(({ user }) => [user]);
  console.log('next example user', user);

  return (
    <main>
      <h1>Hello {user?.username}</h1>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default withAuthenticator(App);
