import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Input, Space, Typography, type InputProps } from 'antd';
import { Button, usePromiseLoading } from '../button';

/**
 * 검색 영역 — UX보강(docs/10-UX보강.md) UX-01·02·04를 부품 안에서만 넣는다.
 *   필드들 → [조회] → [초기화] → extra(저장 등 원본 툴바의 나머지 버튼)
 * - UX-01 조회 버튼과 SearchBar.Input의 Enter가 같은 loading을 쓴다: onSearch가 Promise를 돌려주면 끝날 때까지 스피너·중복 조회 무시
 * - UX-02 onReset을 주고 검색 조건(children — 라벨 묶음·입력·콤보 하나가 1개)이 2개 이상이면 조회 다음에 초기화(1개면 그리지 않는다).
 *   자동 조회는 하지 않는다. 값은 useSearchParams의 reset()(화면을 처음 열었을 때의 값). 넣어서 툴바가 줄바꿈되면 화면에서 onReset을 뺀다(10 UX-02)
 * - UX-04 SearchBar.Input은 allowClear 기본 true (편집 폼에는 쓰지 않는다)
 *
 *   const sp = useSearchParams(() => ({ companyCd: ALL, searchText: '' }));
 *   <SearchBar onSearch={crud.retrieve} onReset={sp.reset} extra={<Button type="save" …>저장</Button>}>
 *     <SearchBar.Field label="검색"><SearchBar.Input value={sp.values.searchText} onChange={e => sp.set('searchText', e.target.value)} /></SearchBar.Field>
 *   </SearchBar>
 */
interface SearchContextValue {
  search: () => void;
  loading: boolean;
}

const SearchContext = createContext<SearchContextValue>({ search: () => undefined, loading: false });

export interface SearchBarProps {
  /** 조회. Promise를 돌려주면 끝날 때까지 loading */
  onSearch: () => unknown;
  /** 초기화 (UX-02). 없으면 초기화 버튼을 그리지 않는다 */
  onReset?: () => void;
  /** 조회 버튼 문구 (원본 문구가 '조회'가 아닐 때) */
  searchText?: React.ReactNode;
  /** 조회·초기화 뒤에 붙는 원본 버튼들 */
  extra?: React.ReactNode;
  /** 바깥에서 주는 조회 중 표시 (페이징 툴바 이동 등 SearchBar 밖에서 조회할 때) */
  loading?: boolean;
  /** 원본이 조회 버튼을 비활성으로 두는 화면(부모 선택 전 등) — 조회·초기화 버튼을 함께 끈다 */
  disabled?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const SearchBarBase: React.FC<SearchBarProps> = ({ onSearch, onReset, searchText = '조회', extra, loading, disabled, style, children }) => {
  const [busy, run] = usePromiseLoading(onSearch);
  const isLoading = loading || busy;
  const search = useCallback(() => { if (!isLoading) run(); }, [isLoading, run]);
  const showReset = !!onReset && React.Children.toArray(children).length >= 2;
  return (
    <SearchContext.Provider value={{ search, loading: isLoading }}>
      <Space wrap style={style}>
        {children}
        <Button type="search" loading={isLoading} disabled={disabled} onClick={search}>{searchText}</Button>
        {showReset && <Button type="reset" disabled={isLoading || disabled} onClick={onReset}>초기화</Button>}
        {extra}
      </Space>
    </SearchContext.Provider>
  );
};

/** 라벨 + 입력 묶음 (기존 화면의 `Typography.Text strong` 라벨 모양) */
const Field: React.FC<{ label: React.ReactNode; children: React.ReactNode }> = ({ label, children }) => (
  <Space size={6}>
    <Typography.Text strong>{label}</Typography.Text>
    {children}
  </Space>
);

/** 검색어 입력 — Enter = 조회(UX-01, 조회 중이면 무시), allowClear 기본 true(UX-04), Ctrl+Delete = 내용 전체 비움 */
const SearchInput: React.FC<InputProps> = ({ allowClear = true, onPressEnter, onKeyDown, ...rest }) => {
  const { search } = useContext(SearchContext);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.key !== 'Delete' || !e.ctrlKey || e.defaultPrevented) return;
    const el = e.currentTarget;
    if (!el.value) return;
    e.preventDefault();
    // 제어 컴포넌트의 onChange가 불리도록 네이티브 setter + input 이벤트로 비운다
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(el, '');
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };
  return <Input allowClear={allowClear} {...rest} onKeyDown={handleKeyDown} onPressEnter={e => { onPressEnter?.(e); search(); }} />;
};

export const SearchBar = Object.assign(SearchBarBase, { Field, Input: SearchInput });

/**
 * 검색 조건 값 — init은 화면을 처음 열 때 한 번만 부른다(로그인 회사·오늘 등). reset()은 그 값으로 되돌린다(UX-02).
 * 조회 함수가 최신 값을 읽도록 values는 state, 같은 값은 ref(current)로도 준다.
 */
export function useSearchParams<T extends object>(init: () => T) {
  const initial = useRef<T | null>(null);
  if (initial.current === null) initial.current = init();
  const [values, setValues] = useState<T>(initial.current);
  const current = useRef(values);
  current.current = values;
  const set = useCallback(<K extends keyof T>(key: K, value: T[K]) => setValues(prev => ({ ...prev, [key]: value })), []);
  const reset = useCallback(() => setValues(initial.current as T), []);
  return { values, set, setValues, reset, current };
}
