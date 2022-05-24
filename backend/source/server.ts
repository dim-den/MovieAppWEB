import express, { Request, Response } from 'express';
import { createConnection } from "typeorm";
import { router } from './routes/indexRoute';
import { DbConfig } from './config/dbConfig';
import { handleErrorMiddleware, handleWrongRoute } from './middleware/errorHandling';
import { httpsConfig } from './config/httpsConfig';
var http = require('http');
var https = require('https');

class Server {
  private app: express.Application;

  constructor() {
    this.app = express();

    this.configuration();
    this.dbconnection();
    this.routes();
  }

  public configuration() {
    this.app.set('port', process.env.PORT || 3001);
    this.app.set('https-port', process.env.HTTPS_PORT || 3003);
    this.app.use(express.json());
  }

  public async dbconnection() {
    await createConnection(DbConfig);
  }

  public async routes() {
    // handle rest api
    this.app.use(`/api/`, router);

    // handle errors
    this.app.use(handleErrorMiddleware);

    // handle wrong routes
    router.use(handleWrongRoute);
  }

  public start() {
    var httpServer = http.createServer(this.app);
    var httpsServer = https.createServer(httpsConfig, this.app);

    httpServer.listen(this.app.get('port'));
    httpsServer.listen(this.app.get('https-port'));

    // this.app.listen(this.app.get('port'), () => {
    //   console.log(`Server is listening ${this.app.get('port')} port.`);
    // });
  }
}

const server = new Server(); // Create server instance
server.start(); // Execute the server