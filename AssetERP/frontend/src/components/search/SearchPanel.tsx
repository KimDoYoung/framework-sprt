import React, { useCallback } from 'react';
import { Typography } from 'antd';
import { Button, usePromiseLoading } from '../button';
import { SearchContext, SearchInput } from './SearchBar';

/**
 * 여러 줄 검색 영역 — AS-IS 툴바가 `buttonBar1`·`buttonBar2`처럼 두 줄 이상일 때 쓴다(한 줄이면 SearchBar).
 *   왼쪽: 입력 줄들(`SearchPanel.Row`)   오른쪽: 버튼 줄들(`SearchPanel.Actions`) — 같은 번호의 줄끼리 높이가 맞는다.
 *   첫 번째 Actions 줄 맨 앞에 [조회]가 자동으로 들어간다(UX-01: 조회 중 중복 클릭 무시, Promise를 돌려주면 끝날 때까지 loading).
 *   Actions가 없어도 [조회]는 그려진다. SearchPanel.Input = SearchBar.Input(Enter 조회·지우기·Ctrl+Delete).
 *
 *   <SearchPanel onSearch={retrieve} loading={loading} fieldsWidth={520}>
 *     <SearchPanel.Row><SearchPanel.Field label="일자">…</SearchPanel.Field><SearchPanel.Field label="분류">…</SearchPanel.Field></SearchPanel.Row>
 *     <SearchPanel.Row><SearchPanel.Field label="검색"><SearchPanel.Input style={{ flex: 1 }} /></SearchPanel.Field></SearchPanel.Row>
 *     <SearchPanel.Actions><Button type="save">확인</Button></SearchPanel.Actions>
 *     <SearchPanel.Actions><Checkbox>미점검 보기</Checkbox></SearchPanel.Actions>
 *   </SearchPanel>
 */
export interface SearchPanelProps {
  /** 조회. Promise를 돌려주면 끝날 때까지 loading */
  onSearch: () => unknown;
  /** 조회 버튼 문구 (원본 문구가 '조회'가 아닐 때) */
  searchText?: React.ReactNode;
  /** 바깥에서 주는 조회 중 표시 (페이징 툴바 이동 등) */
  loading?: boolean;
  disabled?: boolean;
  /** 왼쪽 입력 영역의 폭(px). 기본 520 */
  fieldsWidth?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

interface RowProps { children?: React.ReactNode }

/** 왼쪽 입력 한 줄 */
const Row: React.FC<RowProps> = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>{children}</div>
);

/** 오른쪽 버튼·체크박스 한 줄 */
const Actions: React.FC<RowProps> = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>{children}</div>
);

/** 라벨 + 입력 묶음. 라벨은 `일자 :`처럼 콜론을 붙여 오른쪽 정렬한다. 입력칸이 줄의 남은 폭을 채우려면 입력에 `style={{ flex: 1 }}` */
const Field: React.FC<{ label: React.ReactNode; children: React.ReactNode; grow?: boolean }> = ({ label, children, grow }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: grow ? 1 : 'none', minWidth: 0 }}>
    <Typography.Text strong style={{ minWidth: 48, textAlign: 'right' }}>{label} :</Typography.Text>
    {children}
  </div>
);

const SearchPanelBase: React.FC<SearchPanelProps> = ({ onSearch, searchText = '조회', loading, disabled, fieldsWidth = 520, style, children }) => {
  const [busy, run] = usePromiseLoading(onSearch);
  const isLoading = loading || busy;
  const search = useCallback(() => { if (!isLoading) run(); }, [isLoading, run]);

  const kids = React.Children.toArray(children) as React.ReactElement<RowProps>[];
  const rows = kids.filter(k => k.type === Row);
  const actions = kids.filter(k => k.type === Actions);
  const searchButton = <Button type="search" loading={isLoading} disabled={disabled} onClick={search}>{searchText}</Button>;
  const count = Math.max(rows.length, actions.length, 1);

  const cells: React.ReactNode[] = [];
  for (let i = 0; i < count; i += 1) {
    cells.push(<React.Fragment key={`l${i}`}>{rows[i] ?? <div />}</React.Fragment>);
    cells.push(i === 0
      ? <Actions key="r0">{searchButton}{actions[0]?.props.children}</Actions>
      : <React.Fragment key={`r${i}`}>{actions[i] ?? <div />}</React.Fragment>);
  }
  return (
    <SearchContext.Provider value={{ search, loading: isLoading }}>
      <div style={{ display: 'grid', gridTemplateColumns: `${fieldsWidth}px auto`, columnGap: 16, rowGap: 10, alignItems: 'center', justifyContent: 'start', ...style }}>
        {cells}
      </div>
    </SearchContext.Provider>
  );
};

export const SearchPanel = Object.assign(SearchPanelBase, { Row, Actions, Field, Input: SearchInput });
