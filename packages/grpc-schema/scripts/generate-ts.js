/**
 * TypeScript コード生成スクリプト
 * 
 * Protocol BuffersからTypeScriptのコードを自動生成します。
 * @bufbuild/protoc-gen-es を使用します。
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const PROTO_DIR = path.join(__dirname, '..', 'proto');
const OUT_DIR = path.join(__dirname, '..', 'generated', 'ts');

// 出力ディレクトリを作成
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

console.log('🔨 Generating TypeScript code from Protocol Buffers...');
console.log(`   Proto dir: ${PROTO_DIR}`);
console.log(`   Output dir: ${OUT_DIR}`);

try {
  // protoc コマンドを実行
  // 注意: 実際の環境ではprotocコンパイラのインストールが必要です
  const command = `protoc \
    --plugin=protoc-gen-es=./node_modules/.bin/protoc-gen-es \
    --es_out=${OUT_DIR} \
    --es_opt=target=ts \
    --proto_path=${PROTO_DIR} \
    ${PROTO_DIR}/*.proto`;

  execSync(command, { stdio: 'inherit' });
  
  console.log('✅ TypeScript code generation completed!');
} catch (error) {
  console.error('❌ Failed to generate TypeScript code:', error.message);
  console.log('\n📝 Note: This requires protoc compiler to be installed.');
  console.log('   Please install from: https://grpc.io/docs/protoc-installation/');
  process.exit(1);
}
