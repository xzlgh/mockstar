import React, { Component } from 'react';
import { connect } from 'react-redux';

import CreateMockerForm from './create-mocker-form';

import { getDataByPost } from '../../../../business/db';
import { getCGIBase } from '../../../../custom';

import './index.less';

class CreateMocker extends Component {
  getMockServerHost() {
    const { localServerConfig } = this.props;

    // hostname 应该与页面一致
    const hostname = window.location.hostname;

    // 如果是本地服务，则需要更换端口号为服务端返回的端口号。
    // 例如本地调试的页面是 127.0.0.1:3000 而 mock server 是 127.0.0.1:9527
    const port =
      hostname === 'localhost' || hostname === '127.0.0.1'
        ? localServerConfig.port
        : window.location.port;

    // 有端口的时候一定要记得设置端口
    return hostname + (port ? `:${port}` : '');
  }

  handleCreateMocker = queryData => {
    // 获得 requestURL
    let requestURL = `${getCGIBase()}/create-mocker`;

    if (process.env.NODE_ENV !== 'production') {
      requestURL = 'http://127.0.0.1:9527' + requestURL;
    }

    getDataByPost(requestURL, queryData)
      .then(data => {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`url=${requestURL}`, queryData, data);
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  render() {
    const { localServerConfig } = this.props;

    return (
      <div className="create-mocker">
        <h2>创建 mocker</h2>

        <CreateMockerForm
          localServerConfig={localServerConfig}
          handleCreateMocker={this.handleCreateMocker}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { detailInfo } = state;

  return {
    localServerConfig: detailInfo.config,
  };
}

export default connect(mapStateToProps)(CreateMocker);
