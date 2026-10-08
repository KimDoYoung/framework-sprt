/**
 * [1029] 경영관리 > 01. 조직 및 사원관리 > 사원정보 관리, [1452] 기본정보 > 기본정보 > 사원정보 등록  (C01)
 * AS-IS: myApp/client/vi/emp/Emp00_Tab_TransInfo.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 레이아웃(생성자 L75-125): 가운데 = 툴바 + 사원 그리드, 아래 = 탭 16개(높이 450, 최대 900, 분할 조절)
 * 단계(C01-작업방법): 1단계 = 목록·등록·기본정보·일반발령. 엑셀(E1·E6~E9·E12)과 나머지 탭은 2·3단계.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Input, message, Select, Space, Splitter, Tabs, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { AgGridReact } from 'ag-grid-react';
import { empApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { Emp03_Edit_Person } from './Emp03_Edit_Person';
import { Emp01_TabPage_Person } from './Emp01_TabPage_Person';
import { Emp02_TabPage_Others } from './Emp02_TabPage_Others';
import { Emp03_TabPage_Trans } from './Emp03_TabPage_Trans';

const gb = gbFor<TransInfo>();

/** AS-IS buildGrid() L332-367 (색인 Grid Spec) */
const buildGrid = () => [
  gb.text('parentFullNm', 240, '본부(부서)'),  // L337 orgInfoModel.parentFullName
  gb.text('korNm', 100, '성명'),  // L338 empPersonModel.korName
  gb.text('empNo', 80, '사번'),  // L339
  // L340 addOfficer: true면 "임원", 아니면 빈칸
  gb.text('officerYn', 80, '등기임원', { valueFormatter: p => (p.value === 'true' ? '임원' : ' ') }),
  gb.text('posNm', 80, '직위'),  // L341
  gb.text('titleNm', 100, '직책'),  // L342
  gb.text('kindNm', 80, '구분'),  // L343
  gb.booleanYn2('financeProYn', 80, '전문인력'),  // L344
  gb.date('hireDate', 100, '입사일'),  // L345
  gb.date('retireDate', 100, '퇴사일'),  // L346
  gb.date('expiryDate', 100, '계약만료일'),  // L347
  gb.text('officeDetail', 80, '내선번호'),  // L350
  gb.text('mobileTelNo', 120, '휴대폰'),  // L351
  gb.text('emailAddr', 240, '이메일'),  // L352
  gb.date('birthday', 100, '생년월일'),  // L353
  gb.textCenter('genderNm', 60, '성별'),  // L354
  gb.textCenter('orderSeq', 80, '출력순서'),  // L355
];

/** 하위 탭이 받는 값 (AS-IS InterfaceTabPage + transInfoGrid 참조) */
export interface TransInfoTabProps {
  /** 목록에서 선택한 행 */
  row?: TransInfo;
  /** 탭이 목록 행을 바꿨을 때 (AS-IS transInfoGrid.getStore().update / remove+add+select) */
  onRowChanged?: (updated: TransInfo, old: TransInfo) => void;
  /** 탭이 사원을 지웠을 때 (AS-IS transInfoGrid.getStore().remove) */
  onRowDeleted?: (row: TransInfo) => void;
}

/** 아직 변환하지 않은 탭 — 단계가 끝나면 실제 탭 컴포넌트로 바꾼다 (C01-작업방법 "단계") */
const PendingTab = (name: string, step: string): React.FC<TransInfoTabProps> => ({ row }) => (
  <div style={{ padding: 24, color: '#888' }}>
    {name}({step}) — 아직 변환하지 않은 탭입니다. {row ? `선택한 사원: ${row.korNm} (${row.empNo})` : ''}
  </div>
);

/** settings() L127-197: tabPanel.add(…) 순서 그대로 */
const TABS: { key: string; label: string; page: React.FC<TransInfoTabProps> }[] = [
  { key: 'person', label: '기본정보', page: Emp01_TabPage_Person },
  { key: 'others', label: '기타정보', page: Emp02_TabPage_Others },
  { key: 'trans', label: '일반발령', page: Emp03_TabPage_Trans },
  { key: 'deduct', label: '급여공제', page: PendingTab('Emp35_TabPage_DeductDate', '3단계') },
  { key: 'account', label: '급여계좌관리', page: PendingTab('Emp14_TabPage_Account', '3단계') },
  { key: 'family', label: '가족사항', page: PendingTab('Emp06_TabPage_Family', '3단계') },
  { key: 'career', label: '경력사항', page: PendingTab('Emp07_TabPage_Career', '3단계') },
  { key: 'academic', label: '학력정보', page: PendingTab('Emp05_TabPage_Academic', '3단계') },
  { key: 'license', label: '자격사항', page: PendingTab('Emp08_TabPage_License', '3단계') },
  { key: 'reward', label: '상벌내역', page: PendingTab('Emp11_TabPage_Reward', '3단계') },
  { key: 'evaluation', label: '고과(평가)내역', page: PendingTab('Emp09_TabPage_Evaluation', '3단계') },
  { key: 'event', label: '행사내역', page: PendingTab('Emp12_TabPage_Event', '3단계') },
  { key: 'project', label: '프로젝트', page: PendingTab('Emp13_TabPage_Project', '3단계') },
  { key: 'addTitle', label: '겸직발령', page: PendingTab('Emp04_TabPage_AddTitle', '3단계') },
  { key: 'relateFile', label: '연관파일', page: PendingTab('Emp18_TabPage_RelateFile', '3단계') },
  { key: 'education', label: '교육사항', page: PendingTab('Emp19_TabPage_education', '3단계') },
];

/** settings() L213-221: 재직구분 콤보 → retrieve() L389-402의 transCode */
const TRANS_NAMES: { label: string; code: string }[] = [
  { label: '전체', code: '000' },
  { label: '재직', code: '100' },
  { label: '겸직', code: '800' },
  { label: '퇴직', code: '900' },
];

export const Emp00_Tab_TransInfo: React.FC = () => {
  const gridRef = useRef<AgGridReact<TransInfo>>(null);
  const [transDate, setTransDate] = useState<Dayjs | null>(dayjs()); // settings() L204: 조회일자 = 오늘
  const [searchText, setSearchText] = useState('');
  const [transCode, setTransCode] = useState('100'); // settings() L220: "재직"
  const [rows, setRows] = useState<TransInfo[]>([]);
  const [selected, setSelected] = useState<TransInfo>();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const [editOpen, setEditOpen] = useState(false);
  const columnDefs = useMemo(buildGrid, []);

  /** rowData가 그리드에 반영된 뒤(onRowDataUpdated) 선택할 행 */
  const pendingSelect = useRef<number | undefined>(undefined);
  const selectRow = (transId: number) => { pendingSelect.current = transId; };
  const onRowDataUpdated = () => {
    const transId = pendingSelect.current;
    if (transId == null) return;
    pendingSelect.current = undefined;
    const node = gridRef.current?.api.getRowNode(String(transId));
    node?.setSelected(true, true);
    // 같은 ID의 행이 이미 선택돼 있으면 선택 이벤트가 없다 → 직접 넣는다
    setSelected(node?.data);
    if (node?.rowIndex != null) gridRef.current?.api.ensureIndexVisible(node.rowIndex);
  };

  // retrieve() L381-419: 서비스 emp.Emp00_TransInfo.selectByText(companyId, searchText, transDate, isSeparateAddTitle=true, transCode)
  //   → 첫 행 선택, 없으면 보이는 탭 init()
  const retrieve = useCallback(async (code = transCode) => {
    setLoading(true);
    try {
      const list = await empApi.searchTransInfos(transDate?.format('YYYY-MM-DD'), searchText, code);
      setRows(list);
      setSelected(undefined);
      if (list.length > 0) selectRow(list[0].transId);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [transDate, searchText, transCode]);

  // insert() L421-423: 팝업 Emp03_Edit_Person 열기
  const insert = () => setEditOpen(true);

  // Emp03_Edit_Person.update() 콜백: grid.getStore().add(transInfoModel) + select
  const onSaved = (saved: TransInfo) => {
    setRows(prev => [...prev, saved]);
    selectRow(saved.transId);
  };

  // 탭에서 목록 행을 바꿈: 같은 발령이면 제자리 교체, 새 발령이면 그 자리에 넣고 선택 (Emp03_TabPage_Trans.updateTransInfoGrid L257-270)
  const onRowChanged = useCallback((updated: TransInfo, old: TransInfo) => {
    setRows(prev => prev.map(r => (r.transId === old.transId ? updated : r)));
    setSelected(updated);
    selectRow(updated.transId);
  }, []);

  // 탭에서 사원을 지움 (Emp01_TabPage_Person.delete L276-277)
  const onRowDeleted = useCallback((row: TransInfo) => {
    setRows(prev => prev.filter(r => r.transId !== row.transId));
    setSelected(undefined);
  }, []);

  // [E0] 화면 열림 (생성자 L75-125) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  // [E10] tabPanel.Selection (L265) / [E11] grid.SelectionChanged [선택>0] (L273) → retrieveTabpage() L369-379:
  //   선택한 사원으로 지금 보이는 탭만 조회, 선택이 없으면 init() — 탭 컴포넌트가 row가 바뀌거나 탭이 열릴 때 조회한다
  const ActivePage = TABS.find(t => t.key === activeTab)!.page;

  return (
    <>
    <Splitter layout="vertical" style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel min={150}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 12px 0' }}>
          <Space wrap>
            <Typography.Text strong>조회일자</Typography.Text>
            <DatePicker style={{ width: 140 }} value={transDate} onChange={setTransDate} format="YYYY-MM-DD" />
            <Typography.Text strong>조직/사번/성명</Typography.Text>
            {/* [E2] searchText.KeyPress [Enter] (L206) → retrieve() */}
            <Input style={{ width: 120 }} value={searchText} onChange={e => setSearchText(e.target.value)} onPressEnter={() => retrieve()} />
            <Typography.Text strong>재직구분</Typography.Text>
            {/* [E3] transName[재직].Collapse (L222) → retrieve() */}
            <Select style={{ width: 100 }} value={transCode}
              options={TRANS_NAMES.map(t => ({ value: t.code, label: t.label }))}
              onChange={v => { setTransCode(v); retrieve(v); }} />
            {/* [E4] retrieveButton[조회].Select (L228) → retrieve() */}
            <Button type="search" onClick={() => retrieve()}>조회</Button>
            {/* [E5] insertButton[등록].Select (L234) → insert() */}
            <Button type="register" onClick={insert}>등록</Button>
            {/* [E6 생략] tempDownloadButton[템플릿] — 원본도 툴바에 넣지 않음(L91 주석) */}
            {/* [E7 생략] excelUploadButton[엑셀업로드](관리자만)·[E1]·[E12] 업로드 — 2단계 */}
            {/* [E9 생략] excelDownloadButton[다운로드]·[E8] — 2단계 */}
            <Button type="download" disabled title="2단계">다운로드</Button>
          </Space>
          <div style={{ flex: 1, minHeight: 0 }}>
            <SingleGrid<TransInfo>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              loading={loading}
              getRowId={p => String(p.data.transId)}
              onSelect={setSelected}
              onRowDataUpdated={onRowDataUpdated}
            />
          </div>
        </div>
      </Splitter.Panel>
      <Splitter.Panel defaultSize={450} max={900} min={100}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '0 12px' }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={TABS.map(t => ({ key: t.key, label: t.label }))}
            style={{ flex: 'none', marginBottom: 0 }}
          />
          <div style={{ flex: 1, minHeight: 0 }}>
            <ActivePage row={selected} onRowChanged={onRowChanged} onRowDeleted={onRowDeleted} />
          </div>
        </div>
      </Splitter.Panel>
    </Splitter>
    <Emp03_Edit_Person open={editOpen} onClose={() => setEditOpen(false)} onSaved={onSaved} />
    </>
  );
};
