/**
 * 책무점검 현황(N01) 세 탭(총괄·임원별·부서별)이 같이 쓰는 조각 — 툴바 줄·모니터 3칸·제목 붙은 그리드 칸·그리드 열 만들기.
 * AS-IS: Tdm50_Tab_Dashboard / Tdm50_Tab_DashboardExct / Tdm50_Tab_DashboardOrg 가 같은 코드를 세 번 복사해 쓴다 (monitorStyle·rateStr·setHtmlGridStyle·buildGrid 들).
 * 함수 이름은 원본 메서드 이름을 따른다 (줄 번호는 Tdm50_Tab_Dashboard.java 기준, 새 원본 IDMS-IC)
 */
import React from 'react';
import { Radio } from 'antd';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { Button } from '@/components/button';
import { QuickMoveField, YearMonth } from '@/components/form/QuickMoveField';
import { gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { TdmDashboardCheckEnd, TdmDashboardChckOrg, TdmDashboardInsuff, TdmDashboardProgress, TdmDashboardUndone } from '@/types/tdm';

/** 점검 상태 구분 (1:최종승인 / 2:점검완료) */
export type StatusType = '1' | '2';

const pad2 = (n: number) => String(n).padStart(2, '0');

/** AS-IS QuickMoveField.getYYYYMM() — 'yyyy.MM' */
export const checkYmOf = (v: YearMonth) => `${v.year}.${pad2(v.month)}`;

/** AS-IS QuickMoveField.getFirstDay() — 그 달 1일 'yyyy-MM-dd' */
export const firstDayOf = (v: YearMonth) => `${v.year}-${pad2(v.month)}-01`;

/** setDefault() L185-204: 'yyyy.MM' → 연·월 (substring(0,4), substring(5,7)) */
export const ymOfCheckYm = (checkYm: string): YearMonth => ({ year: Number(checkYm.substring(0, 4)), month: Number(checkYm.substring(5, 7)) });

/** rateStr() L397-403: null이면 "0.0%", 아니면 소수 첫째 자리까지 반올림(Java double 글자 "50.0"에 맞춰 toFixed(1)) */
export const rateStr = (rate: number | null | undefined) => (rate == null ? '0.0%' : `${(Math.round(rate * 10) / 10).toFixed(1)}%`);

const LABEL_COLOR = '#404040';

/** setHtmlGridStyle(text, "404040") — 굵은 글씨 */
export const GridTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <b style={{ color: LABEL_COLOR }}>{children}</b>
);

// ── 모니터 3칸 (monitorHlc L148-152: 20% · 20% · 60%, 높이 140, 여백 10) ──

/**
 * monitorLabel03 값 "대상 / <b style=color:#0171C0;>적정</b> / <b style=color:#DD5E5E;>미흡</b> / 해당없음" — 서버 SQL이 만든 조각.
 * HTML을 그대로 넣지 않고 `<b style=color:#xxxxxx;>…</b>`만 풀어 굵은 색 글씨로 그린다.
 */
const renderCheckCntInfo = (info: string): React.ReactNode[] => {
  const out: React.ReactNode[] = [];
  const re = /<b style=color:(#[0-9A-Fa-f]{3,6});>(.*?)<\/b>/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(info)) !== null) {
    if (m.index > last) out.push(info.substring(last, m.index));
    out.push(<b key={i++} style={{ color: m[1] }}>{m[2]}</b>);
    last = re.lastIndex;
  }
  if (last < info.length) out.push(info.substring(last));
  return out;
};

const MonitorPanel: React.FC<{ title: string; flex: number; align: 'flex-end' | 'center'; children: React.ReactNode }> = ({ title, flex, align, children }) => (
  <div style={{ flex, minWidth: 0, margin: 10, border: '1px solid #d9d9d9', boxSizing: 'border-box', background: '#fff', display: 'flex', flexDirection: 'column' }}>
    <div style={{ padding: '4px 10px', background: '#f5f5f5', borderBottom: '1px solid #d9d9d9' }}><GridTitle>{title}</GridTitle></div>
    <div style={{ flex: 1, minHeight: 0, display: 'flex', justifyContent: align, alignItems: 'flex-end' }}>
      <span style={{ fontSize: 50, marginBottom: 35, marginRight: 25, whiteSpace: 'nowrap' }}><b>{children}</b></span>
    </div>
  </div>
);

/** progress가 null이면 init() 상태 "-" , 값이 있으면 retrieve() L305-309 */
export const MonitorRow: React.FC<{ progress: TdmDashboardProgress | null }> = ({ progress }) => (
  <div style={{ flex: 'none', height: 140, display: 'flex' }}>
    <MonitorPanel title="진행율" flex={0.2} align="flex-end">{progress ? rateStr(progress.progRate) : '-'}</MonitorPanel>
    <MonitorPanel title="적정비율" flex={0.2} align="flex-end">{progress ? rateStr(progress.suffRate) : '-'}</MonitorPanel>
    {/* 값이 null이면 AS-IS 문자열 연결이 "null"을 그대로 찍는다 */}
    <MonitorPanel title="점검결과 : 대상 / 적정 / 미흡 / 해당없음" flex={0.6} align="center">
      {progress ? renderCheckCntInfo(String(progress.checkCntInfo)) : '-'}
    </MonitorPanel>
  </div>
);

// ── 툴바 줄 (buttonBar L133-146, 높이 50) ──

interface ToolbarProps {
  ym: YearMonth;
  onYmChange: (v: YearMonth) => void;
  /** 월 콤보·◀▶·연도 Enter — 바뀐 값으로 조회 */
  onYmCommit: (v: YearMonth) => void;
  /** 임원 / 부서 칸 (총괄 탭은 없음) */
  lookup?: React.ReactNode;
  statusType: StatusType;
  onStatusChange: (v: StatusType) => void;
  onRefresh: () => Promise<void> | void;
  checkEnd: TdmDashboardCheckEnd | null;
}

/** setCheckEndInfo() L323-348: 마감되었으면 일반 글씨, 아니면 빨강 "마감일", 작업이 없으면 빈칸 */
const CheckEndLabel: React.FC<{ checkEnd: TdmDashboardCheckEnd | null }> = ({ checkEnd }) => {
  if (!checkEnd) return null;
  if (checkEnd.endYn) return <b style={{ fontSize: 12 }}>* 당월 이행점검은 마감되었습니다</b>;
  return <b style={{ fontSize: 12, color: '#DD5E5E' }}>* 마감일 : {checkEnd.endDate ?? ''}</b>;
};

export const DashboardToolbar: React.FC<ToolbarProps> = ({ ym, onYmChange, onYmCommit, lookup, statusType, onStatusChange, onRefresh, checkEnd }) => (
  <div style={{ flex: 'none', height: 50, display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px', boxSizing: 'border-box', borderBottom: '1px solid #f0f0f0' }}>
    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <b>점검년월</b>
      <QuickMoveField {...ym} onChange={onYmChange} onCommit={onYmCommit} />
    </span>
    {lookup}
    {/* radio1(최종승인, 기본) · radio2(점검완료) 75폭, toggleGroup.ValueChange → statusType 바꾸고 retrieve() */}
    <Radio.Group value={statusType} onChange={e => onStatusChange(e.target.value as StatusType)}>
      <Radio value="1" style={{ width: 75 }}>최종승인</Radio>
      <Radio value="2" style={{ width: 75 }}>점검완료</Radio>
    </Radio.Group>
    <Button type="reset" onClick={onRefresh}>새로고침</Button>
    <span style={{ marginLeft: 10 }}><CheckEndLabel checkEnd={checkEnd} /></span>
  </div>
);

/** 임원 / 부서 칸 앞의 이름표 (setHtmlBarStyle) */
export const ToolbarField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><b>{label}</b>{children}</span>
);

// ── 제목 붙은 그리드 칸 (vlc01 L153-155: 제목 30 + 그리드) ──

export const TitledGrid: React.FC<{ title: string; style?: React.CSSProperties; titleStyle?: React.CSSProperties; children: React.ReactNode }> = ({ title, style, titleStyle, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0, boxSizing: 'border-box', ...style }}>
    <div style={{ flex: 'none', height: 30, margin: 3, display: 'flex', alignItems: 'center', ...titleStyle }}><GridTitle>■ {title}</GridTitle></div>
    <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
  </div>
);

/** 화면 한 탭의 바깥 틀: 툴바 + 모니터 + 본문. 테두리(vlc.setBorders) */
export const DashboardFrame: React.FC<{ toolbar: React.ReactNode; progress: TdmDashboardProgress | null; children: React.ReactNode }> = ({ toolbar, progress, children }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9', boxSizing: 'border-box', background: '#fff', overflow: 'hidden' }}>
    {toolbar}
    <MonitorRow progress={progress} />
    {children}
  </div>
);

// ── 그리드 열 (addLongCnt / addDouble 등) ──

const gbChck = gbFor<TdmDashboardChckOrg>();
const gbUndone = gbFor<TdmDashboardUndone>();
const gbInsuff = gbFor<TdmDashboardInsuff>();

/** addLongCnt(…, "404040") — 굵은 "N건", null·0도 "0건", 오른쪽 정렬 */
const CntCell = (p: ICellRendererParams) => <b style={{ color: LABEL_COLOR }}>{p.value == null ? 0 : p.value}건</b>;

/** addDouble(…, "404040") — GXT NumberCell<Double> 기본 서식(소수 셋째 자리까지, 콤마), 제목 글자색 404040 */
const fmtNumberCell = (v: unknown) => (v == null || v === '' ? '' : new Intl.NumberFormat('en-US', { maximumFractionDigits: 3 }).format(Number(v)));

const cnt = (field: keyof TdmDashboardChckOrg & string, w: number, header: string): ColDef<TdmDashboardChckOrg> =>
  gbChck.long(field, w, header, { cellRenderer: CntCell, valueFormatter: undefined });

const progCol = (w: number): ColDef<TdmDashboardChckOrg> =>
  gbChck.double('progRate', w, '진행율(%)', { valueFormatter: p => fmtNumberCell(p.value), headerStyle: { color: LABEL_COLOR } });

/**
 * 진행현황 열: [앞 열들] + 진행율(%) + 대상 + 미점검 + 묶음 "점검"{적정·미흡·해당없음}
 * HeaderGroupMap(0, 적정 열, HeaderGroupConfig("점검", 1, 3)) — 적정부터 3칸을 묶는다
 */
export const progressColumns = (lead: ColDef<TdmDashboardChckOrg>[], progW: number, cntW: number): ColDef<TdmDashboardChckOrg>[] => [
  ...lead,
  progCol(progW),
  cnt('monthCheckCnt', cntW, '대상'),
  cnt('monthManlUndoneCnt', cntW, '미점검'),
  gbChck.group('점검', [
    cnt('monthCheck1Cnt', cntW, '적정'),
    cnt('monthCheck2Cnt', cntW, '미흡'),
    cnt('monthCheck9Cnt', cntW, '해당없음'),
  ]) as ColDef<TdmDashboardChckOrg>,
];

/** getSumGrid("계", …) — 맨 아래 합계 행: 라벨 열 + 대상~해당없음 합계 */
export const progressSumRow = (labelField: string) => ({
  labelField,
  label: '계',
  sum: ['monthCheckCnt', 'monthManlUndoneCnt', 'monthCheck1Cnt', 'monthCheck2Cnt', 'monthCheck9Cnt'],
});

export { gbChck, gbUndone, gbInsuff };

/** 아이콘 열은 합계 행에는 그리지 않는다 (Apr01_Tab_TotalList와 같은 처리 — 이 화면의 아이콘 열은 합계 행이 있는 그리드에는 없지만 안전하게) */
export const viewCell = <T,>(colId: string, width: number, header: string, onClick: (row: T) => void): ColDef<T> =>
  iconCell<T>('view', colId, width, header, onClick);

/** 상세 보기 팝업은 다음 단계(N22 점검 편집창·N24 미흡 조치 상세) — 1단계는 안내만 */
export const NEXT_STEP_MESSAGE = '상세 보기 창은 아직 변환되지 않았습니다 (점검 편집창 N22 · 미흡 조치 상세 N24와 함께 제공됩니다)';
