import 'dotenv/config';
import '@/index';
import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import TransactionRoute from '@routes/transaction.route';
import UsersRoute from '@routes/users.route';
import EventsRoute from '@routes/events.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new EventsRoute(), new TransactionRoute()]);

app.listen();
