import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SwnDatabase } from './database';
import { SwnMicroservices } from './microservice';
import { SwnApiGateway } from './apigateway';
import { SwnEventBus } from './eventbus';
import { SwnQueue } from './queue';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsMicroserviceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const database = new SwnDatabase(this, 'Database');    

    const microservices = new SwnMicroservices(this, 'Microservices', {
      productTable: database.productTable,
      basketTable: database.basketTable,
      orderTable: database.orderTable
    });

    const apigateway = new SwnApiGateway(this, 'ApiGateway', {
      productMicroservice: microservices.productMicroservice,
      basketMicroservice: microservices.basketMicroservice,
      orderingMicroservices: microservices.orderingMicroservice
    });
    
    const queue = new SwnQueue(this, 'Queue', {
      consumer: microservices.orderingMicroservice
    });

    const eventbus = new SwnEventBus(this, 'EventBus', {
      publisherFuntion: microservices.basketMicroservice,
      targetQueue: queue.orderQueue   
    });   

  }
}