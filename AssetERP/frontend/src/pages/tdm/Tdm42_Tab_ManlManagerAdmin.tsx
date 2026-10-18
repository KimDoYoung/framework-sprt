/**
 * [1502] 기초자료 > 10. 책무 > 책무매뉴얼 재생성 (E13, 1단계)
 * AS-IS: myApp/client/vi/tdm/Tdm42_Tab_ManlManagerAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L88-125: 가운데 = 툴바(고객사 200 · 부서 270 · 조회기간(적용시작일) [시작 ~ 종료] · 전체보기 · 검색 200 · [조회][재생성]) + 책무매뉴얼 그리드(행번호, 체크박스 다중, 건수 묶음 헤더, 합계 행)
 * 재생성은 RD 리포트 서버 PDF 생성이 TOBE에 없어 서버가 거절한다(ManlOrgPdfMaker 기본 구현, docs/work/E/E13-작업방법.md "다음 단계")
 * 점검항목 조회창 Tdm43_Lookup_ManlItem까지 1단계 — 등록·수정창 Tdm43_Edit_Manl 등은 E13-2
 * UX보강(10): 툴바 = SearchBar(UX-01)
 */
import React, { useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, Input, message, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { fileApi } from '@/api/file';
import { tdmApi } from '@/api/tdm';
import { FileInfo } from '@/types/sys';
import { OrgTdm } from '@/types/emp';
import { TdmManlOrg } from '@/types/tdm';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { Org00_Lookup_SelectTdm } from '@/components/lookup/Org00_Lookup_SelectTdm';
import { Sys01_Lookup_Company } from '@/components/lookup/Sys01_Lookup_Company';
import { SearchBar } from '@/components/search';
import { Sys10_Lookup_FileViewer } from '../sys/Sys10_Lookup_FileViewer';
import { Tdm43_Lookup_ManlItem } from './Tdm43_Lookup_ManlItem';
import { dynamicViewCell } from './tdmGridCells';

type Row = TdmManlOrg & { rowKey: string };

const gb = gbFor<Row>();
const FORMAT = 'YYYY-MM-DD';
const APPR_SENT = ['10', '20', '30'];                                 // 상신(결재 진행·완료) 상태 코드

export const Tdm42_Tab_ManlManagerAdmin: React.FC = () => {
  // [E0] 화면 열림 (생성자 L88-125) → settings() L127-224: 기간 올해 1/1~오늘(전체보기라 비활성), 고객사 ADMIN, 부서 전체, 전체보기 체크 — 열 때 조회는 하지 않는다(retrieve 호출이 주석)
  const gridRef = useRef<AgGridReact<Row>>(null);
  const [companyId, setCompanyId] = useState<number | undefined>(0);   // private Long companyId = 0l, 전체 = null
  const [companyName, setCompanyName] = useState('ADMIN');             // companyField.setText("ADMIN")
  const [orgId, setOrgId] = useState<number | undefined>(undefined);   // private Long orgId = null
  const [orgName, setOrgName] = useState('');                          // orgLookup 빈칸="전체"
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().startOf('year'));   // yyyy-01-01
  const [closeDate, setCloseDate] = useState<Dayjs>(dayjs());          // LoginUser.getToday()
  const [notPeriodYn, setNotPeriodYn] = useState(true);                // notPeriodYn "전체보기" = true → 기간 칸 비활성
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [lookupCompany, setLookupCompany] = useState(false);
  const [lookupOrg, setLookupOrg] = useState(false);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);
  const [itemOrg, setItemOrg] = useState<TdmManlOrg | null>(null);     // Tdm43_Lookup_ManlItem
  const [progress, setProgress] = useState<{ text: React.ReactNode; done: boolean } | null>(null);   // messageBox "파일 재생성"

  // [E1] notPeriodYn[전체보기].ValueChange (L140)·[E4] searchText.KeyPress [Enter] (L201)·[E5] retrieveButton[조회].Select (L210) → retrieve() L268-304
  // 서비스 tdm.Tdm42_ManlOrg.selectByText(companyId(전체면 null), orgId, "%검색어%", useYn=false, adminYn=true, notPeriodYn, startDate, closeDate)
  const retrieve = async (over?: { notPeriodYn?: boolean }) => {
    try {
      const list = await tdmApi.searchManlOrgs({
        companyId,
        orgId,
        searchText,
        notPeriodYn: over?.notPeriodYn ?? notPeriodYn,
        startDate: startDate.format(FORMAT),
        closeDate: closeDate.format(FORMAT),
      });
      setRows(list.map((r, i) => ({ ...r, rowKey: `${r.manlOrgId}_${i}` })));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E3] companyField[ADMIN].TriggerClick [result != null] (L178) → Sys01_Lookup_Company.open(): 고른 회사로 바꾸고, 선택안함이면 "전체"(null)
  const onCompanyResult = (company: { companyId: number; companyNm: string } | null) => {
    setLookupCompany(false);
    if (company) {
      setCompanyId(company.companyId);
      setCompanyName(company.companyNm);
    } else {
      setCompanyId(undefined);
      setCompanyName('전체');
    }
  };

  // [E2] orgLookup.TriggerClick [result != null] (L157) → Org00_Lookup_SelectTdm.openAll(오늘, null, true, …): 고른 조직으로 바꾸고, [전체]면 비운다(orgId null)
  const onOrgResult = (org: OrgTdm | null) => {
    setOrgId(org ? org.orgCodeId : undefined);
    setOrgName(org ? (org.korNm ?? '') : '');
  };

  // viewRd() L318-360: CreateTdmManlOrg → RD 뷰어(Tdm42_Rd_Manual) — RD 연동이 없어 열 수 없다
  const viewRd = () => {
    message.warning('RD 뷰어 연동이 없어 책무매뉴얼을 열 수 없습니다.');
  };

  // viewFile() L362-382: sys.Sys10_File.selectByParentId(manlOrgId) 첫 건을 Sys10_Lookup_FileViewer로, 없으면 "파일생성실패로인한 RD뷰어호출" 후 viewRd()
  const viewManlFile = async (row: Row) => {
    const files = await fileApi.searchByParentId(row.manlOrgId);
    if (files.length > 0) {
      setViewFile(files[0]);
    } else {
      message.info('파일생성실패로인한 RD뷰어호출');
      viewRd();                                                      // 혹시나 파일생성 안됬을시 RD뷰어 호출
    }
  };

  // buildGrid() L226-266 startDateYnStr viewCell(ImageCell "View"): 결재상태 10·20·30이면 viewFile(), 아니면 viewRd()
  const onViewManl = async (row: Row) => {
    try {
      if (row.apprStatusCode && APPR_SENT.includes(row.apprStatusCode)) await viewManlFile(row);
      else viewRd();
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // buildGrid() L226-266 actionCell editCell(ImageCell "View") → lookupDetail() L306-316: Tdm43_Lookup_ManlItem.open(manlOrgId, lockYn, roleName, orgName)
  const lookupDetail = (row: Row) => setItemOrg(row);

  // [E6] reCreateButton[재생성].Select (L217) → reCreateFile() L384-416 → processRecreate() L418-449: 고른 행을 차례로 한 건씩
  // 한 건이 실패해도 멈추지 않고 다음 건으로 간다(afterComplete.run()). 끝나면 "N개의 파일이 전부 재생성이 완료되었습니다." (TOBE 추가: 실패한 건의 서버 사유를 아래에 덧붙인다)
  const reCreateFile = async () => {
    const list = (gridRef.current?.api?.getSelectedRows() ?? []) as Row[];
    if (list.length === 0) return void message.warning('재생성할 데이터를 선택해주세요');
    setProgress({ text: '파일 생성준비중 ...', done: false });
    const failures: string[] = [];
    for (let i = 0; i < list.length; i++) {
      const row = list[i];
      const who = `${row.roleName ?? ''} ${row.exctName ?? ''}`;
      setProgress({ text: <>파일 재생성 ({i + 1}/{list.length})<br />파일 생성준비중 [{who}]</>, done: false });
      try {
        await tdmApi.recreateManlOrg(row.manlOrgId);
      } catch (err) {
        failures.push(`파일 생성실패 [${who}] ${errorMessage(err, '재생성 실패')}`);
      }
    }
    setProgress({
      text: <>
        {list.length}개의 파일이 전부 재생성이 완료되었습니다.
        {failures.map((f, i) => <div key={i} style={{ color: '#888', marginTop: 4 }}>{f}</div>)}
      </>,
      done: true,
    });
  };

  // buildGrid() L226-266. 묶음 헤더 "건수"(HeaderGroupMap(0,7), 5열: 책무~점검항목 + 아이콘 열), getSumGrid("", 2, 6, 9): 조직 열 라벨 없음, 합계는 6~9번째 열(원본은 작성완료일·책무·책무세부·관리의무 — 점검항목은 빠져 있음)
  const columnDefs = useMemo(() => [
    gb.text('companyName', 180, '회사명'),  // L236
    gb.text('orgName', 200, '지원부서'),  // L237
    gb.text('roleName', 200, '직책'),  // L238
    gb.textCenter('exctName', 100, '임원'),  // L239
    gb.booleanYn2('manlDutyEndYn', 70, '작성완료'),  // L240
    gb.date('manlDutyEndDate', 100, '작성완료일'),  // L241
    {
      ...gb.group('건수', [
        gb.longCenter('taskCnt', 80, '책무'),  // L242
        gb.longCenter('taskRelateDetailCnt', 80, '책무세부'),  // L243
        gb.longCenter('taskRelateDutyCnt', 80, '관리의무'),  // L244
        gb.longCenter('manlCnt', 80, '점검항목'),  // L245
        iconCell<Row>('view', 'actionCell', 30, ' ', row => lookupDetail(row)),  // L246 addCell(editCell)
      ]),
    },
    gb.date('startDate', 100, '적용시작일'),  // L247
    gb.date('endDate', 100, '적용종료일'),  // L248
    dynamicViewCell<Row>('startDateYnStr', 'startDateYnStr', 80, '책무매뉴얼', row => { void onViewManl(row); }),  // L249 addDynamicCell(viewCell)
    gb.textStatus('apprStatusName', 100, '결재상태'),  // L250
    gb.text('jobName', 200, '작업명'),  // L251
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <SearchBar onSearch={() => retrieve()} extra={<Button type="reset" onClick={reCreateFile}>재생성</Button>}>
        <SearchBar.Field label="고객사">
          <Input readOnly style={{ width: 200, cursor: 'pointer' }} value={companyName} suffix={<SearchOutlined />} onClick={() => setLookupCompany(true)} />
        </SearchBar.Field>
        <SearchBar.Field label="부서">
          <Input readOnly style={{ width: 270, cursor: 'pointer' }} placeholder="전체" value={orgName} suffix={<SearchOutlined />} onClick={() => setLookupOrg(true)} />
        </SearchBar.Field>
        <SearchBar.Field label="조회기간(적용시작일)">
          <DatePicker style={{ width: 140 }} allowClear={false} disabled={notPeriodYn} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
          ~
          <DatePicker style={{ width: 140 }} allowClear={false} disabled={notPeriodYn} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
          {/* [E1] notPeriodYn[전체보기].ValueChange (L140) → 기간 칸 사용 여부 + retrieve() */}
          <Checkbox checked={notPeriodYn} onChange={e => { setNotPeriodYn(e.target.checked); void retrieve({ notPeriodYn: e.target.checked }); }}>전체보기</Checkbox>
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          {/* [E4] searchText.KeyPress [Enter] (L201) → retrieve() */}
          <SearchBar.Input style={{ width: 200 }} placeholder="직책/임원" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<Row>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => p.data.rowKey}
          sumRow={{ labelField: 'orgName', label: '', sum: ['taskCnt', 'taskRelateDetailCnt', 'taskRelateDutyCnt'] }}
        />
      </div>
      <Sys01_Lookup_Company open={lookupCompany} onResult={onCompanyResult} onClose={() => setLookupCompany(false)} />
      <Org00_Lookup_SelectTdm stdDate={lookupOrg ? dayjs().format(FORMAT) : undefined} single allButton onClose={() => setLookupOrg(false)} onSelect={onOrgResult} />
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
      <Tdm43_Lookup_ManlItem manlOrg={itemOrg} onClose={() => setItemOrg(null)} />
      {/* messageBox "파일 재생성" (L384-416): 430×170, 진행 중 닫을 수 없고 끝나면 [닫기] — [E7] button01[닫기].Select (L404) */}
      <Modal
        open={progress !== null}
        title="파일 재생성"
        width={430}
        closable={false}
        maskClosable={false}
        keyboard={false}
        footer={<Button type="close" disabled={!progress?.done} onClick={() => setProgress(null)}>닫기</Button>}
      >
        {progress?.text}
      </Modal>
    </div>
  );
};
