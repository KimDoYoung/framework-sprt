import React, { useEffect, useState } from 'react';
import { Button, Divider, InputNumber, Space, Tooltip, Typography } from 'antd';
import { LeftOutlined, ReloadOutlined, RightOutlined, StepBackwardOutlined, StepForwardOutlined } from '@ant-design/icons';

/**
 * 그리드 아래 페이징 툴바 — AS-IS GridPagingLoader.setToolBar(limit) (GXT PagingToolBar + 한글 메시지).
 * 처음·이전 | 페이지 [n] / 전체 | 다음·마지막 | 새로고침 ……… 전체 {total} 중 {start} - {end} 표시
 * 데이터는 부른 쪽이 가진다: 페이지를 바꾸면 onChange(page) → 부른 쪽이 offset = (page-1)*limit로 다시 조회.
 */
export interface PagingToolBarProps {
  /** 현재 페이지 (1부터) */
  page: number;
  /** 페이지 크기 (AS-IS setToolBar(limit)) */
  limit: number;
  /** 전체 건수 (AS-IS selectXxxTotal) */
  total: number;
  /** 페이지 이동·새로고침(같은 페이지) */
  onChange: (page: number) => void;
  loading?: boolean;
}

export const PagingToolBar: React.FC<PagingToolBarProps> = ({ page, limit, total, onChange, loading }) => {
  const pages = Math.max(1, Math.ceil(total / limit));
  const [input, setInput] = useState<number | null>(page);
  useEffect(() => setInput(page), [page]);

  const go = (p: number) => {
    const next = Math.min(Math.max(1, p), pages);
    if (next !== page) onChange(next);
    else setInput(page);
  };
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '2px 6px', borderTop: '1px solid #d9d9d9', background: '#fafafa' }}>
      <Space size={2}>
        <Tooltip title="처음 페이지"><Button size="small" type="text" icon={<StepBackwardOutlined />} disabled={loading || page <= 1} onClick={() => go(1)} /></Tooltip>
        <Tooltip title="이전 페이지"><Button size="small" type="text" icon={<LeftOutlined />} disabled={loading || page <= 1} onClick={() => go(page - 1)} /></Tooltip>
        <Divider type="vertical" />
        <Typography.Text>페이지</Typography.Text>
        <InputNumber size="small" style={{ width: 56 }} min={1} max={pages} controls={false} value={input}
          disabled={loading} onChange={setInput} onPressEnter={() => go(input ?? page)} />
        <Typography.Text> / {pages}</Typography.Text>
        <Divider type="vertical" />
        <Tooltip title="다음 페이지"><Button size="small" type="text" icon={<RightOutlined />} disabled={loading || page >= pages} onClick={() => go(page + 1)} /></Tooltip>
        <Tooltip title="마지막 페이지"><Button size="small" type="text" icon={<StepForwardOutlined />} disabled={loading || page >= pages} onClick={() => go(pages)} /></Tooltip>
        <Divider type="vertical" />
        <Tooltip title="새로고침"><Button size="small" type="text" icon={<ReloadOutlined />} disabled={loading} onClick={() => onChange(page)} /></Tooltip>
      </Space>
      <Typography.Text style={{ marginLeft: 'auto' }}>
        {total > 0 ? `전체 ${total} 중 ${start} - ${end} 표시` : '표시할 데이터가 없습니다'}
      </Typography.Text>
    </div>
  );
};
