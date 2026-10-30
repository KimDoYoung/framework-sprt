/**
 * [1348] 자금관리 > 20. 사업비관리 > 여비교통비 관리 (U06)
 * AS-IS: myApp/client/vi/emp/Emp50_Tab_TransportExpenseMng.java (622줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L90-239: BorderLayout 가운데(여백 20) = 툴바 50(기준년월 년 45 + 월 콤보 60 · [조회][마감][취소]) + 그리드(행번호, 단일 선택, 10열, 합계 행 "계") + 폼 70(문서분류 800 · 상신상태 250 · [상신][문서보기])
 * 스타일: SG (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 2개 미만이라 넣지 않는다
 * [다음 단계] 그리드 [문서보기] 아이콘·[상신]·[문서보기]가 여는 전자결재 편집창 Apr01_Edit_ApprDoc(retrieveApproval·insertLinkApprovals)은 다른 도메인이라 지금은 안내만 한다.
 *   [상신]은 편집창이 열릴 자리까지(내용 없음·마감 전·문서분류 미지정 검사)를 원본 그대로 하고, 결재 뒤 상신 문서 기록 API(POST emp/relate-apprs/status·PUT emp/relate-apprs/{id}/appr-id)는 만들어 두었다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message } from 'antd';
import dayjs from 'dayjs';
import { actApi } from '@/api/act';
import { dcrApi } from '@/api/dcr';
import { empRelateApprApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { RelateAppr } from '@/types/emp';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Dcr30_Move_DcrClass, Dcr30ClassResult } from '@/components/lookup/Dcr30_Move_DcrClass';

const gb = gbFor<RelateAppr>();
const NO_CLASS_TEXT = '문서분류가 미지정 상태입니다. 관리자에게 문의해주세요';
/** setAccountName() L600-613: 5805(여비교통비계정) · 9540039900(954003 국내교통비 + 99 없음 + '00') */
const REPR_ACCOUNT_CODE = '5805';
const ACCOUNT_MAP = '9540039900';

export const Emp50_Tab_TransportExpenseMng: React.FC = () => {
  // 생성자 L93-110: 기준년월의 기본값은 지난달(오늘의 달 1일에서 한 달 전)
  const [year, setYear] = useState(() => dayjs().startOf('month').subtract(1, 'month').format('YYYY'));
  const [month, setMonth] = useState(() => dayjs().startOf('month').subtract(1, 'month').format('MM'));
  const [rows, setRows] = useState<RelateAppr[]>([]);
  const [loading, setLoading] = useState(false);
  // 문서분류(classTreeModel · classTreeFullName 칸 — 고르기 전에는 기본값을 흐린 글씨로 보인다) · 상신상태(apprStepCode/Name)
  const [classTree, setClassTree] = useState<{ id: number | null; name: string }>({ id: null, name: '' });
  const [classText, setClassText] = useState('');
  const [classHint, setClassHint] = useState('');
  const [apprStep, setApprStep] = useState({ code: '00', name: '미상신' });
  const [apprEnabled, setApprEnabled] = useState(true);
  const [apprViewEnabled, setApprViewEnabled] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  /** 마지막으로 조회한 년도 — 년도 칸의 ValueChange(값이 바뀌고 칸을 떠날 때)만 다시 조회한다 */
  const committedYear = useRef(year);
  /** 상신 때 문서에 넣는 계정과목 이름 (다음 단계에서 쓴다) */
  const accountNameRef = useRef('');

  const yyyymm = (mm: string = month) => `${year.trim()}.${mm}`;

  // apprChk() L305-353: 기준년월의 상신 문서 상태 → 상신/문서보기 단추 활성
  const apprChk = useCallback(async (ym: string) => {
    try {
      const st = await empRelateApprApi.getRelateApprStatus(ym);
      if (st == null || st.statusCode == null) {
        setApprStep({ code: '00', name: '미상신' });
        setApprEnabled(true);
        setApprViewEnabled(false);
      } else {
        setApprStep({ code: st.statusCode, name: st.statusName ?? '' });
        setApprEnabled(st.statusCode === '40');
        setApprViewEnabled(true);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // retrieve() L290-303: emp.Emp51_RelateAppr.selectByCompanyId(yyyymm) → 끝나면 apprChk()
  const retrieve = useCallback(async (mm: string = month) => {
    const ym = `${year.trim()}.${mm}`;
    committedYear.current = year;
    setLoading(true);
    try {
      setRows(await empRelateApprApi.searchRelateApprs(ym));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    } finally {
      setLoading(false);
    }
    await apprChk(ym);
  }, [year, month, apprChk]);

  // [E0] 화면 열림 (생성자 L90-239) → retrieve(), defaultName(), setAccountName()
  useEffect(() => {
    void retrieve();
    // defaultName() L367-386: 연결코드 A43의 문서분류 — 한 건이면 모델에 넣고 칸에 흐린 글씨로, 아니면 안내
    void (async () => {
      try {
        const trees = await dcrApi.searchClassTreeByLinkCode('A43');
        if (trees.length === 1) {
          setClassTree({ id: trees[0].classTreeId, name: trees[0].classTreeFullName });
          setClassHint(trees[0].classTreeFullName);
        } else {
          setClassHint(NO_CLASS_TEXT);
        }
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    })();
    void (async () => {
      try {
        accountNameRef.current = await actApi.getRealAccountName(REPR_ACCOUNT_CODE, ACCOUNT_MAP);
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E11] viewCell (ImageCell "Detail").callbackOnCreate (L264-269) → 인라인: 상신문서가 없으면 안내, 있으면 Apr01_Edit_ApprDoc.retrieveApproval() (다음 단계)
  const viewAppr = (row: RelateAppr) => {
    if (row.apprId == null) { message.warning('해당 문서가 없습니다. 결재상태를 확인해주세요.'); return; }
    message.info('전자결재 편집창(Apr01_Edit_ApprDoc)은 다음 단계에서 연결합니다.');
  };

  // buildGrid() L241-288 (단일 선택, getSumGrid("계", 1, 8, 8) → 마감여부 칸에 "계", 금액 합)
  const columnDefs = useMemo(() => [
    gb.textCenter('closeName', 80, '마감여부'),  // L277
    gb.date('regDate', 100, '신청일'),  // L278
    gb.textCenter('regNo', 80, '신청번호'),  // L279
    gb.textCenter('orgName', 100, '부서'),  // L280
    gb.textCenter('posName', 100, '직위'),  // L281
    gb.textCenter('personName', 100, '성명'),  // L282
    gb.text('apprTitle', 300, '문서명'),  // L283
    gb.long('regAmt', 120, '금액'),  // L284
    gb.textCenter('statusName', 100, '결재상태'),  // L285
    iconCell<RelateAppr>('view', 'viewAction', 80, '문서보기', viewAppr),  // L286 viewCell (ImageCell "Detail")
  ], []);

  // [E8]·[E9] closeButton[마감]·closeCancelButton[취소].Select (L187·L194) → closeYn(true|false) L500-551
  const closeYn = async (close: boolean) => {
    if (rows.length === 0) { message.warning('마감할 내용이 없습니다.'); return; }
    for (const r of rows) {
      if (r.statusCode == null || r.statusCode !== '30') { message.warning('완료되지 않은 문서가 포함되어 있습니다.'); return; }
      const closed = r.closeYn === 'true';
      if (close && closed) { message.warning('이미 마감되었습니다.'); return; }
      if (!close && !closed) { message.warning('아직 마감전입니다.'); return; }
    }
    if (['10', '20', '30'].includes(apprStep.code)) { message.warning('상신 중입니다'); return; }
    try {
      await empRelateApprApi.updateRelateApprClose(yyyymm(), close);
      message.success(close ? '마감 되었습니다.' : '마감 취소 되었습니다.');
      void retrieve();
    } catch (err) {
      message.error(errorMessage(err, close ? '마감 실패' : '마감 취소 실패'));
    }
  };

  // [E6] apprButton[상신].Select (L154) → insertLinkApproval() L388-483: 내용 없음 / 마감 전 / 문서분류 없음 안내까지 → Apr01_Edit_ApprDoc (다음 단계)
  const insertLinkApproval = () => {
    if (rows.length === 0) { message.warning('상신할 내용이 없습니다.'); return; }
    if (rows.some(r => r.closeYn !== 'true')) { message.warning('마감후 상신을 진행해주시길 바랍니다.'); return; }
    if (classTree.id == null) { message.warning('문서분류를 선택해주세요.'); return; }
    message.info('전자결재 편집창(Apr01_Edit_ApprDoc)은 다음 단계에서 연결합니다.');
  };

  // [E7] apprViewButton[문서보기].Select (L161) → apr.Apr01_Appr.selectById(apprId) → Apr01_Edit_ApprDoc.retrieveApproval() (다음 단계)
  const viewPayAppr = () => {
    message.info('전자결재 편집창(Apr01_Edit_ApprDoc)은 다음 단계에서 연결합니다.');
  };

  // [E10] classTreeFullName[문서분류].TriggerClick (L201) → openLookupDoc() L356-365: Dcr30_Move_DcrClass.open(callback) → 고른 분류를 칸에 넣는다
  const onClassResult = (r: Dcr30ClassResult) => {
    setClassTree({ id: r.classTreeId, name: r.classTreeFullName ?? '' });
    setClassText(r.classTreeFullName ?? '');
    setMoveOpen(false);
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E5] retrieveButton[조회].Select (L147) → retrieve() */}
        <SearchBar onSearch={() => void retrieve()} loading={loading}
          extra={(
            <>
              <Button type="save" onClick={() => void closeYn(true)}>마감</Button>
              <Button type="cancel" onClick={() => void closeYn(false)}>취소</Button>
            </>
          )}>
          <SearchBar.Field label="기준년월">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              {/* [E1] yyyyText.ValueChange (L101) → retrieve(), [E3] yyyyText.KeyPress [Enter] (L131) → retrieve() */}
              <Input style={{ width: 55 }} value={year} onChange={e => setYear(e.target.value)}
                onBlur={() => { if (year !== committedYear.current) void retrieve(); }} onPressEnter={() => void retrieve()} />
              {/* [E2] periodComboBox[MonthsCode].Collapse (L112) → retrieve(), [E4] periodComboBox.ValueChange (L140) → retrieve() */}
              <SystemCodeComboBox kindCd="MonthsCode" allowClear={false} style={{ width: 70 }} value={month}
                onChange={v => { if (!v) return; setMonth(v); void retrieve(v); }} />
            </span>
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<RelateAppr> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.relateApprId)}
            sumRow={{ labelField: 'closeName', label: '계', sum: ['regAmt'] }} />
        </div>
        {/* 폼 70 (L208-222, 원본은 테두리 패널이지만 SG는 테두리를 두지 않는다): 문서분류 800 · 상신상태 250 · [상신] 120 · [문서보기] 120, 라벨 폭 105 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 70, flex: 'none' }}>
          <span style={{ width: 105, textAlign: 'right', paddingRight: 10 }}>문서분류</span>
          <div style={{ width: 800, maxWidth: '50%' }}>
            {/* classTreeFullName: LookupTriggerField(편집 불가) — 기본 문서분류는 흐린 글씨(setEmptyText) */}
            <LookupInput value={classText} placeholder={classHint} width={800} onOpen={() => setMoveOpen(true)} />
          </div>
          <span style={{ width: 105, textAlign: 'right', paddingRight: 10 }}>상신상태</span>
          <Input style={{ width: 140 }} readOnly value={apprStep.name} />
          <Button type="register" disabled={!apprEnabled} onClick={insertLinkApproval}>상신</Button>
          <Button type="search" disabled={!apprViewEnabled} onClick={viewPayAppr}>문서보기</Button>
        </div>
      </div>
      <Dcr30_Move_DcrClass open={moveOpen} hideNull onResult={onClassResult} onClose={() => setMoveOpen(false)} />
    </div>
  );
};
