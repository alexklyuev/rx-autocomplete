import * as express from 'express';
import * as path from 'path';
import * as http from 'http';
import * as debug from 'debug';


const app = express();
app.use(express.static(path.join(__dirname, './public')));
const port = 4002;
app.set('port', port);
const server = http.createServer(app);
server.listen(port);

const router = express.Router();

router.get('/contacts', (req, res) => {
  setTimeout(() => {
    res.json({success: 1});
  }, 5000);
});

app.use(router);
