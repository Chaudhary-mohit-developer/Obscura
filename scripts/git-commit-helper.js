const { execSync } = require('child_process');

function makeCommit(message, dateStr, filesToAdd = '.') {
  console.log(`\nAdding files: ${filesToAdd}`);
  execSync(`git add ${filesToAdd}`, { stdio: 'inherit' });
  
  console.log(`Committing [${dateStr}]: ${message}`);
  execSync(`git commit -m "${message}" --date="${dateStr}"`, {
    env: {
      ...process.env,
      GIT_AUTHOR_DATE: dateStr,
      GIT_COMMITTER_DATE: dateStr
    },
    stdio: 'inherit'
  });
}

function amendCurrentCommit(message, dateStr) {
  console.log(`Amending commit to [${dateStr}]: ${message}`);
  execSync(`git commit --amend -m "${message}" --date="${dateStr}"`, {
    env: {
      ...process.env,
      GIT_AUTHOR_DATE: dateStr,
      GIT_COMMITTER_DATE: dateStr
    },
    stdio: 'inherit'
  });
}

const action = process.argv[2];
const msg = process.argv[3];
const date = process.argv[4];
const files = process.argv[5] || '.';

if (action === 'commit') {
  makeCommit(msg, date, files);
} else if (action === 'amend') {
  amendCurrentCommit(msg, date);
}
