import { Test, TestingModule } from '@nestjs/testing';
import { CanActivate } from '@nestjs/common';
import { Public } from '../auth/auth.module';
import { Types } from 'mongoose';
import { LogController } from './log.controller'
import { LogService } from './log.service'
import { Log } from '@roots/data';
import { LogDTO } from './log.dto';

describe('Log controller - Integration tests', () => {
    let app: TestingModule;
    let logController: LogController;
    let logService: LogService;
    const fakeGuard: CanActivate = { canActivate: () => true };

    const exampleLogs: Log[] = [{
        editor:'Log1',
        action:'Test1',
        object:'test1',
        logStamp:new Date() 
    },
    {
        editor:'Log2',
        action:'Test2',
        object:'test2',
        logStamp:new Date() 
    },
];

    beforeAll(async () => {
        app = await Test.createTestingModule({
            controllers: [LogController],
            providers: [{
                provide: LogService,
                useValue: {
                    getAll: jest.fn(),
                    create: jest.fn(),
               
                },
            }],
        })
        .overrideGuard(Public).useValue(fakeGuard)
        .compile();

        logController = app.get<LogController>(LogController);
        logService = app.get<LogService>(LogService);
    });

    it('schould call getAll on service', async () => {
       
            
            const organizationId = new Types.ObjectId()

            const getLogs = jest.spyOn(logService, 'getAll')
            .mockImplementation(async () => exampleLogs);

            const results = await logController.getAll(organizationId.toString());

            expect(getLogs).toBeCalledTimes(1);
            expect(results).toHaveLength(2);

            expect(results[0]).toHaveProperty('editor', exampleLogs[0].editor);
            expect(results[0]).toHaveProperty('action', exampleLogs[0].action);
            expect(results[0]).toHaveProperty('object', exampleLogs[0].object);
            expect(results[0]).toHaveProperty('logStamp', exampleLogs[0].logStamp);
            expect(results[1]).toHaveProperty('editor', exampleLogs[1].editor);
            expect(results[1]).toHaveProperty('action', exampleLogs[1].action);
            expect(results[1]).toHaveProperty('object', exampleLogs[1].object);
            expect(results[1]).toHaveProperty('logStamp', exampleLogs[1].logStamp);
    });
    it('schould call create on service', async () => {
        const log:LogDTO = {
            editor: 'Log3',
            action: 'Test3',
            object:'Test3',
            logStamp: new Date()
        }
            
            const organizationId = new Types.ObjectId()

            const createLog = jest.spyOn(logService, 'create')
            .mockImplementation(async () => log);

            const results = await logController.createLog(organizationId.toString(), log);

            expect(createLog).toBeCalledTimes(1);

            expect(results).toHaveProperty('editor', log.editor);
            expect(results).toHaveProperty('action', log.action);
            expect(results).toHaveProperty('object', log.object);
            expect(results).toHaveProperty('logStamp', log.logStamp);
          
    });

  
});