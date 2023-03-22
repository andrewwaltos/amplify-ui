import { exec } from 'child_process';
import { getArgs } from './utils/getArgs';

type Args = {
  react?: string | 18;
  npm?: string | true;
  js?: string | true;
};
const args = getArgs() as Args;

if (args.js && !['true', 'false', true].includes(args.js)) {
  console.log(args.js);
  console.log('js must be "true" or "false".');
}

if (args.npm && !['true', 'false', true].includes(args.npm)) {
  console.log('npm must be "true" or "false".');
}

exec(
  `cp ./environments/src/aws-exports.js ./templates/cra-template-react-js/template/src/aws-exports.js`,
  (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if (error !== null) {
      console.log(`exec error: ${error}`);
    }
  }
);

exec(
  `npx create-react-app react-${args.react ?? '18'}-cra-5-js${
    args.npm ? ' --use-npm' : ''
  } --template file:./templates/cra-template-react-${args.js ? 'js' : 'ts'}`,
  (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if (error !== null) {
      console.log(`exec error: ${error}`);
    }
  }
);