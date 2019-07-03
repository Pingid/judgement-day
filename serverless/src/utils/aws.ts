import * as AWS from 'aws-sdk';
import { parseJSON } from './async';

const lambda = new AWS.Lambda();

export const invokeLambda = <T, K>(data: K, name: string, devFunction: (x: K) => Promise<{ body: string }>): Promise<T> => {
  if (process.env.STAGE !== 'prod' && devFunction) return devFunction(data)
    .then((x: { body: string }): Promise<T> => parseJSON(x.body))
  return new Promise((resolve, reject) => lambda.invoke({
    FunctionName: name,
    Payload: JSON.stringify(data)
  }, (error, data) => error ? reject(error) : resolve(data)))
    .then((x: { Payload: string }): Promise<{ errorMessage?: string, body?: string }> => parseJSON(x.Payload))
    .then(x => x.errorMessage ? Promise.reject(x.errorMessage) : Promise.resolve(x))
    .then((x: { body: string }): Promise<T> => parseJSON(x.body))
}
