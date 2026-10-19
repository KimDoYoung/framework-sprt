/**
 * [1224] 문서작성 > 02. 문서검색 > 문서별 첨부파일 검색 (F08, 1단계)
 * AS-IS: myApp/client/vi/dcr/Dcr00_Tab_FileList.java (278줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L89-102: 위 툴바(등록기간 · 문서분류(300) · 검색(330) · [조회] [다운로드]) + 문서 첨부파일 그리드(체크박스 다중)
 * 1단계(F01~F07과 같은 사유): 보기 아이콘이 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다른 도메인(apr)이라 다음 단계에서 연결한다 — 지금은 안내만 띄운다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 원본에 초기화가 없어 UX-02는 넣지 않는다
 */
import React, { useMemo, useRef, useState } from 'react';
import { DatePicker, Modal, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { fileApi } from '@/api/file';
import { DcrDocFile } from '@/types/dcr';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Dcr01_Lookup_DcrClass } from './Dcr01_Lookup_DcrClass';

const gb = gbFor<DcrDocFile>();
const DATE_FORMAT = 'YYYY-MM-DD';
const ALL_TEXT = '전체';

export const Dcr00_Tab_FileList: React.FC = () => {
  // [E0] 화면 열림 (생성자 L72-74) → init() L76-87 — 조회기간 = 오늘 -1개월 ~ 오늘, 문서분류 "전체". 열 때 자동 조회는 없다
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(1, 'month'));
  const [endDate, setEndDate] = useState<Dayjs>(() => dayjs());
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [classTreeName, setClassTreeName] = useState(ALL_TEXT);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<DcrDocFile[]>([]);
  const [checked, setChecked] = useState<DcrDocFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const seq = useRef(0);

  // [E2] searchText.KeyPress [Enter] (L133) · [E3] retrieveButton[조회].Select (L141) → retrieve() L202-220: dcr.Dcr00_DocList.getFile
  const retrieve = async () => {
    const my = ++seq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await dcrApi.searchDocFiles({
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

  // [E5] msgBox.DialogHide [YES] (L229) → fileDownload() L246-269: FileDownload?fileType=selectList&selectList=고른 파일 ID들 → zip
  const fileDownload = async () => {
    try {
      await fileApi.downloadZip(checked.map(r => r.fileId));
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  // [E4] fileDownload[다운로드].Select (L147) → downloadChk() L222-244
  const downloadChk = () => {
    if (checked.length === 0) {
      message.warning('첨부파일을 선택해주세요');
      return;
    }
    Modal.confirm({
      title: '다운로드',
      content: `${checked.length}건의 파일을 다운로드하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 320,
      onOk: fileDownload,
    });
  };

  // buildGrid() L173-200 (체크박스 다중 선택)
  const columnDefs = useMemo(() => [
    // L174-190 actionCell(View) → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, callback)
    // [L174 생략] 편집창은 다음 단계
    iconCell<DcrDocFile>('view', 'actionCell', 40, ' ', () => message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다')),
    gb.text('classTreeName', 350, '문서분류'),  // L191
    gb.date('regDate', 100, '등록일'),  // L192
    gb.textCenter('inoutName', 70, '문서구분'),  // L193
    gb.text('aprTitle', 450, '상신제목'),  // L194
    gb.text('fileName', 450, '파일명'),  // L195
    gb.text('note', 150, '비고'),  // L196
    gb.textCenter('empName', 100, '등록자'),  // L197
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        <SearchBar
          onSearch={() => void retrieve()}
          searchText="조회"
          loading={loading}
          extra={<Button type="download" onClick={downloadChk}>다운로드</Button>}
        >
          <SearchBar.Field label="등록기간">
            <DatePicker style={{ width: 140 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
            <span>~</span>
            <DatePicker style={{ width: 140 }} allowClear={false} value={endDate} onChange={d => d && setEndDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="문서분류">
            {/* [E1] classTreeName.TriggerClick [result == null] (L113) → Dcr01_Lookup_DcrClass.open(오늘): [전체]면 "전체"·classTreeId null */}
            <LookupInput
              value={classTreeName}
              width={300}
              placeholder="전체"
              onOpen={() => setClassOpen(true)}
              onClear={() => { setClassTreeId(null); setClassTreeName(ALL_TEXT); }}
            />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 330 }} placeholder="상신제목/파일명/비고/등록자" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<DcrDocFile>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.fileId)}
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
    </div>
  );
};
