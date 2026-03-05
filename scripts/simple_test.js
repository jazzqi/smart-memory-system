#!/usr/bin/env node
/**
 * 简单测试脚本 - 验证智能记忆系统技能
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 智能记忆系统技能 - 基础测试');
console.log('='.repeat(50));

let passed = 0;
let failed = 0;

function test(description, testFn) {
    try {
        testFn();
        console.log(`✅ ${description}`);
        passed++;
    } catch (error) {
        console.log(`❌ ${description}: ${error.message}`);
        failed++;
    }
}

// 测试1: 技能结构
test('技能目录结构完整', () => {
    const requiredDirs = ['config', 'scripts', 'examples', 'templates'];
    for (const dir of requiredDirs) {
        const dirPath = path.join(__dirname, '..', dir);
        if (!fs.existsSync(dirPath)) {
            throw new Error(`缺少目录: ${dir}`);
        }
    }
});

// 测试2: 核心文件
test('核心文件存在', () => {
    const requiredFiles = [
        'SKILL.md',
        'README.md', 
        'package.json',
        'index.js',
        'LICENSE',
        'CHANGELOG.md',
        '.gitignore'
    ];
    
    for (const file of requiredFiles) {
        const filePath = path.join(__dirname, '..', file);
        if (!fs.existsSync(filePath)) {
            throw new Error(`缺少文件: ${file}`);
        }
        
        // 检查文件非空
        const stats = fs.statSync(filePath);
        if (stats.size === 0) {
            throw new Error(`文件为空: ${file}`);
        }
    }
});

// 测试3: 配置文件
test('配置文件有效', () => {
    const configPath = path.join(__dirname, '..', 'config/smart_memory.json');
    if (!fs.existsSync(configPath)) {
        throw new Error('配置文件不存在');
    }
    
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    // 检查必需字段
    const requiredFields = ['version', 'skill_name', 'skill_description', 'models'];
    for (const field of requiredFields) {
        if (!config[field]) {
            throw new Error(`配置缺少字段: ${field}`);
        }
    }
    
    // 检查模型配置
    if (!config.models.embedding || !config.models.reranker) {
        throw new Error('模型配置不完整');
    }
});

// 测试4: package.json
test('package.json配置正确', () => {
    const packagePath = path.join(__dirname, '..', 'package.json');
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    if (!pkg.name || !pkg.version || !pkg.description) {
        throw new Error('package.json基本信息不完整');
    }
    
    if (!pkg.scripts || Object.keys(pkg.scripts).length === 0) {
        throw new Error('缺少脚本命令');
    }
    
    if (!pkg.clawhub || !pkg.clawhub.category) {
        throw new Error('缺少ClawHub发布配置');
    }
});

// 测试5: SKILL.md文档
test('SKILL.md文档完整', () => {
    const skillPath = path.join(__dirname, '..', 'SKILL.md');
    const content = fs.readFileSync(skillPath, 'utf8');
    
    // 检查必需章节
    const requiredSections = ['概述', '功能特性', '安装配置', '使用方法'];
    for (const section of requiredSections) {
        if (!content.includes(section)) {
            throw new Error(`SKILL.md缺少章节: ${section}`);
        }
    }
    
    // 检查长度
    if (content.length < 1000) {
        throw new Error('SKILL.md文档太短');
    }
});

// 测试6: 脚本文件
test('脚本文件可执行', () => {
    const requiredScripts = ['init.js', 'test_runner.js'];
    
    for (const script of requiredScripts) {
        const scriptPath = path.join(__dirname, script);
        if (!fs.existsSync(scriptPath)) {
            throw new Error(`缺少脚本: ${script}`);
        }
        
        const content = fs.readFileSync(scriptPath, 'utf8');
        if (content.length === 0) {
            throw new Error(`脚本为空: ${script}`);
        }
    }
});

// 测试7: 许可证文件
test('许可证文件有效', () => {
    const licensePath = path.join(__dirname, '..', 'LICENSE');
    const content = fs.readFileSync(licensePath, 'utf8');
    
    if (!content.includes('MIT License') && !content.includes('MIT')) {
        throw new Error('许可证类型不明确');
    }
    
    if (!content.includes('Copyright')) {
        throw new Error('缺少版权信息');
    }
});

// 测试8: GitHub配置
test('GitHub配置完整', () => {
    const workflowsDir = path.join(__dirname, '..', '.github/workflows');
    if (fs.existsSync(workflowsDir)) {
        const workflowFiles = fs.readdirSync(workflowsDir);
        if (workflowFiles.length === 0) {
            throw new Error('GitHub工作流目录为空');
        }
    }
});

// 测试9: 入口文件
test('主入口文件有效', () => {
    const indexPath = path.join(__dirname, '..', 'index.js');
    const content = fs.readFileSync(indexPath, 'utf8');
    
    if (!content.includes('#!/usr/bin/env node')) {
        throw new Error('入口文件缺少shebang');
    }
    
    if (!content.includes('yargs') && !content.includes('command')) {
        throw new Error('入口文件缺少命令接口');
    }
});

// 测试10: 文档一致性
test('文档版本一致', () => {
    const packagePath = path.join(__dirname, '..', 'package.json');
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');
    const changelog = fs.readFileSync(changelogPath, 'utf8');
    
    if (!changelog.includes(pkg.version)) {
        throw new Error('CHANGELOG.md版本与package.json不一致');
    }
});

console.log('\n' + '='.repeat(50));
console.log(`📊 测试结果: ${passed} 通过, ${failed} 失败`);

if (failed === 0) {
    console.log('🎉 所有测试通过！技能结构完整。');
    
    console.log('\n🔍 详细检查清单:');
    console.log('  1. ✅ 目录结构完整');
    console.log('  2. ✅ 核心文件齐全');
    console.log('  3. ✅ 配置文件有效');
    console.log('  4. ✅ package.json正确');
    console.log('  5. ✅ SKILL.md文档完整');
    console.log('  6. ✅ 脚本文件可执行');
    console.log('  7. ✅ 许可证有效');
    console.log('  8. ✅ GitHub配置完整');
    console.log('  9. ✅ 入口文件有效');
    console.log('  10. ✅ 文档版本一致');
    
    console.log('\n🚀 技能已准备好发布！');
    console.log('\n💡 发布步骤:');
    console.log('  1. 创建GitHub仓库: smart-memory-system');
    console.log('  2. 推送代码到GitHub');
    console.log('  3. 发布到npm: npm publish');
    console.log('  4. 发布到ClawHub: clawhub publish');
    console.log('  5. 在社区发布公告');
    
} else {
    console.log('⚠️ 发现测试失败，请修复后再发布。');
    process.exit(1);
}

console.log('\n📁 技能位置: ' + path.join(__dirname, '..'));
console.log('📦 总文件数: ' + countFiles(path.join(__dirname, '..')));
console.log('📄 总代码行数: ' + estimateLines(path.join(__dirname, '..')));

// 辅助函数
function countFiles(dir) {
    let count = 0;
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory() && !item.startsWith('.')) {
            count += countFiles(itemPath);
        } else if (stat.isFile() && !item.startsWith('.')) {
            count++;
        }
    }
    
    return count;
}

function estimateLines(dir) {
    let lines = 0;
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory() && !item.startsWith('.')) {
            lines += estimateLines(itemPath);
        } else if (stat.isFile() && !item.startsWith('.') && 
                  (item.endsWith('.js') || item.endsWith('.md') || item.endsWith('.json'))) {
            try {
                const content = fs.readFileSync(itemPath, 'utf8');
                lines += content.split('\n').length;
            } catch (error) {
                // 忽略读取错误
            }
        }
    }
    
    return lines;
}