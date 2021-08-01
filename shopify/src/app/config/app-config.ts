
import { environment } from "src/environments/environment";

export default {
  oidc: {
    clientId: `${environment.CLIENT_ID}`,
    issuer: `${environment.ISSUER}`,
    redirectUri: '/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    features : {
      registration:true
    },
    testing: {
      disableHttpsCheck: true
    }
  }
};
