import * as controller from '@be/controller';
import { ExServer } from '@be/express/exServer';
import { Server } from 'http';

export function startServer(): Server {
    const server: ExServer = new ExServer(
        [
            new controller.VariableController(),
            new controller.RuleController(),
            new controller.RulesetController(),
            new controller.PolicyController(),
            new controller.ModuleController(),
            new controller.ModuleValueController()
        ],
        9000
    );

    return server.listen();
}
