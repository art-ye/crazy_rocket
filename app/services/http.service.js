const { getChatHistory } = require('../controllers/chat.controller');
const { login } = require('../controllers/auth.controller');

const registerRoutes = (app) => {
  app.get('/api/messages', async (res, req) => {
    res.onAborted(() => {
      res.aborted = true;
    });
    await getChatHistory(res, req);
  });

  app.post('/api/login', async (res, req) => {
    res.onAborted(() => {
      res.aborted = true;
    });
    await login(res, req);
  });
};

module.exports = app => registerRoutes(app);
