/**
 * [1343] 신청 > 90. 기타신청 > 대외활동 신청서 작성 (A40)
 * AS-IS: myApp/client/vi/apr/Apr01_Tab_ExternalBiz.java (265줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L69-93: north(60) = 위 양식 한 줄(문서분류 칸 700 · [승인신청]), center = 툴바(조회기간 ~ [조회]) + 문서 그리드(체크박스)
 * 스타일: SGP (견본 — docs/page-style.md). 위 양식 한 줄은 Apr01_Tab_BizPriorApproval(L06)과 같은 모양
 * 전자결재 편집창 `Apr01_Edit_ApprDoc`: [승인신청](링크코드 A40, 제목 "대외활동신고서(보고서)_{로그인 사원 이름}"·본문은 문서분류의 대표 양식,
 *   `GET apr/apprs/link-seed`)·[상세보기](문서 열기)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 박스 안 여백 = 11 §5(padding 10·gap 8)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { aprApi } from '@/api/apr';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { AprPreProvide } from '@/types/apr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Dcr30_Move_DcrClass, Dcr30ClassResult } from '@/components/lookup/Dcr30_Move_DcrClass';
import { Apr01_Edit_ApprDoc } from './Apr01_Edit_ApprDoc';

const gb = gbFor<AprPreProvide>();
const DATE_FORMAT = 'YYYY-MM-DD';
const UNASSIGNED = '문서분류가 미지정 상태입니다. 관리자에게 문의해주세요';
/** private String aprTitle (L57) */
const APR_TITLE = '대외활동신고서(보고서)';
/** retrieveDoc() L213 · insertLinkApproval() L243 의 링크코드 */
const LINK_CODE = 'A40';

interface DocClass {
  classTreeId: number | null;
  classTreeFullName: string | null;
}

export const Apr01_Tab_ExternalBiz: React.FC = () => {
  // [E0] 화면 열림 (생성자 L69-93) → setting() L95-131: 조회기간 = 올해 1/1 ~ 오늘 → getEditor() → retrieve() → retrieveDoc()
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [endDate, setEndDate] = useState<Dayjs>(() => dayjs());
  /** classTreeFullName 칸의 emptyText — Link A40에 지정된 분류 이름, 없으면 미지정 안내 */
  const [docPlaceholder, setDocPlaceholder] = useState('');
  /** classTreeFullName 칸에 setValue 한 글자 — 문서분류 조회창에서 고른 값 */
  const [docText, setDocText] = useState('');
  /** defaultModel / classTreeModel */
  const [defaultDoc, setDefaultDoc] = useState<DocClass | null>(null);
  const [classDoc, setClassDoc] = useState<DocClass | null>(null);
  const [rows, setRows] = useState<AprPreProvide[]>([]);
  const [loading, setLoading] = useState(false);
  const [docOpen, setDocOpen] = useState(false);
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  const [linkDoc, setLinkDoc] = useState<{ classTreeId: number } | null>(null);
  const seq = useRef(0);

  // retrieve() L181-198: apr.Apr01_Appr.selectByText(searchText01~03 = aprTitle, 기간, 로그인 사원·회사) — grid.mask("Loading")
  const retrieve = async () => {
    const my = ++seq.current;
    setLoading(true);
    try {
      const list = await aprApi.searchByTitle(startDate.format(DATE_FORMAT), endDate.format(DATE_FORMAT), APR_TITLE);
      if (my !== seq.current) return;
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  // retrieveDoc() L212-232: dcr.Dcr30_Link.selectByLinkCode(회사, "A40") — 정확히 1건이면 그 분류가 기본·선택 분류
  const retrieveDoc = async () => {
    try {
      const list = await dcrApi.searchClassTreeByLinkCode(LINK_CODE);
      if (list.length === 1) {
        const doc = { classTreeId: list[0].classTreeId, classTreeFullName: list[0].classTreeFullName };
        setDefaultDoc(doc);
        setClassDoc(doc);
        setDocPlaceholder(doc.classTreeFullName ?? '');
      } else {
        setDocPlaceholder(UNASSIGNED);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  useEffect(() => {
    void retrieve();
    void retrieveDoc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E1] classTreeFullName[문서분류].TriggerClick (L99) → openLookupDoc() L201-210: Dcr30_Move_DcrClass.open(defaultModel, callback) → 고른 분류를 칸에 넣는다
  const onDocResult = (r: Dcr30ClassResult) => {
    setClassDoc({ classTreeId: r.classTreeId, classTreeFullName: r.classTreeFullName });
    setDocText(r.classTreeFullName ?? '');
  };

  // [E2] insertButton[승인신청].Select (L106) → insertLinkApproval() L234-254: 문서분류가 없으면 "문서분류를 선택해주세요",
  //   아니면 제목 "{aprTitle}_{로그인 사원 이름}"으로 Apr01_Edit_ApprDoc.insertLinkApproval(classTreeModel, "A40", model, false, callback → 결과가 있으면 retrieve())
  const insertLinkApproval = () => {
    if (classDoc?.classTreeId == null) {
      message.warning('문서분류를 선택해주세요');
      return;
    }
    setLinkDoc({ classTreeId: classDoc.classTreeId });
  };

  // buildGrid() L152-179 (체크박스 단일 선택)
  const columnDefs = useMemo(() => [
    gb.date('regDate', 100, '등록일'),  // L171
    gb.date('effectDate', 100, '시행일'),  // L172
    gb.text('classTreeNameAllPath', 400, '문서분류'),  // L173
    gb.text('title', 600, '문서명'),  // L174
    gb.textCenter('statusName', 100, '결재상태'),  // L175
    // actionCell(Detail) L176 → 선택 행으로 Apr01_Edit_ApprDoc.retrieveApproval(model, isAdmin, callback → retrieve())  [E4] callbackOnCreate (L159)
    iconCell<AprPreProvide>('view', 'actionCell', 50, '상세보기', row => setViewApprId(row.apprId)),
  ], []);

  const labelStyle: React.CSSProperties = { width: 95, fontWeight: 600, whiteSpace: 'nowrap' };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* getEditor() L133-150: [문서분류 700] [승인신청] */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '15px 10px 30px' }}>
          <span style={labelStyle}>문서분류</span>
          <LookupInput value={docText} placeholder={docPlaceholder} width={400} onOpen={() => setDocOpen(true)} />
          <Button type="register" onClick={insertLinkApproval}>승인신청</Button>
        </div>
        {/* [E3] retrieveButton[조회].Select (L125) → retrieve(). centerBar L95-131: 조회기간: {시작} ~ {종료} [조회] */}
        <SearchBar onSearch={() => void retrieve()} searchText="조회" loading={loading}>
          <SearchBar.Field label="조회기간">
            <DatePicker style={{ width: 140 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
            <span>~</span>
            <DatePicker style={{ width: 140 }} allowClear={false} value={endDate} onChange={d => d && setEndDate(d)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AprPreProvide>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.apprId)}
            loading={loading}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
          />
        </div>
      </div>
      <Dcr30_Move_DcrClass
        open={docOpen}
        authCheck
        defaultClassTreeId={defaultDoc?.classTreeId}
        onResult={onDocResult}
        onClose={() => setDocOpen(false)}
      />
      {/* insertLinkApproval() / actionCell(Detail): Apr01_Edit_ApprDoc — 저장·닫힘 뒤 retrieve() */}
      <Apr01_Edit_ApprDoc
        apprId={viewApprId}
        link={linkDoc ? { classTreeId: linkDoc.classTreeId, linkCode: LINK_CODE, args: { typeName: APR_TITLE } } : null}
        onLinkSaved={() => void retrieve()}
        onClosed={() => void retrieve()}
        onClose={() => { setViewApprId(null); setLinkDoc(null); }}
      />
    </div>
  );
};
