/**
 * [1498] 기초자료 > 10. 책무 > 책무체계도 재생성 (E12)
 * AS-IS: myApp/client/vi/tdm/Tdm32_Tab_RoleDigmAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L77-108: 가운데 = 툴바(고객사 200 · 조회기간 [시작 100 ~ 종료 100] · 전체보기 · [조회][재생성]) + 책무체계도 그리드(행번호, 체크박스 다중)
 * 재생성은 RD 리포트 서버 PDF 생성이 TOBE에 없어 서버가 거절한다(RoleDigmPdfMaker 기본 구현, docs/work/E/E12-작업방법.md "다음 단계")
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
import { TdmRoleDigm } from '@/types/tdm';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { Sys01_Lookup_Company } from '@/components/lookup/Sys01_Lookup_Company';
import { SearchBar } from '@/components/search';
import { Sys10_Lookup_FileViewer } from '../sys/Sys10_Lookup_FileViewer';

type Row = TdmRoleDigm & { rowKey: string };

const gb = gbFor<Row>();
const FORMAT = 'YYYY-MM-DD';
const APPR_SENT = ['10', '20', '30'];                                 // 상신(결재 진행·완료) 상태 코드

export const Tdm32_Tab_RoleDigmAdmin: React.FC = () => {
  // [E0] 화면 열림 (생성자 L77-108) → settings() L110-172: 기간 올해 1/1~오늘(전체보기라 비활성), 고객사 ADMIN, 전체보기 체크 — 열 때 조회는 하지 않는다
  const gridRef = useRef<AgGridReact<Row>>(null);
  const [companyId, setCompanyId] = useState<number | undefined>(0);   // private Long companyId = 0l, 전체 = null
  const [companyName, setCompanyName] = useState('ADMIN');             // companyField.setText("ADMIN")
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().startOf('year'));   // yyyy-01-01
  const [closeDate, setCloseDate] = useState<Dayjs>(dayjs());          // LoginUser.getToday()
  const [notPeriodYn, setNotPeriodYn] = useState(true);                // notPeriodYn "전체보기" = true → 기간 칸 비활성
  const [rows, setRows] = useState<Row[]>([]);
  const [lookupCompany, setLookupCompany] = useState(false);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);
  const [progress, setProgress] = useState<{ text: React.ReactNode; done: boolean } | null>(null);   // messageBox "파일 재생성"

  // [E3] retrieveButton[조회].Select (L158) → retrieve() L241-274: 서비스 tdm.Tdm32_RoleDigm.selectByRegDateAdmin(companyId(전체면 null), startDate, closeDate, endYn=true 고정, notPeriodYn)
  const retrieve = async (over?: { notPeriodYn?: boolean }) => {
    try {
      const list = await tdmApi.searchRoleDigms({
        companyId,
        startDate: startDate.format(FORMAT),
        closeDate: closeDate.format(FORMAT),
        endYn: true,
        notPeriodYn: over?.notPeriodYn ?? notPeriodYn,
      });
      setRows(list.map((r, i) => ({ ...r, rowKey: `${r.roleDigmId}_${i}` })));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E2] companyField.TriggerClick [result != null] (L137) → Sys01_Lookup_Company.open(): 고른 회사로 바꾸고, 선택안함이면 "전체"(null)
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

  // viewRd() L312-353: CreateTdmRoleDigm → RD 뷰어(Tdm32_Rd_DigmRpt) — RD 연동이 없어 열 수 없다
  const viewRd = () => {
    message.warning('RD 뷰어 연동이 없어 책무체계도를 열 수 없습니다.');
  };

  // openRelateFile02() L295-310: 파일정보 ID의 첫 첨부(sys10_file)를 Sys10_Lookup_FileViewer로 연다
  const openRelateFile02 = async (roleDigmFileId: number) => {
    const files = await fileApi.searchByParentId(roleDigmFileId);
    if (files.length > 0) setViewFile(files[0]);
    else message.info('열 수 있는 파일이 없습니다.');             // 원본은 result.getResult(0)이 비어 있으면 오류가 난다
  };

  // openRelateFile01() L276-293: selectByFileType(roleDigmId, useFileType) 첫 건이 있으면 파일 열기, 없으면 viewRd()
  const openRelateFile01 = async (row: Row) => {
    const ids = await tdmApi.getRoleDigmFileIds(row.roleDigmId, row.useFileType ?? '');
    if (ids.length !== 0) await openRelateFile02(ids[0]);
    else viewRd();
  };

  // buildGrid() L174-239 actionCell01(ImageCell "View"): 결재상태 10·20·30이면 openRelateFile01(), 아니면 fileType "2"가 정확히 1건일 때 그 파일, 아니면 viewRd()
  const onView = async (row: Row) => {
    try {
      if (row.apprStatusCode && APPR_SENT.includes(row.apprStatusCode)) {
        await openRelateFile01(row);
      } else {
        const ids = await tdmApi.getRoleDigmFileIds(row.roleDigmId, '2');
        if (ids.length === 1) await openRelateFile02(ids[0]);
        else viewRd();
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E4] reCreateButton[재생성].Select (L165) → reCreateFile() L355-387 → processRecreate() L389-422: 고른 행을 차례로 한 건씩
  const reCreateFile = async () => {
    const list = (gridRef.current?.api?.getSelectedRows() ?? []) as Row[];
    if (list.length === 0) return void message.warning('재생성할 데이터를 선택해주세요');
    setProgress({ text: '파일 생성준비중 ...', done: false });
    for (let i = 0; i < list.length; i++) {
      const row = list[i];
      const who = row.companyName ?? '';
      const head = <>파일 재생성 ({i + 1}/{list.length})<br /></>;
      setProgress({ text: <>{head}파일 생성준비중 [{who}]</>, done: false });
      try {
        await tdmApi.recreateRoleDigm(row.roleDigmId);
      } catch (err) {
        setProgress({ text: <>파일 생성실패 [{who}]<br /><span style={{ color: '#888' }}>{errorMessage(err, '재생성 실패')}</span></>, done: true });
        return;
      }
    }
    setProgress({ text: `${list.length}개의 파일이 전부 재생성이 완료되었습니다.`, done: true });
  };

  const columnDefs = useMemo(() => [
    gb.text('companyName', 180, '회사명'),
    gb.date('regDate', 120, '생성일'),
    gb.date('allcStdDate', 120, '책무배분기준일'),
    gb.text('reasonName', 300, '생성사유'),
    iconCell<Row>('view', 'actionCell', 80, '책무체계도', row => { void onView(row); }),
    gb.text('useFileTypeName', 150, '사용파일구분'),
    gb.textStatus('apprStatusName', 80, '결재상태'),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <SearchBar onSearch={() => retrieve()} extra={<Button type="reset" onClick={reCreateFile}>재생성</Button>}>
        <SearchBar.Field label="고객사">
          <Input readOnly style={{ width: 200, cursor: 'pointer' }} value={companyName} suffix={<SearchOutlined />} onClick={() => setLookupCompany(true)} />
        </SearchBar.Field>
        <SearchBar.Field label="조회기간">
          <DatePicker style={{ width: 140 }} allowClear={false} disabled={notPeriodYn} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
          ~
          <DatePicker style={{ width: 140 }} allowClear={false} disabled={notPeriodYn} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
          {/* [E1] notPeriodYn[전체보기].ValueChange (L123) → 기간 칸 사용 여부 + retrieve() */}
          <Checkbox checked={notPeriodYn} onChange={e => { setNotPeriodYn(e.target.checked); void retrieve({ notPeriodYn: e.target.checked }); }}>전체보기</Checkbox>
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<Row> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => p.data.rowKey} />
      </div>
      <Sys01_Lookup_Company open={lookupCompany} onResult={onCompanyResult} onClose={() => setLookupCompany(false)} />
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
      {/* messageBox "파일 재생성" (L355-387): 430×170, 진행 중 닫을 수 없고 끝나면 [닫기] — [E5] button01[닫기].Select (L375) */}
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
