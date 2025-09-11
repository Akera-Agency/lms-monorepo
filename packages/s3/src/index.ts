import fs from 'fs';
import path from 'path';
import S3rver from 's3rver';

const port = 9000;
const address = '0.0.0.0';

// Get the directory of the current file and resolve paths relative to package root
const currentDir = path.join(process.cwd(), 'packages/s3');
const corsConfigPath = path.join(currentDir, 'cors.xml');

const s3 = new S3rver({
  port,
  address,
  directory: currentDir,
  configureBuckets: [
    {
      name: 'storage',
      configs: [fs.readFileSync(corsConfigPath)],
    },
  ],
});

console.log(`The server is running on ${address}:${port}`);

s3.run();
