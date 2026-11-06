/**
 * MyPage 표 박스 공통 껍데기 (MonitorGridBox) — 일정·Day List·전자결재·법규 4개 박스가 같은 모양을 쓴다(사용자 결정 2026-11-06).
 * 모양은 ScheduleGridBox 목업에서 뽑았다: 헤더(제목 + 총 n건 + 오른쪽 버튼) / 칩 탭 줄(이름 [건수]) / 조밀한 antd Table.
 * AS-IS의 Monitoring_Page_* 는 PlainTabPanel(탭 이름에 건수, 건수>0이면 파란 글씨 — Monitoring_Page_Appr.clearPanel L212-240) + GridBuilder 그리드.
 * 표는 AG Grid가 아니라 antd Table이다(보기 전용 대시보드, MyPage 한정 예외 — 11-프론트부품.md §5).
 * 높이: 박스는 부모 높이를 채우고, 표 몸통 스크롤 높이(scroll.y)는 박스 안 남은 높이를 재서 맞춘다(스크롤바는 표 안쪽 하나).
 */
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { sanitizeHtml } from '@/components/grid/renderers';
import './MonitorGridBox.css';

export interface MonitorTab {
  key: string;
  label: string;
  count: number;
}

interface Props<T> {
  /** 헤더 왼쪽 제목(날짜 이동 같은 것도 넣을 수 있다) */
  title: React.ReactNode;
  /** 제목 옆 "총 n건" — 주지 않으면 dataSource 수, null이면 숨김 */
  total?: number | null;
  /** 헤더 오른쪽(버튼 등) */
  extra?: React.ReactNode;
  /** 칩 탭 줄 — 없으면 줄을 그리지 않는다 */
  tabs?: MonitorTab[];
  activeTab?: string;
  onTabChange?: (key: string) => void;
  columns: TableProps<T>['columns'];
  dataSource: T[];
  rowKey: TableProps<T>['rowKey'];
  loading?: boolean;
  /** 행 선택(클릭) — 버튼이 선택 행을 쓸 때 (AS-IS grid.getSelectionModel().getSelectedItem()) */
  onRowClick?: (row: T) => void;
  /** AS-IS grid.CellDoubleClick */
  onRowDoubleClick?: (row: T) => void;
  /** 행이 없을 때 문구 */
  emptyText?: string;
}

/** 칩 하나 — 고르면 파란 바탕, 안 골랐어도 건수가 있으면 파란 글씨(AS-IS htmlStyle01_color #4472C4) */
const TabChip: React.FC<{ tab: MonitorTab; selected: boolean; onClick: () => void }> = ({ tab, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`monitor-chip${selected ? ' is-selected' : ''}${!selected && tab.count > 0 ? ' has-count' : ''}`}
  >
    {tab.label} <span className="monitor-chip-count">[{tab.count}]</span>
  </button>
);

export function MonitorGridBox<T extends object>({
  title, total, extra, tabs, activeTab, onTabChange,
  columns, dataSource, rowKey, loading, onRowClick, onRowDoubleClick, emptyText = '조회된 내용이 없습니다.',
}: Props<T>) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState<number>(120);
  const [selectedKey, setSelectedKey] = useState<React.Key | null>(null);

  // 표 몸통 높이 = 박스 남은 높이 - 표 머리(약 25px)
  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const measure = () => {
      const head = el.querySelector<HTMLElement>('.ant-table-header')?.offsetHeight ?? 25;
      setScrollY(Math.max(40, el.clientHeight - head - 1));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const keyOf = (row: T, index?: number): React.Key =>
    typeof rowKey === 'function' ? rowKey(row, index) : ((row as Record<string, unknown>)[rowKey as string] as React.Key);

  // AS-IS: 조회가 끝나면 첫 행을 선택한다(grid.getSelectionModel().select(0, false))
  useEffect(() => {
    setSelectedKey(dataSource.length > 0 ? keyOf(dataSource[0], 0) : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource]);

  const shown = total === undefined ? dataSource.length : total;

  return (
    <div className="monitor-box">
      <div className="monitor-head">
        <div className="monitor-title">
          {title}
          {shown !== null && <Tag color="blue" className="monitor-total">총 {shown}건</Tag>}
        </div>
        {extra && <div className="monitor-extra">{extra}</div>}
      </div>

      {tabs && tabs.length > 0 && (
        <div className="monitor-tabs">
          {tabs.map(t => (
            <TabChip key={t.key} tab={t} selected={activeTab === t.key} onClick={() => onTabChange?.(t.key)} />
          ))}
        </div>
      )}

      <div ref={bodyRef} className="monitor-body">
        <Table<T>
          className="monitor-table"
          rowKey={rowKey}
          dataSource={dataSource}
          columns={columns}
          size="small"
          pagination={false}
          loading={loading}
          scroll={{ y: scrollY }}
          locale={{ emptyText }}
          rowClassName={(row, i) => (keyOf(row, i) === selectedKey ? 'monitor-row-selected' : '')}
          onRow={row => ({
            onClick: () => { setSelectedKey(keyOf(row)); onRowClick?.(row); },
            onDoubleClick: onRowDoubleClick ? () => onRowDoubleClick(row) : undefined,
          })}
        />
      </div>
    </div>
  );
}

/* ── 열 도우미 (AS-IS GridBuilder addXxx 대응) ───────────────────────── */

/** addTextFix·addText — 글자 열 */
export const monitorText = <T,>(dataIndex: keyof T & string, width: number | undefined, title: string, align: 'left' | 'center' = 'left') => ({
  title, dataIndex, key: dataIndex, width, align, ellipsis: true,
});

/** addDateFix — yyyy-MM-dd */
export const monitorDate = <T,>(dataIndex: keyof T & string, width: number, title: string) => ({
  title, dataIndex, key: dataIndex, width, align: 'center' as const,
  render: (v: string | null) => <span className="monitor-date">{v ? String(v).slice(0, 10) : ''}</span>,
});

/** addTextHtml — 값의 HTML(굵게·색 등)을 보여 준다 */
export const monitorHtml = <T,>(dataIndex: keyof T & string, width: number | undefined, title: string) => ({
  title, dataIndex, key: dataIndex, width, ellipsis: true,
  render: (v: string | null) => <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(v ?? '') }} />,
});

/** addCellFix(ImageCell "Detail") — 상세보기 열 */
export const monitorDetail = <T,>(width: number, onClick: (row: T) => void, title = '상세보기') => ({
  title, key: '__detail', width, align: 'center' as const,
  render: (_: unknown, row: T) => (
    <AntButton size="small" type="link" className="monitor-detail" onClick={e => { e.stopPropagation(); onClick(row); }}>
      상세
    </AntButton>
  ),
});

/**
 * 업무구분 필터 칩 (UX보강 — 탭이 없는 박스: Day List·법규). 전체 + 구분값별 건수, 화면 안에서만 거른다.
 * 행이 바뀌어 고른 구분이 사라지면 전체로 돌아간다.
 */
export function useKindChips<T>(rows: T[], kindOf: (row: T) => string | null | undefined) {
  const [active, setActive] = useState('__all');
  const tabs = useMemo<MonitorTab[]>(() => {
    const counts = new Map<string, number>();
    rows.forEach(r => { const k = kindOf(r) || '-'; counts.set(k, (counts.get(k) ?? 0) + 1); });
    return [{ key: '__all', label: '전체', count: rows.length }, ...[...counts].map(([k, n]) => ({ key: k, label: k, count: n }))];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);
  useEffect(() => { if (!tabs.some(t => t.key === active)) setActive('__all'); }, [tabs, active]);
  const filtered = useMemo(
    () => (active === '__all' ? rows : rows.filter(r => (kindOf(r) || '-') === active)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows, active],
  );
  return { tabs, active, setActive, filtered };
}
