import { APIGatewayProxyEvent } from "aws-lambda";
import * as R from "ramda";

export default (event: APIGatewayProxyEvent, props: string[]) => ({
  ...R.pick(props, event),
  ...(event.body && JSON.parse(event.body)
    ? R.pick(props, JSON.parse(event.body))
    : {}),
  ...(event.queryStringParameters
    ? R.pick(props, event.queryStringParameters)
    : {})
});
