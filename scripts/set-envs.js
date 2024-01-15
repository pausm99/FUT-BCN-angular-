const { writeFileSync, mkdirSync} = require('fs');
require('dotenv').config();

const targetPath = './src/environments/environment.ts';

const envFileContent = `
  export const environment = {
    api_url: "${process.env.API_URL}"
  }
`;

mkdirSync('./src/environments', { recursive: true });

writeFileSync(targetPath, envFileContent);
