/**
 * 화면 안 탭 컨테이너 (page-style STP·TP). antd `Tabs`(card)에 "눌러 쓰는 탭"으로 보이는 모양을 입힌다.
 * 안 고른 탭: 회색 바탕 + 테두리 + 손가락 커서(마우스를 올리면 연한 파랑) / 고른 탭: 흰 바탕 + 위 파란 줄 3px + 굵은 파란 글자.
 * 사용법은 `Tabs`와 같다(type·className 제외).
 */
import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

const CSS = `
.page-tabs .ant-tabs-nav::before { border-bottom: 1px solid #d9d9d9; }
.page-tabs .ant-tabs-tab { cursor: pointer; background: #f0f2f5 !important; border: 1px solid #d9d9d9 !important; padding: 8px 22px !important; }
.page-tabs .ant-tabs-tab .ant-tabs-tab-btn { color: #595959; }
.page-tabs .ant-tabs-tab:hover { background: #e6f4ff !important; }
.page-tabs .ant-tabs-tab:hover .ant-tabs-tab-btn { color: #1677ff; }
.page-tabs .ant-tabs-tab.ant-tabs-tab-active { background: #fff !important; border-top: 3px solid #1677ff !important; border-bottom-color: #fff !important; }
.page-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn { color: #1677ff !important; font-weight: 700; }
`;

export type PageTabsProps = Omit<TabsProps, 'type' | 'className'>;

export const PageTabs: React.FC<PageTabsProps> = props => (
  <>
    <style>{CSS}</style>
    <Tabs {...props} type="card" className="page-tabs" />
  </>
);
