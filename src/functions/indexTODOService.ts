import { APIGatewayProxyHandler } from "aws-lambda";
import document from "../utils/dynamoDBClient"

export const handle: APIGatewayProxyHandler = async (event) => {

  const { userid } = event.pathParameters;

  const response = await document.query({
    TableName: "todoTable",
    IndexName: "userIndex",
    KeyConditionExpression: "user_id = :user_id",
    ExpressionAttributeValues: {
      ":user_id": userid
    }
  }).promise()
  
  const todos = response.Items

  return {
    statusCode: 200,
    body: JSON.stringify(todos)
  }
}