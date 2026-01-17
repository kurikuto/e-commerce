/**
 * Kotlin コード生成スクリプト
 * 
 * Protocol BuffersからKotlinのコードを自動生成します。
 * protoc-gen-kotlin を使用します。
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const PROTO_DIR = path.join(__dirname, '..', 'proto');
const OUT_DIR = path.join(__dirname, '..', 'generated', 'kotlin');

// 出力ディレクトリを作成
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

console.log('🔨 Generating Kotlin code from Protocol Buffers...');
console.log(`   Proto dir: ${PROTO_DIR}`);
console.log(`   Output dir: ${OUT_DIR}`);

try {
  // protoc コマンドを実行（Kotlin生成）
  const command = `protoc \
    --kotlin_out=${OUT_DIR} \
    --grpc-kotlin_out=${OUT_DIR} \
    --proto_path=${PROTO_DIR} \
    ${PROTO_DIR}/*.proto`;

  execSync(command, { stdio: 'inherit' });
  
  console.log('✅ Kotlin code generation completed!');
} catch (error) {
  console.error('❌ Failed to generate Kotlin code:', error.message);
  console.log('\n📝 Note: This requires protoc and grpc-kotlin plugin to be installed.');
  console.log('   See: https://grpc.io/docs/languages/kotlin/quickstart/');
  process.exit(1);
}
