import { Auth } from 'aws-amplify';

const getToken = async () => {
  const userToken = (await Auth.currentSession()).getIdToken().getJwtToken();

  return userToken;
};

export { getToken };
