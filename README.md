# DataVizArtisan Library

*dvalib* is an open-source data visualization library written entirely
in TypeScript, that utilizes HTML5 Canvas features. This library was
written mainly to provide an easy way to create custom visuals for
Power BI. However, it can be used for other applications as well.

## Why use *dvalib*?
There are many reasons, but just to focus on the main ones:
- It is extremely easy to learn
- Projects created with the *dvalib* library follow OPP principles.
  Thus the majority of your code can be easily reused.
- You can achieve complex, dynamic visualizations with truly limited effort.

## Quick start

To start a new visualization project, follow the steps below:

1. Create a new folder.
2. Inside the newly created folder initiate the npm package:
   ```shell
   npm init
   ```
   Make sure you have `Node.js` installed on your machine.
   
3. Install development dependencies:
   ```shell
   npm i webpack webpack-cli webpack-dev-server typescript ts-loader --save-dev
   ```
4. Create webpack.config.js file with the following content
   ```javascript
   const path = require('path');

   module.exports = {
       mode: 'production',
       entry: './src/main.ts',
       module: {
           rules: [
               {
                   test: /\.ts/,
                   use: 'ts-loader',
                   include: path.resolve(__dirname, 'src')
               }
           ]
       },
       output: {
           filename: 'bundle.js',
           path: path.resolve(__dirname, 'dist')
       },
       resolve: {
           extensions: ['.ts', '.js']
       },
       devServer: {
           static: {
               directory: path.join(__dirname, 'dist'),
           },
           compress: true,
           port: 8080
       }
   }
   ```   
5. Install `*dvalib*`
   ```shell
   npm i *dvalib*
   ```
6. Add `"start": "webpack-dev-server"` and `"build": "webpack"` to `scripts` in your `package.json` file.
7. Create a `dist` folder with the `index.html` file and `src` folder for your code.
   ```html
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <title>*dvalib*</title>
   </head>
   <body>
       <div id="canvas-container">
           <canvas id="my-canvas"></canvas>
       </div>
       <script src="bundle.js"></script>
   </body>
   </html>
   ```

**You are ready to code. Enjoy!**
