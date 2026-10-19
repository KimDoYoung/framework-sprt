/**
 * [1326] 문서작성 > 02. 문서검색 > 문서 다운로드 (F09, 1단계)
 * AS-IS: myApp/client/vi/dcr/Dcr00_Tab_ApprList.java (343줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L94-107: 위 툴바(등록기간 · 문서분류(300) · 검색(330) · [조회] [다운로드] [기록보기]) + 문서 그리드(체크박스 다중)
 * 1단계(F01~F08과 같은 사유): 보기 아이콘이 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다른 도메인(apr)이라 다음 단계에서 연결한다 — 지금은 안내만 띄운다.
 * 다음 단계: makePDF() L263-293(utils.pdf.PDFCreate.createInPDF7 = Apr10_StampPDF7.getInDocument: 본문 파일이 없는 사내문서의 PDF 만들기)는
 *   전자결재 PDF 생성기(apr 도메인)라 옮기지 않았다 — 지금은 이미 있는 본문·첨부파일만 묶어 내려준다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 원본에 초기화가 없어 UX-02는 넣지 않는다
 */
import React, { useMemo, useRef, useState } from 'react';
import { DatePicker, Modal, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { aprApi } from '@/api/apr';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { fileApi } from '@/api/file';
import { DcrDocAppr } from '@/types/dcr';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Apr40_Lookup_DownloadHistory } from '../apr/Apr40_Lookup_DownloadHistory';
import { Dcr01_Lookup_DcrClass } from './Dcr01_Lookup_DcrClass';

const gb = gbFor<DcrDocAppr>();
const DATE_FORMAT = 'YYYY-MM-DD';
const ALL_TEXT = '전체';

export const Dcr00_Tab_ApprList: React.FC = () => {
  // [E0] 화면 열림 (생성자 L77-79) → init() L81-92 — 등록기간 = 오늘 -1개월 ~ 오늘, 문서분류 "전체". 열 때 자동 조회는 없다
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(1, 'month'));
  const [endDate, setEndDate] = useState<Dayjs>(() => dayjs());
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [classTreeName, setClassTreeName] = useState(ALL_TEXT);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<DcrDocAppr[]>([]);
  const [checked, setChecked] = useState<DcrDocAppr[]>([]);
  const [loading, setLoading] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const seq = useRef(0);

  // [E2] searchText.KeyPress [Enter] (L138)·[E3] retrieveButton[조회].Select (L146) → retrieve() L218-236: dcr.Dcr00_DocList.getAppr
  const retrieve = async () => {
    const my = ++seq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await dcrApi.searchDocApprs({
        classTreeId: classTreeId ?? undefined,
        startDate: startDate.format(DATE_FORMAT),
        endDate: endDate.format(DATE_FORMAT),
        searchText,
      });
      if (my !== seq.current) return;
      setRows(list);
      setChecked([]);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  // [E6] msgBox.DialogHide [YES] (L246) → makePDF() L263-293 → fileDownload() L295-319: FileDownload?fileType=apprList&selectList=고른 문서 ID들 → zip, 그리고 insertHistory() L321-334
  // [E6 일부 생략] makePDF()의 PDF 만들기(createInPDF7)는 다음 단계 — 바로 fileDownload()로 간다
  const fileDownload = async () => {
    const apprIds = checked.map(r => r.apprId);
    try {
      await fileApi.downloadApprZip(apprIds);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
      return;
    }
    // insertHistory(selectList) L321-334: apr.Apr40_DownloadHistory.updateList (결과는 보지 않는다)
    void aprApi.createDownloadHistories(apprIds).catch(() => undefined);
  };

  // [E4] downloadButton[다운로드].Select (L152) → downloadChk() L238-261
  const downloadChk = () => {
    if (checked.length === 0) {
      message.warning('문서를 선택해주세요');
      return;
    }
    Modal.confirm({
      title: '다운로드',
      content: `${checked.length}건의 문서를 내려받으시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 320,
      onOk: fileDownload,
    });
  };

  // buildGrid() L170-216 (체크박스 다중 선택)
  const columnDefs = useMemo(() => [
    // L171-187 actionCell(View) → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, callback)
    // [L171 생략] 편집창은 다음 단계
    iconCell<DcrDocAppr>('view', 'actionCell', 40, ' ', () => message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다')),
    gb.text('classTreeName', 500, '문서분류'),
    gb.date('regDate', 100, '등록일'),
    gb.textCenter('inoutName', 70, '문서구분'),
    gb.text('aprTitle', 500, '상신제목'),
    gb.textCenter('empName', 100, '등록자'),
    gb.long('fileCount', 50, '파일갯수'),
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        <SearchBar
          onSearch={() => void retrieve()}
          searchText="조회"
          loading={loading}
          extra={
            <>
              <Button type="download" onClick={downloadChk}>다운로드</Button>
              {/* [E5] historyButton[기록보기].Select (L158) → Apr40_Lookup_DownloadHistory.open() */}
              <Button type="view" onClick={() => setHistoryOpen(true)}>기록보기</Button>
            </>
          }
        >
          <SearchBar.Field label="등록기간">
            <DatePicker style={{ width: 140 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
            <span>~</span>
            <DatePicker style={{ width: 140 }} allowClear={false} value={endDate} onChange={d => d && setEndDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="문서분류">
            {/* [E1] classTreeName.TriggerClick [result == null] (L118) → Dcr01_Lookup_DcrClass.open(오늘): [전체]면 "전체"·classTreeId null */}
            <LookupInput
              value={classTreeName}
              width={300}
              placeholder="전체"
              onOpen={() => setClassOpen(true)}
              onClear={() => { setClassTreeId(null); setClassTreeName(ALL_TEXT); }}
            />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 330 }} placeholder="상신제목/등록자/부서명/비고" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<DcrDocAppr>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.apprId)}
            loading={loading}
            onCheckedChange={setChecked}
          />
        </div>
      </div>
      <Dcr01_Lookup_DcrClass
        open={classOpen}
        onResult={r => { setClassTreeId(r.classTreeId); setClassTreeName(r.classTreeFullName); }}
        onAll={() => { setClassTreeId(null); setClassTreeName(ALL_TEXT); }}
        onClose={() => setClassOpen(false)}
      />
      <Apr40_Lookup_DownloadHistory open={historyOpen} onClose={() => setHistoryOpen(false)} />
    </div>
  );
};
