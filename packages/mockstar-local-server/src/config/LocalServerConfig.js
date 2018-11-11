const fs = require('fs');
const { getMockServerPath, getBuildPath, getLogPath } = require('../utils/mockstar');

class LocalServerConfig {
    /**
     * 获取最终的配置数据
     *
     * @param {Object} configOpts mockstar.config.js中的配置项
     * @param {String} [configOpts.rootPath] 项目根目录
     * @param {String} [configOpts.buildPath] 构建之后的目录
     * @param {String} [configOpts.logPath] 日志目录
     * @param {String} [configOpts.mockServerPath]  mock server 根目录
     * @param {Number} [configOpts.port] 端口号
     * @param {String} [configOpts.name] pm2 应用的名字
     * @param {Boolean} [configOpts.isDev] 当前是否为开发模式
     * @param {Boolean} [configOpts.watch] 是否监听文件变化，只有在 pm2 场景下才有效
     * @param {String} [configOpts.namespace] 命名空间
     * @returns {Object}
     */
    constructor(configOpts = {}) {
        // 根目录
        this.rootPath = configOpts.rootPath;

        // 构建之后的目录
        this.buildPath = getBuildPath(this.rootPath, configOpts.buildPath);

        // 日志目录
        this.logPath = getLogPath(this.rootPath, this.buildPath, configOpts.logPath);

        // mock server 根目录
        this.mockServerPath = getMockServerPath(this.rootPath, configOpts.mockServerPath);

        // mockstar 启动之后的服务端口号，默认为 9527
        this.port = configOpts.port || 9527;

        // pm2 应用的名字
        this.name = configOpts.name || `mockstar_${this.port}`;

        // 当前是否为开发模式
        this.isDev = configOpts.isDev || false;

        // 是否监听文件变化，只有在 pm2 场景下才有效
        this.watch = configOpts.watch || false;

        // 命名空间
        this.namespace = configOpts.namespace || '';

        // 管理后台页面的路由名，实际访问时路径为 yourdomain/{this.namespace}/{this.adminSiteRouteName}
        this.adminSiteRouteName = `mockstar-admin`;

        // 管理后台CGI的路由名，实际访问时路径为 yourdomain/{this.namespace}/{this.adminCGIRouteName}
        this.adminCGIRouteName = `mockstar-cgi`;
    }

    isValid() {
        // 根目录一定要存在
        if (!this.rootPath || !fs.existsSync(this.rootPath)) {
            console.error('UNKNOWN rootPath=' + this.rootPath);
            return false;
        }

        // mockServerPath 目录一定要存在
        if (!this.mockServerPath || !fs.existsSync(this.mockServerPath)) {
            console.error('UNKNOWN mockServerPath=' + this.mockServerPath);
            return false;
        }

        return true;
    }

    /**
     * 获得管理后台站点根目录
     *
     * 1. /
     * 2. /xxx/
     *
     * @param {Boolean} [ignoreNamespace] 是否忽略 namespace
     * @return {String}
     */
    getAdminSiteRootPath(ignoreNamespace) {
        return `${!ignoreNamespace && this.namespace ? '/' + this.namespace : ''}/`;
    }

    /**
     * 获得管理后台页面的基础路径
     *
     * 1. /mockstar-admin
     * 2. /xxx/mockstar-admin
     *
     * @param {Boolean} [ignoreNamespace] 是否忽略 namespace
     * @return {String}
     */
    getAdminSiteBase(ignoreNamespace) {
        return `${this.getAdminSiteRootPath(ignoreNamespace)}${this.adminSiteRouteName}`;
    }

    /**
     * 获得管理后台CGI的基础路径
     *
     * 1. /mockstar-cgi
     * 2. /xxx/mockstar-cgi
     *
     * @param {Boolean} [ignoreNamespace] 是否忽略 namespace
     * @return {String}
     */
    getAdminCGIBase(ignoreNamespace) {
        return `${this.getAdminSiteRootPath(ignoreNamespace)}${this.adminCGIRouteName}`;
    }

    /**
     * 获得在 web 页面展示的数据
     * @return {Object}
     */
    getShowDataInWeb() {
        // 开发者模式下展示所有的数据
        if (this.isDev) {
            return this;
        }

        // 生产环境下只展示必要的
        return {
            name: this.name,
            port: this.port,
            namespace: this.namespace,
            adminSiteRouteName: this.adminSiteRouteName,
            adminCGIRouteName: this.adminCGIRouteName
        };
    }
}

module.exports = LocalServerConfig;