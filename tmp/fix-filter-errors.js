const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/app/compensation/salary-calculation/salary-calculation-content.tsx',
];

filesToFix.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // 修复 .filter((item: any) => item => ... 模式为 .filter((item: any) => ...
  content = content.replace(/\.filter\(\(item: any\) => (\w) =>/g, '.filter(($1: any) =>');
  
  // 修复 .filter((item: any) => ([a-zA-Z]) => ... 模式
  content = content.replace(/\.filter\(\(item: any\) => ([a-zA-Z]) =>/g, '.filter(($1: any) =>');
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed: ${filePath}`);
});

console.log('Done!');
