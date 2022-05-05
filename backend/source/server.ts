import express, {Request, Response} from 'express';
import { createConnection } from "typeorm";
import { router } from './routes/indexRoute';
import { db_config } from './db/config';



class Server {
  private app: express.Application;

  constructor(){
    this.app = express(); // init the application
    this.configuration();
    this.dbconnection();
    this.routes();
  }

  /**
   * Method to configure the server,
   * If we didn't configure the port into the environment 
   * variables it takes the default port 3000
   */
  public configuration() {
    this.app.set('port', process.env.PORT || 3001);
    this.app.use(express.json());
  }

  public async dbconnection() {
    await createConnection(db_config);
  }

  /**
   * Method to configure the routes
   */
  public async routes(){
    this.app.use(`/api/`, router); // Configure the new routes of the controller post
  }

  /**
   * Used to start the server
   */
  public start(){
    this.app.listen(this.app.get('port'), () => {
      console.log(`Server is listening ${this.app.get('port')} port.`);
    });
  }
}

const server = new Server(); // Create server instance
server.start(); // Execute the server