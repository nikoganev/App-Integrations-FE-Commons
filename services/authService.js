import {
  getUserSession
} from '../sagas/apiCalls';

export const openAuthorizationPopupWindow = (url) => {
  const popup = window.open(url, url, 'toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=800,height=600');
  setTimeout(() => {
    if(!popup || popup.outerHeight === 0) {
      alert("Popup Blocker is enabled! Please add this site to your exception list and try again.");
    }
  }, 25);
};

export const getUserJWT = () => {
  return Promise.resolve('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJpc3MiOiJTeW1waG9ueSBDb21tdW5pY2F0aW9uIFNlcnZpY2VzIExMQy4iLCJzdWIiOjEwNjUxNTE4ODk4MzUzLCJhdWQiOiJkZXZKaXJhV2ViSG9va0ludGVncmF0aW9uIiwidXNlciI6eyJpZCI6MTA2NTE1MTg4OTgzNTMsImVtYWlsQWRkcmVzcyI6InJzYW5jaGV6QHN5bXBob255LmNvbSIsImZpcnN0TmFtZSI6IlJvYnNvbiIsImxhc3ROYW1lIjoiU2FuY2hleiIsImRpc3BsYXlOYW1lIjoiUm9ic29uIFNhbmNoZXoiLCJjb21wYW55IjoicG9kMTU1IiwiY29tcGFueUlkIjoxNTUsInVzZXJuYW1lIjoicnNhbmNoZXoiLCJhdmF0YXJVcmwiOiJodHRwczovL3MzLmFtYXpvbmF3cy5jb20vdXNlci1waWNzLWRlbW8vc21hbGwvc3ltcGhvbnlfc21hbGwucG5nIiwiYXZhdGFyU21hbGxVcmwiOiJodHRwczovL3MzLmFtYXpvbmF3cy5jb20vdXNlci1waWNzLWRlbW8vY3JlZXB5L3N5bXBob255X2NyZWVweS5wbmcifSwiZXhwIjoxNTA0ODg1ODc2fQ.LNLreEPE1srtmIagiAXj_0IzmJ9dpocgxlhNjpTuRYD8u2QPKeBMFmT0zD60B-bvilQAc2nZr41EeObwIK1W2wEQrQInlk0PeUZyvRNwGaZIclzvbcqgFxL-ns51g13xBmpsPiFbd4g8170I8Q5gYkzLkoIDUGI3CJiqzdq9Dzs2_FiJPufkUZX-3lZlll5j-djSSp5h0KXQBjBVNhaUBz9v51i9TDML1U3L3S3VJHRMUMWk-7GV2IK5rWq7nWKtKApx740WJpA6cbUF_fjvWsNaUhMfccKThwv4vsKlwaCjAjmJOq-96g02gDYG5RL2h02up1MRk3eO9SRJrB61RQ');
};

export const authorizeUser = (integrationUrl) => {
  getUserJWT()
  .then((jwt) => {
    getUserSession(integrationUrl, jwt)
    .then((userSession) => {
      return Promise.resolve(true);
    })
    .catch((err) => {
      if (err.response.status == 401) {
        const userSession = err.response;
        if (userSession.data.properties != null && userSession.data.properties.authorizationUrl != null) {
          const authorizationUrl = userSession.data.properties.authorizationUrl;
          openAuthorizationPopupWindow(authorizationUrl);
          return Promise.resolve(false);
        }
      } else {
        throw err;
      }      
    });
  });
};
