import { APIGatewayProxyHandler } from "aws-lambda";
import document from "../utils/dynamoDBClient"
import { v4 as uuidV4 } from "uuid"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"

interface IRequest {
  title: string, 
  deadline: string 
}

dayjs.apply(utc)

export const handle: APIGatewayProxyHandler = async (event) => {

  const { userid } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as IRequest;

  const dateNow = dayjs().utc()
  const compareDate = dateNow.isAfter(dayjs(deadline).utc())

  if(compareDate) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Deadline is tooo late..."
      })
    }
  }

  await document.put({
    TableName: "todoTable",
    Item: {
      id: uuidV4(),
      user_id: userid,
      title,
      done: false,
      deadline
    }
  }).promise()

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "TODO created!"
    })
  }
}