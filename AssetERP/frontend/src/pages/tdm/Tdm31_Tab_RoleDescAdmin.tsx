/**
 * [1493] 기초자료 > 10. 책무 > 책무기술서 재생성 (E11)
 * AS-IS: myApp/client/vi/tdm/Tdm31_Tab_RoleDescAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L82-119: 가운데 = 툴바(고객사 200 · 조회기간 [시작 100 ~ 종료 100] · 전체보기 · 검색 250 "직책/담당임원" · 상신건만 조회 · [조회][재생성]) + 책무기술서 그리드(행번호, 체크박스 다중)
 * 재생성은 RD 리포트 서버 PDF 생성이 TOBE에 없어 서버가 거절한다(RoleDescPdfMaker 기본 구현, docs/work/E/E11-작업방법.md "다음 단계")
 * UX보강(10): 툴바 = SearchBar(UX-01)
 */
import React, { useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { fileApi } from '@/api/file';
import { tdmApi } from '@/api/tdm';
import { FileInfo } from '@/types/sys';
import { TdmRoleDesc } from '@/types/tdm';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys01_Lookup_Company } from '@/components/lookup/Sys01_Lookup_Company';
import { SearchBar } from '@/components/search';
import { Sys10_Lookup_FileViewer } from '../sys/Sys10_Lookup_FileViewer';

type Row = TdmRoleDesc & { rowKey: string };

const gb = gbFor<Row>();
const FORMAT = 'YYYY-MM-DD';
const APPR_SENT = ['10', '20', '30'];                                 // 상신(결재 진행·완료) 상태 코드

export const Tdm31_Tab_RoleDescAdmin: React.FC = () => {
  // [E0] 화면 열림 (생성자 L82-119) → settings() L121-203: 기간 올해 1/1~오늘(전체보기라 비활성), 고객사 ADMIN, 전체보기·상신건만 조회 체크 — 열 때 조회는 하지 않는다
  const gridRef = useRef<AgGridReact<Row>>(null);
  const [companyId, setCompanyId] = useState<number | undefined>(0);   // private Long companyId = 0l, 전체 = null
  const [companyName, setCompanyName] = useState('ADMIN');             // companyField.setText("ADMIN")
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().startOf('year'));   // yyyy-01-01
  const [closeDate, setCloseDate] = useState<Dayjs>(dayjs());          // LoginUser.getToday()
  const [notPeriodYn, setNotPeriodYn] = useState(true);                // notPeriodYn "전체보기" = true → 기간 칸 비활성
  const [searchText, setSearchText] = useState('');
  const [endYn, setEndYn] = useState(true);                            // endYn "상신건만 조회" = true
  const [rows, setRows] = useState<Row[]>([]);
  const [lookupCompany, setLookupCompany] = useState(false);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);
  const [progress, setProgress] = useState<{ text: React.ReactNode; done: boolean } | null>(null);   // messageBox "파일 재생성"

  // retrieve() L235-269: 서비스 tdm.Tdm31_RoleDesc.selectByRegDateAdmin(companyId(전체면 null), startDate, closeDate, "%검색어%", endYn, notPeriodYn)
  const retrieve = async (over?: { notPeriodYn?: boolean; endYn?: boolean }) => {
    try {
      const list = await tdmApi.searchRoleDescs({
        companyId,
        startDate: startDate.format(FORMAT),
        closeDate: closeDate.format(FORMAT),
        searchText,
        endYn: over?.endYn ?? endYn,
        notPeriodYn: over?.notPeriodYn ?? notPeriodYn,
      });
      setRows(list.map((r, i) => ({ ...r, rowKey: `${r.roleDescId}_${i}` })));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E2] companyField.TriggerClick [result != null] (L148) → Sys01_Lookup_Company.open(): 고른 회사로 바꾸고, 선택안함이면 "전체"(null)
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

  // viewRd() L393-434: CreateTdmRoleDesc → RD 뷰어(Tdm31_Rd_DescRpt) — RD 연동이 없어 열 수 없다
  const viewRd = () => {
    message.warning('RD 뷰어 연동이 없어 책무기술서를 열 수 없습니다.');
  };

  // viewFile() L535-555: 첨부(sys10_file)가 있으면 Sys10_Lookup_FileViewer.open(fileId), 없으면 "파일생성실패로인한 RD뷰어호출" 후 viewRd()
  const viewAttached = async (row: Row) => {
    try {
      const files = await fileApi.searchByParentId(row.roleDescId);
      if (files.length > 0) {
        setViewFile(files[0]);
      } else {
        message.info('파일생성실패로인한 RD뷰어호출');
        viewRd();
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // buildGrid() L205-233 actionCell01(ImageCell "View"): 결재상태 10·20·30이면 viewFile(), 아니면 viewRd()
  const onView = (row: Row) => {
    if (row.apprStatusCode && APPR_SENT.includes(row.apprStatusCode)) void viewAttached(row);
    else viewRd();
  };

  // [E6] reCreateButton[재생성].Select (L196) → reCreateFile() L466-498 → processRecreate() L500-533: 고른 행을 차례로 한 건씩
  const reCreateFile = async () => {
    const list = (gridRef.current?.api?.getSelectedRows() ?? []) as Row[];
    if (list.length === 0) return void message.warning('재생성할 데이터를 선택해주세요');
    setProgress({ text: '파일 생성준비중 ...', done: false });
    for (let i = 0; i < list.length; i++) {
      const row = list[i];
      const who = `${row.companyName ?? ''} ${row.personName ?? ''}`;
      const head = <>파일 재생성 ({i + 1}/{list.length})<br /></>;
      setProgress({ text: <>{head}파일 생성준비중 [{who}]</>, done: false });
      try {
        await tdmApi.recreateRoleDesc(row.roleDescId);
      } catch (err) {
        setProgress({ text: <>파일 생성실패 [{who}]<br /><span style={{ color: '#888' }}>{errorMessage(err, '재생성 실패')}</span></>, done: true });
        return;
      }
    }
    setProgress({ text: `${list.length}개의 파일이 전부 재생성이 완료되었습니다.`, done: true });
  };

  const columnDefs = useMemo(() => [
    gb.date('regDate', 90, '생성일'),
    gb.text('reasonName', 180, '생성사유'),
    gb.text('companyName', 180, '회사명'),
    gb.textCenter('personName', 90, '임원명'),
    gb.date('allcStdDate', 90, '임원의 최종<br>책무배분일'),
    gb.text('roleName', 200, '(본)직책'),
    gb.text('addTitle', 300, '겸직사항'),
    iconCell<Row>('view', 'actionCell', 80, '책무기술서', onView),
    gb.textStatus('apprStatusName', 80, '결재상태'),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E5] retrieveButton[조회].Select (L189), [E4] searchText.KeyPress [Enter] (L180) → retrieve() */}
      <SearchBar onSearch={() => retrieve()} extra={<Button type="reset" onClick={reCreateFile}>재생성</Button>}>
        <SearchBar.Field label="고객사">
          <LookupInput value={companyName} onOpen={() => setLookupCompany(true)} onClear={() => onCompanyResult(null)} />
        </SearchBar.Field>
        <SearchBar.Field label="조회기간">
          <DatePicker style={{ width: 140 }} allowClear={false} disabled={notPeriodYn} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
          ~
          <DatePicker style={{ width: 140 }} allowClear={false} disabled={notPeriodYn} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
          {/* [E1] notPeriodYn[전체보기].ValueChange (L134) → 기간 칸 사용 여부 + retrieve() */}
          <Checkbox checked={notPeriodYn} onChange={e => { setNotPeriodYn(e.target.checked); void retrieve({ notPeriodYn: e.target.checked }); }}>전체보기</Checkbox>
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 250 }} placeholder="직책/담당임원" value={searchText} onChange={e => setSearchText(e.target.value)} />
          {/* [E3] endYn[상신건만 조회].Change (L171) → retrieve() */}
          <Checkbox checked={endYn} onChange={e => { setEndYn(e.target.checked); void retrieve({ endYn: e.target.checked }); }}>상신건만 조회</Checkbox>
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<Row> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => p.data.rowKey} />
      </div>
      <Sys01_Lookup_Company open={lookupCompany} onResult={onCompanyResult} onClose={() => setLookupCompany(false)} />
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
      {/* messageBox "파일 재생성" (L466-498): 430×170, 진행 중 닫을 수 없고 끝나면 [닫기] — [E7] button01[닫기].Select (L486) */}
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
