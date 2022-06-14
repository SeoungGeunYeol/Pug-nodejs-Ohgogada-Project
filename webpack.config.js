const path = require("path");

/*
 entry : 처리하고자 하는 파일의 경로
 output : 결과물
 path.resolve() 
 메서드는 경로 세그먼트 시퀀스를 절대 경로로 해석하는 데 사용됩니다. 
 경로 세그먼트가 전달되지 않으면 path.resolve()는
 현재 작업 디렉토리의 절대 경로를 반환합니다.
 (__dirname: 현재 파일 위치의 절대 경로)
 /\.js$/ = RegExp 정규표션식
*/
module.exports = {
  entry: "./src/client/js/main.js",
  mode: "development",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "assets", "js"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
};
/*
1. webpack의 rules 내부의 'test: /\.scss$/,' 
   코드에서 모든 scss파일들을 긁어온다

2. ' use: ["style-loader", "css-loader", "sass-loader"],' 코드에서 
    sass-loader -> css-loader -> style-loader 순으로 
    loader가 적용되어 긁어온 scss 파일들을 변환시킨다

2.1 sass-loader가 scss확장자 파일을 브라우저가 이해할 수 있는
    css 파일로 변환시킨다

2.2 css-loader가 @import, url()등의 최신형 css 코드를 
    브라우저가 이해할 수 있는 코드로 변환시켜 동작할 수 있도록 한다
2.3 style-loader가 위 과정으로 변환시킨 css 코드를 
    DOM 내부에 적용시켜준다

4. 변환된 코드가 output에서 설정된 파일 경로에 설정된
   파일명으로 저장된다

5. 저장된 변환 js 코드를 pug 파일에 적용시키기 위해
   'script(src="/static/js/main.js")' 코드를 통해 긁어와 적용시킨다
*/
