# 目次

<!-- TOC -->

- [目次](#目次)
- [参考記事](#参考記事)
- [作業について](#作業について)
  - [基本方針](#基本方針)
  - [注意点](#注意点)
- [サンプルコード](#サンプルコード)
  - [aws-sdk v2 の場合（Node.js）](#aws-sdk-v2-の場合nodejs)

<!-- /TOC -->

# 参考記事

- [初めてのサーバーレスアプリケーション開発 ～ API Gateway から Lambda を呼び出す～](https://dev.classmethod.jp/articles/serverless-first-apigateway/)
- [aws-sdk v3 公式](https://docs.aws.amazon.com/ja_jp/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html#dynamodb-example-table-read-write-getting-an-item)

# 作業について

## 基本方針

- [初めてのサーバーレスアプリケーション開発 ～ API Gateway から Lambda を呼び出す～](https://dev.classmethod.jp/articles/serverless-first-apigateway/)を参考に進めれば基本 OK

## 注意点

- permission 周りでエラーが出たら、AmazonDynamoDBReadOnlyAccess など適切な権限を付与する
- aws-sdk v3 を使う場合は require ではなく import 文を使う必要あり

# サンプルコード

## aws-sdk v2 の場合（Node.js）

```js
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
```
