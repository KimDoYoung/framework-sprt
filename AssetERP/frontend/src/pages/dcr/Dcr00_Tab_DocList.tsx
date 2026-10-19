/**
 * [1006] 문서작성 > 02. 문서검색 > 통합 문서검색 (F05, 1단계)
 * AS-IS: myApp/client/vi/dcr/Dcr00_Tab_DocList.java (386줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L92-157: 바깥 여백 20, 박스 안 툴바 2줄(조회기간 · 문서분류 / 결재상태 · 문서구분 · 검색 · 수신처 · [조회] [엑셀다운로드] · 북마크) + 문서 그리드(1) | 회색 칸(10) | Apr03_TabPage_Relate(300)
 * 1단계(F01~F04와 같은 사유): 보기 아이콘이 여는 전자결재 편집창 Apr01_Edit_ApprDoc, 북마크 아이콘이 여는 Apr50_Lookup_ApprList, 댓글 아이콘이 여는
 *   Apr42_Lookup_CommentView는 다른 도메인(apr)이라 다음 단계에서 연결한다 — 지금은 안내만 띄운다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 조건이 길어 한 줄을 넘기므로 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useMemo, useRef, useState } from 'react';
import { DatePicker, message } from 'antd';
import { StarFilled } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { aprApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprDocSearch } from '@/types/apr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Apr03_TabPage_Relate } from '@/pages/apr/Apr03_TabPage_Relate';
import { Dcr01_Lookup_DcrClass } from './Dcr01_Lookup_DcrClass';

const gb = gbFor<AprDocSearch>();
const DATE_FORMAT = 'YYYY-MM-DD';
const ALL = '%';
/** 콤보 "전체"(ComboBoxField(kind, "%", "전체")) */
const ALL_CODE: [string, string] = [ALL, '전체'];
const ALL_TEXT = '전체';

export const Dcr00_Tab_DocList: React.FC = () => {
  // [E0] 화면 열림 (생성자 L92-157) → settings() L159-244 — 열 때 자동 조회는 없다(원본 생성자는 retrieve()를 부르지 않는다)
  // settings() L159-244: 조회기간 = 오늘 -1개월 ~ 오늘, 결재상태 "완료"(코드 30), 문서구분 "전체", 문서분류 "전체"
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(1, 'month'));
  const [endDate, setEndDate] = useState<Dayjs>(() => dayjs());
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [classTreeName, setClassTreeName] = useState(ALL_TEXT);
  const [statusCode, setStatusCode] = useState<string>('30');
  const [inoutCode, setInoutCode] = useState<string>(ALL);
  const [searchText, setSearchText] = useState('');
  const [receiveName, setReceiveName] = useState('');
  const [rows, setRows] = useState<AprDocSearch[]>([]);
  const [loading, setLoading] = useState(false);
  const [apprId, setApprId] = useState<number | null>(null);
  const [classOpen, setClassOpen] = useState(false);
  const seq = useRef(0);

  const params = () => ({
    classTreeId: classTreeId ?? undefined,
    startDate: startDate.format(DATE_FORMAT),
    endDate: endDate.format(DATE_FORMAT),
    searchText,
    receiveName,
    statusCode,
    inoutCode,
  });

  // [E2] searchText.KeyPress [Enter] (L183)·[E3] receiveName.KeyPress [Enter] (L194)·[E5] retrieveButton[조회].Select (L223) → retrieve() L289-310: apr.Apr01_Appr.selectByText2
  const retrieve = async () => {
    const my = ++seq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await aprApi.searchDocText(params());
      if (my !== seq.current) return;
      setRows(list);
      setApprId(null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  // [E6] downloadButton[엑셀다운로드].Select (L229) → createRdExcel() L312-373: 조회 조건 그대로 "통합 문서검색(시작 ~ 끝).xlsx" 받기
  const createRdExcel = async () => {
    const p = params();
    try {
      await aprApi.downloadDocTextExcel(p, `통합 문서검색(${p.startDate} ~ ${p.endDate}).xlsx`);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  // [E1] bookmarkAnchor.MouseDown (L117) → Apr50_Lookup_ApprList.open()
  // [E1 생략] 북마크 문서 조회창은 다음 단계에서 연결한다
  const openBookmark = () => message.info('북마크 문서 조회창은 다음 단계에서 연결됩니다');

  // buildGrid() L246-287 (체크박스 단일 선택)
  const columnDefs = useMemo(() => [
    // L271 actionCell(View) → Apr01_Edit_ApprDoc.retrieveApproval(model, false, callback)
    // [L271 생략] 편집창은 다음 단계
    iconCell<AprDocSearch>('view', 'actionCell', 40, ' ', () => message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다')),
    gb.bookmarkYn('bookmarkYn', 30, ' '),  // L272
    gb.date('regDate', 90, '등록일'),  // L273
    gb.textCenter('regEmpName', 80, '등록자'),  // L274
    gb.textHtml('statusName', 80, '결재상태'),  // L275 addApprStep
    gb.text('title', 300, '상신제목'),  // L276
    gb.textCenter('inOutTypeName', 70, '문서구분'),  // L277
    gb.text('classTreeName', 350, '문서분류'),  // L278
    gb.text('receiveName', 150, '수신처'),  // L279
    gb.textCenter('stampSeq', 100, '대외문서번호'),  // L280
    gb.textCenter('relateDisplayName', 80, '펀드/일임'),  // L281
    // L282 actionCell(View) → Apr42_Lookup_CommentView.open(apprId)
    // [L282 생략] 댓글 조회창은 다음 단계
    iconCell<AprDocSearch>('view', 'actionCell02', 50, '댓글', () => message.info('댓글 조회창은 다음 단계에서 연결됩니다')),
    gb.text('note', 300, '비고'),  // L284
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        <SearchBar
          onSearch={() => void retrieve()}
          searchText="조회"
          loading={loading}
          extra={(
            <>
              {/* [E6] downloadButton[엑셀다운로드] */}
              <Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>
              <StarFilled title="북마크 문서" style={{ color: '#FFCD43', fontSize: 18, cursor: 'pointer' }} onClick={openBookmark} />
            </>
          )}
        >
          <SearchBar.Field label="조회기간">
            <DatePicker style={{ width: 140 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
            <span>~</span>
            <DatePicker style={{ width: 140 }} allowClear={false} value={endDate} onChange={d => d && setEndDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="문서분류">
            {/* [E4] classTreeName.TriggerClick [result == null] (L203) → Dcr01_Lookup_DcrClass.open("%", 오늘): [전체]면 "전체"·classTreeId null */}
            <LookupInput
              value={classTreeName}
              width={400}
              placeholder="전체"
              onOpen={() => setClassOpen(true)}
              onClear={() => { setClassTreeId(null); setClassTreeName(ALL_TEXT); }}
            />
          </SearchBar.Field>
          <SearchBar.Field label="결재상태">
            <SystemCodeComboBox kindCd="AprStatusCode" altCode={ALL_CODE} style={{ width: 80 }} value={statusCode} onChange={c => setStatusCode(c ?? ALL)} />
          </SearchBar.Field>
          <SearchBar.Field label="문서구분">
            <SystemCodeComboBox kindCd="AprInOutTypeCode" altCode={ALL_CODE} style={{ width: 80 }} value={inoutCode} onChange={c => setInoutCode(c ?? ALL)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 430 }} placeholder="상신제목/내용/등록자/연관펀드/연관일임/비고/대외문서번호" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="수신처">
            <SearchBar.Input style={{ width: 150 }} placeholder="미입력" value={receiveName} onChange={e => setReceiveName(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* [E7] grid.RowClick (L235) → tabPage.retrieve(apprId) */}
            <SingleGrid<AprDocSearch>
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.apprId)}
              loading={loading}
              rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
              onRowClicked={e => e.data && setApprId(e.data.apprId)}
            />
          </div>
          <div style={{ width: 10, background: '#f0f0f0', flex: 'none' }} />
          <div style={{ width: 300, flex: 'none' }}>
            <Apr03_TabPage_Relate apprId={apprId} />
          </div>
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
