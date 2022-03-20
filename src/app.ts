import '@/index';
import config from 'config';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { connect, set } from 'mongoose';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { dbConnection } from '@databases';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import passport from 'passport';
import GoogleAuthService from './services/google-oauth.service';
import session from 'express-session';

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;
  public GoogleAuth = new GoogleAuthService();

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = process.env.PORT || 3100;
    this.env = process.env.NODE_ENV || 'development';

    this.app.use(session({ secret: config.get('secretKey') }));

    this.app.use(passport.initialize());
    this.app.use(passport.session());

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
    this.initializePassport();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    if (this.env !== 'production') {
      set('debug', true);
    }

    connect(dbConnection.url, dbConnection.options)
      .then(() => {
        console.log('Connected to db');
      })
      .catch(err => {
        console.log(err);
      });
  }

  private initializePassport() {
    try {
      this.GoogleAuth.initializeGoogleAuth();
      this.GoogleAuth.serializeUser();
      this.GoogleAuth.deserializeUser();
    } catch (e) {
      console.log(e);
    }
  }

  private initializeMiddlewares() {
    this.app.use(morgan(config.get('log.format'), { stream }));
    this.app.use(cors());
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Api Docs',
        },
      },
      apis: ['swagger/user.api.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
