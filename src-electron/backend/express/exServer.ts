import { errorMiddleware } from '@be/common/httpException';
import { prismaErrorMiddleware } from '@be/common/prismaException';
import cors, { CorsOptions } from 'cors';
import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

export class ExServer {
    public app: any;
    public port: number;

    constructor(controllers: any, port: number) {
        this.app = express();
        this.port = port;

        this.initializeUtilMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorMiddleware();
    }

    private initializeErrorMiddleware() {
        //#region Error Handler
        this.app.use(prismaErrorMiddleware);
        this.app.use(errorMiddleware);
        //#endregion
    }

    private initializeUtilMiddlewares() {
        // //#region Enabled CORS
        const corsOptions: CorsOptions = {
            origin: 'http://localhost:8000',
            optionsSuccessStatus: 200,
            credentials: true
        };
        this.app.use(cors(corsOptions));
        //#endregion

        //#region Enabled Swagger
        const options = {
            definition: {
                openapi: '3.0.0',
                info: {
                    title: 'default',
                    version: '1.0.0'
                }
            },
            apis: ['src-electron/backend/swagger/*.ts']
        };
        const swaggerSpec = swaggerJsdoc(options);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        //#endregion

        //#region Enabled JSON
        this.app.use(express.json());
        //#endregion
    }
    private initializeControllers(controllers: any) {
        controllers.forEach((controller: any) => {
            this.app.use('/', controller.router);
        });
    }

    public listen(): any {
        return this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }

    public close() {
        this.app.close((err: any) => {
            console.log('server closed');
            process.exit(err ? 1 : 0);
        });
    }
}
