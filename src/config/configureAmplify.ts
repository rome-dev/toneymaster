import Amplify from 'aws-amplify';

export default () => {
  console.log(process.env.ZENDESK_API_TOKEN)
  Amplify.configure({
    Auth: {
      identityPoolId: process.env.REACT_APP_AWS_IDENTITY_POOL_ID,
      mandatorySignId: true,
      region: process.env.REACT_APP_AWS_REGION,
      userPoolId: process.env.REACT_APP_AWS_USER_POOL_ID,
      userPoolWebClientId: process.env.REACT_APP_AWS_USER_POOL_WEB_CLIENT_ID,
      oauth: {
        domain: process.env.REACT_APP_AWS_COGNITO_DOMAIN,
        redirectSignIn:
          process.env.REACT_APP_REDIRECT_URL || 'http://localhost:3000/',
        redirectSignOut:
          `${process.env.REACT_APP_REDIRECT_URL}/logout` ||
          'http://localhost:3000/',
        responseType: 'code',
      },
    },
    Storage: {
      bucket: 'tourneymaster',
      region: process.env.REACT_APP_AWS_REGION,
      identityPoolId: process.env.REACT_APP_AWS_IDENTITY_POOL_ID,
    },
  });
  console.log("REACT_APP_AWS_REGION", process.env.REACT_APP_AWS_REGION, process.env.ZENDESK_API_TOKEN)
};
