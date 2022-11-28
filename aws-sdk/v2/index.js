// sdk読み込み
const aws = require("aws-sdk");

// dynamoDB操作用オブジェクト
const dynamo = new aws.DynamoDB();

// 検索用オブジェクト
const docClient = new aws.DynamoDB.DocumentClient();

// 全件取得用関数
function dynamoscan() {
  return new Promise((resolve, reject) => {
    let params = {
      TableName: "demo-dynamo",
      ReturnConsumedCapacity: "NONE",
    };
    dynamo.scan(params, function (err, data) {
      if (err) {
        reject(err, err);
      } else {
        //console.log("data count:",data.Count);
        resolve(data.Items);
      }
    });
  });
}

exports.handler = async (event) => {
  // 全件取得
  // const res= await dynamoscan();

  // パラメータで検索
  const params_get = {
    TableName: "demo-dynamo",
    Key: {
      id: event.person_id,
    },
  };
  const res = await docClient.get(params_get).promise();

  // レスポンス
  const hoge = event;
  const response = {
    statusCode: 200,
    body: {
      text: "this is response body!",
      param: JSON.stringify(hoge),
      res: JSON.stringify(res),
    },
  };
  return response;
};
