import config, { MAX_FILE_SIZE } from '../../config';
import { PROD } from '../../constants/node-evns';
import { fastify, FastifyInstance } from 'fastify';
import logger from '../../modules/logger';
import qs from 'qs';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import formBodyParser from '@fastify/formbody';
import staticDeliver from '@fastify/static';
import errorHandler from './http.error-handler';
import validatorCompiler from './http.validator-compiler';
import usersRouter from '../../components/users/transport/http/v1/users.router';
import organizationsRouter from '../../components/organizations/transport/http/v1/organizations.router';
import organizationsMembersRouter from '../../components/organizations-members/transport/http/v1/organizations-members.router';
import screensRouter from '../../components/screens/transport/http/v1/screens.router';
import mediasRouter from '../../components/medias/transport/http/v1/medias.router';
import playlistsRouter from '../../components/playlists/transport/http/v1/playlists.router';
import schedulesRouter from '../../components/schedules/transport/http/v1/schedules.router';


const server = fastify({
  logger: false,
  disableRequestLogging: config.NODE_ENV === PROD,
  querystringParser: (str) => qs.parse(str, { depth: 10 }),
});

async function initHttpGateway(): Promise<FastifyInstance> {
  try {
    server.register(cors, { origin: true });
    server.register(multipart, { limits: { fileSize: MAX_FILE_SIZE } });
    server.register(formBodyParser);
    server.register(staticDeliver, { root: config.STATIC_FOLDER_PATH, prefix: '/v1/static' });

    server.setErrorHandler(errorHandler);
    server.setValidatorCompiler(validatorCompiler);

    server.decorateRequest('user', null);

    server.register(usersRouter, { prefix: 'v1/' });
    server.register(organizationsRouter, { prefix: 'v1/' });
    server.register(organizationsMembersRouter, { prefix: 'v1/' });
    server.register(screensRouter, { prefix: 'v1/' });
    server.register(mediasRouter, { prefix: 'v1/' });
    server.register(playlistsRouter, { prefix: 'v1/' });
    server.register(schedulesRouter, { prefix: 'v1/' });

    await server.listen({ host: config.HOST, port: config.HTTP_PORT });
    logger.info(`[HTTP GATEWAY] started on ${config.HOST}:${config.HTTP_PORT}`);

    return server;
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

export default initHttpGateway;
