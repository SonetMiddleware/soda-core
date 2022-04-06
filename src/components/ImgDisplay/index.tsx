import React, { useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import './index.less';

export default (props: { src: string; [key: string]: any }) => {
  const [loading, setLoading] = useState(true);
  const { src, ...rest } = props;

  return (
    <>
      <div
        className="loading-container"
        style={{ display: loading ? 'flex' : 'none' }}
      >
        <LoadingOutlined />
      </div>
      <div
        className="img-container"
        style={{ display: loading ? 'none' : 'flex' }}
      >
        <img
          src={src}
          {...rest}
          onLoad={() => {
            setLoading(false);
          }}
        />
      </div>
    </>
  );
};
