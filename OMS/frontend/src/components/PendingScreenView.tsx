import React from 'react';
import { Result, Typography } from 'antd';
import { ToolOutlined } from '@ant-design/icons';

interface PendingScreenViewProps {
  title: string;
  menuNo?: string;
  classNm?: string;
}

/** 아직 변환하지 않은 화면의 탭 내용 (메뉴는 실제 sys06_menu, 화면은 OMS 변환 순서대로 채운다) */
export const PendingScreenView: React.FC<PendingScreenViewProps> = ({ title, menuNo, classNm }) => (
  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
    <Result
      icon={<ToolOutlined />}
      title={title}
      subTitle="아직 변환하지 않은 화면입니다."
      extra={
        <Typography.Text type="secondary">
          화면번호 {menuNo || '-'} · AS-IS 클래스 {classNm ? <Typography.Text code>{classNm}</Typography.Text> : '-'}
        </Typography.Text>
      }
    />
  </div>
);
