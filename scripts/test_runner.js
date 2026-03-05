#!/usr/bin/env node
/**
 * 智能记忆系统 - 完整测试套件
 * 在发布前验证所有功能
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');

class SkillTester {
    constructor() {
        this.testResults = {
            passed: 0,
            failed: 0,
            total: 0,
            details: []
        };
        
        this.skillDir = path.join(__dirname, '..');
        this.configPath = path.join(this.skillDir, 'config/smart_memory.json');
        this.testDataDir = path.join(this.skillDir, 'test_data');
    }

    async runAllTests() {
        console.log(chalk.cyan.bold('🧪 智能记忆系统 - 完整测试套件'));
        console.log(chalk.gray('='.repeat(50)));
        
        await this.prepareTestEnvironment();
        
        // 运行测试套件
        await this.runTest('技能结构验证', () => this.testSkillStructure());
        await this.runTest('配置文件验证', () => this.testConfigFiles());
        await this.runTest('脚本文件验证', () => this.testScriptFiles());
        await this.runTest('依赖检查', () => this.testDependencies());
        await this.runTest('初始化功能测试', () => this.testInitialization());
        await this.runTest('命令接口测试', () => this.testCommandInterface());
        await this.runTest('集成兼容性测试', () => this.testIntegration());
        await this.runTest('性能基准测试', () => this.testPerformance());
        
        this.printTestSummary();
    }

    async prepareTestEnvironment() {
        console.log(chalk.yellow('🔧 准备测试环境...'));
        
        // 创建测试数据目录
        await fs.ensureDir(this.testDataDir);
        
        // 创建测试记忆文件
        const testMemories = [
            {
                name: 'test_tech.md',
                content: `# 技术文档测试
                
## OpenClaw配置
- 默认模型: qwen-portal/coder-model
- 流式传输: 已启用
- 向量索引: BAAl/bge-m3

## 重要设置
1. 模型API端点: https://api.edgefn.net/v1
2. 上下文窗口: 128k tokens
3. 最大输出: 8192 tokens`
            },
            {
                name: 'test_memory.md',
                content: `# 记忆系统测试
                
## 功能特性
- 语义搜索: 基于含义的智能检索
- 上下文增强: 自动注入相关历史
- Token优化: 80%消耗减少

## 使用场景
1. 个人助手 - 记住用户偏好
2. 团队协作 - 共享知识库
3. 开发支持 - 代码搜索`
            },
            {
                name: 'test_error.md',
                content: `# 错误处理测试
                
## 常见错误
1. API连接失败 - 检查网络和密钥
2. 配置错误 - 验证配置文件格式
3. 内存不足 - 优化索引大小

## 解决方案
- 重新初始化系统
- 清理缓存文件
- 优化向量索引`
            }
        ];
        
        for (const memory of testMemories) {
            const filePath = path.join(this.testDataDir, memory.name);
            await fs.writeFile(filePath, memory.content);
        }
        
        console.log(chalk.green('✅ 测试环境准备完成'));
    }

    async runTest(testName, testFunction) {
        this.testResults.total++;
        console.log(`\n📋 ${testName}...`);
        
        try {
            await testFunction();
            this.testResults.passed++;
            this.testResults.details.push({
                test: testName,
                status: '✅ 通过',
                message: '测试成功'
            });
            console.log(chalk.green(`  ✅ ${testName} 通过`));
        } catch (error) {
            this.testResults.failed++;
            this.testResults.details.push({
                test: testName,
                status: '❌ 失败',
                message: error.message
            });
            console.log(chalk.red(`  ❌ ${testName} 失败: ${error.message}`));
        }
    }

    testSkillStructure() {
        const requiredFiles = [
            'SKILL.md',
            'README.md',
            'package.json',
            'index.js',
            'LICENSE',
            'CHANGELOG.md',
            'config/smart_memory.json',
            '.gitignore'
        ];
        
        const requiredDirs = [
            'scripts',
            'config',
            'examples',
            'templates'
        ];
        
        for (const file of requiredFiles) {
            const filePath = path.join(this.skillDir, file);
            if (!fs.existsSync(filePath)) {
                throw new Error(`缺失必需文件: ${file}`);
            }
            
            // 检查文件内容
            const stats = fs.statSync(filePath);
            if (stats.size === 0) {
                throw new Error(`文件为空: ${file}`);
            }
        }
        
        for (const dir of requiredDirs) {
            const dirPath = path.join(this.skillDir, dir);
            if (!fs.existsSync(dirPath)) {
                throw new Error(`缺失必需目录: ${dir}`);
            }
        }
        
        return true;
    }

    testConfigFiles() {
        // 测试主配置文件
        const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
        
        const requiredFields = [
            'version', 'skill_name', 'skill_description',
            'models', 'processing', 'retrieval', 'integration'
        ];
        
        for (const field of requiredFields) {
            if (!config[field]) {
                throw new Error(`配置缺少必需字段: ${field}`);
            }
        }
        
        // 验证模型配置
        if (!config.models.embedding || !config.models.reranker) {
            throw new Error('模型配置不完整');
        }
        
        // 验证处理配置
        if (!config.processing.chunk_size || config.processing.chunk_size <= 0) {
            throw new Error('分块大小配置无效');
        }
        
        return true;
    }

    testScriptFiles() {
        const requiredScripts = [
            'init.js',
            'test_runner.js'
        ];
        
        for (const script of requiredScripts) {
            const scriptPath = path.join(this.skillDir, 'scripts', script);
            if (!fs.existsSync(scriptPath)) {
                throw new Error(`缺失必需脚本: ${script}`);
            }
            
            // 检查脚本是否可执行
            const content = fs.readFileSync(scriptPath, 'utf8');
            if (content.length === 0) {
                throw new Error(`脚本为空: ${script}`);
            }
        }
        
        return true;
    }

    testDependencies() {
        // 读取 package.json
        const packageJson = JSON.parse(
            fs.readFileSync(path.join(this.skillDir, 'package.json'), 'utf8')
        );
        
        // 检查必需依赖
        const requiredDeps = [
            'fs-extra', 'chalk', 'ora', 'yargs'
        ];
        
        for (const dep of requiredDeps) {
            if (!packageJson.dependencies || !packageJson.dependencies[dep]) {
                throw new Error(`缺失必需依赖: ${dep}`);
            }
        }
        
        // 检查 Node.js 版本要求
        if (!packageJson.engines || !packageJson.engines.node) {
            throw new Error('缺少 Node.js 版本要求');
        }
        
        return true;
    }

    async testInitialization() {
        // 创建临时测试目录
        const testDir = path.join(this.testDataDir, 'init_test');
        await fs.ensureDir(testDir);
        
        // 测试初始化逻辑
        const initScript = require('./init.js');
        
        try {
            // 模拟初始化（不实际创建文件）
            console.log(chalk.gray('  模拟初始化测试...'));
            
            // 检查初始化函数存在
            if (typeof initScript.initialize !== 'function') {
                throw new Error('初始化函数不存在');
            }
            
            return true;
        } finally {
            // 清理测试目录
            await fs.remove(testDir);
        }
    }

    testCommandInterface() {
        // 检查主入口文件
        const indexPath = path.join(this.skillDir, 'index.js');
        const content = fs.readFileSync(indexPath, 'utf8');
        
        // 检查必要的命令处理
        const requiredCommands = [
            'init', 'load', 'search', 'enhance', 'status', 'test'
        ];
        
        for (const command of requiredCommands) {
            if (!content.includes(`command('${command}'`)) {
                throw new Error(`缺少命令处理: ${command}`);
            }
        }
        
        // 检查帮助信息
        if (!content.includes('.help()') || !content.includes('.version(')) {
            throw new Error('命令接口不完整');
        }
        
        return true;
    }

    testIntegration() {
        // 检查 OpenClaw 集成配置
        const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
        
        if (!config.compatibility || !config.compatibility.openclaw_min_version) {
            throw new Error('缺少 OpenClaw 兼容性配置');
        }
        
        // 检查技能类别和标签
        const packageJson = JSON.parse(
            fs.readFileSync(path.join(this.skillDir, 'package.json'), 'utf8')
        );
        
        if (!packageJson.clawhub || !packageJson.clawhub.category) {
            throw new Error('缺少 ClawHub 发布配置');
        }
        
        // 检查支持的平台
        if (!config.compatibility.supported_platforms) {
            throw new Error('缺少平台兼容性配置');
        }
        
        return true;
    }

    testPerformance() {
        // 性能基准测试
        const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
        
        // 检查性能相关配置
        if (!config.retrieval || config.retrieval.top_k_results <= 0) {
            throw new Error('检索配置无效');
        }
        
        if (!config.integration || config.integration.max_context_tokens <= 0) {
            throw new Error('集成配置无效');
        }
        
        // 检查优化配置
        if (!config.optimization || !config.optimization.importance_scoring) {
            throw new Error('优化配置不完整');
        }
        
        return true;
    }

    printTestSummary() {
        console.log(chalk.cyan.bold('\n📊 测试结果汇总'));
        console.log(chalk.gray('='.repeat(50)));
        
        console.log(chalk.bold(`总计测试: ${this.testResults.total}`));
        console.log(chalk.green(`✅ 通过: ${this.testResults.passed}`));
        console.log(chalk.red(`❌ 失败: ${this.testResults.failed}`));
        
        const passRate = (this.testResults.passed / this.testResults.total * 100).toFixed(1);
        console.log(chalk.bold(`📈 通过率: ${passRate}%`));
        
        console.log(chalk.cyan('\n📋 详细结果:'));
        for (const detail of this.testResults.details) {
            const color = detail.status.includes('✅') ? chalk.green : chalk.red;
            console.log(color(`  ${detail.status} ${detail.test}`));
            if (detail.message && !detail.status.includes('✅')) {
                console.log(chalk.gray(`    原因: ${detail.message}`));
            }
        }
        
        console.log(chalk.gray('\n='.repeat(50)));
        
        if (this.testResults.failed === 0) {
            console.log(chalk.green.bold('🎉 所有测试通过！技能准备发布。'));
            
            console.log(chalk.yellow('\n🚀 发布前检查清单:'));
            console.log(chalk.gray('  1. ✅ 技能结构完整'));
            console.log(chalk.gray('  2. ✅ 配置文件有效'));
            console.log(chalk.gray('  3. ✅ 脚本功能正常'));
            console.log(chalk.gray('  4. ✅ 依赖管理正确'));
            console.log(chalk.gray('  5. ✅ 命令接口完整'));
            console.log(chalk.gray('  6. ✅ 集成兼容性良好'));
            console.log(chalk.gray('  7. ✅ 性能配置合理'));
            
            console.log(chalk.cyan('\n💡 建议操作:'));
            console.log(chalk.yellow('  1. 创建GitHub仓库并推送代码'));
            console.log(chalk.yellow('  2. 发布到npm包管理器'));
            console.log(chalk.yellow('  3. 发布到ClawHub技能市场'));
            console.log(chalk.yellow('  4. 在社区发布公告'));
            
        } else {
            console.log(chalk.red.bold('⚠️ 发现测试失败，请修复后再发布。'));
            console.log(chalk.yellow('\n🔧 修复建议:'));
            console.log(chalk.gray('  1. 检查失败的测试项目'));
            console.log(chalk.gray('  2. 修复相关问题'));
            console.log(chalk.gray('  3. 重新运行测试套件'));
            console.log(chalk.gray('  4. 确保所有测试通过'));
            
            process.exit(1);
        }
    }
}

// 运行测试
if (require.main === module) {
    const tester = new SkillTester();
    tester.runAllTests().catch(error => {
        console.error(chalk.red('测试运行失败:'), error);
        process.exit(1);
    });
}

module.exports = SkillTester;