/**
 * [1134] 준법감시 > 40. 이익제공(수령)현황 > 이익제공 사전승인신청 (L06, 1단계)
 * AS-IS: myApp/client/vi/apr/Apr01_Tab_BizPriorApproval.java (393줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L84-106: north(100) = 위 양식 한 줄(신청서 구분 콤보 · 문서분류 칸 · [승인신청] · 관리자만 [문서분류지정]), center = 툴바(조회기간 ~ [조회]) + 문서 그리드(체크박스 단일 선택)
 * 1단계(F·G·L02와 같은 사유): [승인신청]·[상세보기]가 여는 전자결재 편집창 `Apr01_Edit_ApprDoc`(5831줄, 다른 도메인 apr)과 [문서분류지정]이 여는
 *   (B15에서 [문서분류지정]의 `Dcr30_Lookup_Link`를 연결했다.) 편집창은 다음 단계 — 지금은 원본의 사전 검사 메시지까지만 하고 안내를 띄운다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 박스 안 여백 = 11 §5(padding 10·gap 8)
 */
import React, { useMemo, useRef, useState } from 'react';
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
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Dcr30_Lookup_Link } from '@/components/lookup/Dcr30_Lookup_Link';
import { Dcr30_Move_DcrClass, Dcr30ClassResult } from '@/components/lookup/Dcr30_Move_DcrClass';
import { useLoginUser } from '@/hooks/useLoginUser';

const gb = gbFor<AprPreProvide>();
const DATE_FORMAT = 'YYYY-MM-DD';
const UNASSIGNED = '문서분류가 미지정 상태입니다. 관리자에게 문의해주세요';

interface DocClass {
  classTreeId: number | null;
  classTreeFullName: string | null;
}

export const Apr01_Tab_BizPriorApproval: React.FC = () => {
  const user = useLoginUser();
  // LoginUser.getIsManager() — 회사관리자(userId < 0)
  const isManager = user.userId < 0;

  // [E0] 화면 열림 (생성자 L84-106) → setting() L108-199: 조회기간 = 올해 1/1 ~ 오늘, 신청서 구분 "(선택하세요)". getEditor() L201-246: 열 때 자동 조회는 없다
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [endDate, setEndDate] = useState<Dayjs>(() => dayjs());
  const [apprCode, setApprCode] = useState<string | undefined>(undefined);
  /** classTreeFullName 칸의 emptyText — 신청서 구분을 고르면 그 Link에 지정된 분류 이름, 없으면 미지정 안내 */
  const [docPlaceholder, setDocPlaceholder] = useState('');
  /** classTreeFullName 칸에 setValue 한 글자 — 문서분류 조회창에서 고른 값 */
  const [docText, setDocText] = useState('');
  /** defaultModel / classTreeModel */
  const [defaultDoc, setDefaultDoc] = useState<DocClass | null>(null);
  const [classDoc, setClassDoc] = useState<DocClass | null>(null);
  const [rows, setRows] = useState<AprPreProvide[]>([]);
  const [loading, setLoading] = useState(false);
  const [docOpen, setDocOpen] = useState(false);
  const seq = useRef(0);

  // [E5] retrieveButton[조회].Select (L193) → retrieve() L277-295: apr.Apr01_Appr.selectByText(preProvideRcvApprYn true, 기간, 로그인 사원·회사)
  const retrieve = async () => {
    const my = ++seq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await aprApi.searchPreProvide(startDate.format(DATE_FORMAT), endDate.format(DATE_FORMAT));
      if (my !== seq.current) return;
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  // [E1] apprComboBox[신청서 구분].Collapse (L139) → retrieveDoc() L338-360: dcr.Dcr30_Link.selectByLinkCode(회사, linkCode) — 정확히 1건이면 그 분류가 기본·선택 분류
  const retrieveDoc = async (code: string | undefined) => {
    if (!code) {
      // 고른 값을 지우면 linkCode가 null — 1건이 아니므로 미지정 안내 (분류 값은 그대로 둔다, 원본도 else 가지에서 모델을 바꾸지 않는다)
      setDocPlaceholder(UNASSIGNED);
      return;
    }
    try {
      const list = await dcrApi.searchClassTreeByLinkCode(code);
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

  // [E2] classTreeFullName[문서분류].TriggerClick (L149) → openLookupDoc() L298-307: Dcr30_Move_DcrClass.open(defaultModel, callback) → 고른 분류를 칸에 넣는다
  const onDocResult = (r: Dcr30ClassResult) => {
    setClassDoc({ classTreeId: r.classTreeId, classTreeFullName: r.classTreeFullName });
    setDocText(r.classTreeFullName ?? '');
  };

  // [E3] dcrLinkButton[문서분류지정].Select (L155) → Dcr30_Lookup_Link.open("LinkCode0002", callback{}) — 관리자만 보이는 버튼
  //   (B15) 창은 components/lookup/Dcr30_Lookup_Link. 닫은 뒤 callback{}은 아무것도 하지 않는다
  const [linkOpen, setLinkOpen] = useState(false);
  const openLinkLookup = () => setLinkOpen(true);

  // insertLinkApproval() L362-382: 문서분류가 없으면 "문서분류를 선택해주세요", 아니면 제목 "{신청서 구분 이름}_{로그인 사원 이름}"으로(다음 단계에서 콤보 이름을 받는다)
  //   Apr01_Edit_ApprDoc.insertLinkApproval(classTreeModel, linkCode, model, false, callback → 결과가 있으면 retrieve())
  // [생략] 전자결재 편집창(Apr01_Edit_ApprDoc, 다른 도메인 apr)은 다음 단계
  const insertLinkApproval = () => {
    if (classDoc?.classTreeId == null) {
      message.warning('문서분류를 선택해주세요');
      return;
    }
    message.info('전자결재 상신 창은 다음 단계에서 연결됩니다');
  };

  // [E4] insertButton[승인신청].Select (L168) → 신청서 구분을 안 골랐으면 "신청서 구분을 선택해주세요", 아니면 insertLinkApproval()
  const onInsert = () => {
    if (apprCode == null) {
      message.warning('신청서 구분을 선택해주세요');
      return;
    }
    insertLinkApproval();
  };

  // buildGrid() L248-275 (체크박스 단일 선택)
  const columnDefs = useMemo(() => [
    gb.date('regDate', 100, '등록일'),  // L267
    gb.date('effectDate', 100, '시행일'),  // L268
    gb.text('classTreeNameAllPath', 400, '문서분류'),  // L269
    gb.text('title', 600, '문서명'),  // L270
    gb.textCenter('statusName', 100, '결재상태'),  // L271
    // actionCell(Detail) L249-258 → 선택 행으로 Apr01_Edit_ApprDoc.retrieveApproval(model, isAdmin, callback → retrieve())
    // [생략] 전자결재 문서 보기 창은 다음 단계
    iconCell<AprPreProvide>('view', 'actionCell', 70, '상세보기', () => {
      message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다');
    }),
  ], []);

  const labelStyle: React.CSSProperties = { width: 95, fontWeight: 600, whiteSpace: 'nowrap' };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* getEditor() L201-246: [신청서 구분 450] [문서분류 700] [승인신청] [  ] [문서분류지정(관리자)] */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '15px 10px 30px' }}>
          <span style={labelStyle}>신청서 구분</span>
          <SystemCodeComboBox
            kindCd="PreProvideRcvType"
            style={{ width: 400 }}
            placeholder="(선택하세요)"
            value={apprCode}
            onChange={code => { setApprCode(code); void retrieveDoc(code); }}
          />
          <span style={{ ...labelStyle, marginLeft: 50 }}>문서분류</span>
          <LookupInput value={docText} placeholder={docPlaceholder} width={400} onOpen={() => setDocOpen(true)} />
          {/* [E4] insertButton[승인신청] */}
          <Button type="register" onClick={onInsert}>승인신청</Button>
          {/* [E3] dcrLinkButton[문서분류지정] — LoginUser.getIsManager()일 때만 */}
          {isManager && <Button type="save" onClick={openLinkLookup}>문서분류지정</Button>}
        </div>
        {/* centerBar L108-199: 조회기간: {시작} ~ {종료} [조회] */}
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
      <Dcr30_Lookup_Link open={linkOpen} linkCodeList="LinkCode0002" onClose={() => setLinkOpen(false)} />
      <Dcr30_Move_DcrClass
        open={docOpen}
        authCheck
        defaultClassTreeId={defaultDoc?.classTreeId}
        onResult={onDocResult}
        onClose={() => setDocOpen(false)}
      />
    </div>
  );
};
