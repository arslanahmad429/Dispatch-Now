import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const runCmd = (cmd) => {
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
    // If git commit fails because there are no changes, just continue
    if (cmd.includes('git commit')) {
      console.log('No changes to commit, proceeding...');
      return;
    }
    console.error(`\n[ERROR] Failed to run: ${cmd}`);
    process.exit(1);
  }
};

console.log('==============================================');
console.log('        IDE GITHUB AUTO-SYNC WIZARD');
console.log('==============================================\n');

rl.question('Enter commit message (press Enter for "Auto-update"): ', (message) => {
  const dateStr = new Date().toLocaleString();
  const commitMsg = message.trim() || `Auto-update: ${dateStr}`;
  
  console.log('\nStaging changes...');
  runCmd('git add .');
  
  console.log('\nCommitting changes...');
  runCmd(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);
  
  console.log('\nPulling latest remote changes...');
  runCmd('git pull origin main --rebase');
  
  console.log('\nPushing changes to GitHub...');
  runCmd('git push origin main');
  
  console.log('\n==============================================');
  console.log('  [SUCCESS] Code is synced with GitHub!');
  console.log('==============================================');
  
  rl.close();
});
