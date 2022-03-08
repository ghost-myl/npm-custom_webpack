import React from 'react';
import { Button } from 'antd';
import Pages from './Pages';
import Footer from 'rc-footer';
import 'rc-footer/assets/index.css'; // import 'rc-footer/asssets/index.less';
import './index.css';

const App1 = () => {
  return (
    <div>
      for me1
      <Button type="primary">1111</Button>
      <Pages />
      <Footer
        columns={[
          {
            icon: <img src="https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg" />,
            title: '语雀',
            url: 'https://yuque.com',
            description: '知识创作与分享工具',
            openExternal: true,
          },
        ]}
        bottom="Made with ❤️ by AFX"
      />
    </div>
  );
};
export default App1;
