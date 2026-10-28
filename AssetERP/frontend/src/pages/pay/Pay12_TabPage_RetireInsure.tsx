/**
 * 4대보험 정산 탭 (S22) — Pay10_Tab_Retire의 두 번째 탭 "4대보험 정산".
 * AS-IS: myApp/client/vi/pay/Pay12_TabPage_RetireInsure.java (603줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L83-154: 위 툴바 40([출력/다운로드][4대보험 정산 재생성]) + "1. 건강보험"(45)·그리드 170 + "2. 장기요양보험"(45)·그리드 170 + "3. 고용보험"(45)·그리드 230,
 *   각 구분 툴바 = [행 추가][행 삭제][저장] + 새로고침 아이콘(anchor, MouseDown → 그 구분만 retrieve). 세로 스크롤.
 * 그리드: 행번호 있음, 모든 열 셀 편집(년도·적용기간 문자, 나머지 숫자). 삭제는 [행 삭제]가 그리드에서만 빼 두었다 [저장]에서 서버에 보낸다(deleteList)
 * retrieve(param) L528-562: pay.Pay10_Month.getRetireInfo(personId) — 퇴직정산서(한 건)가 없으면 "선택한 사원의 퇴직정산서 내역이 없습니다. 생성 후 다시시도해주세요",
 *   있으면 retrieve() L321-359 = pay.Pay12_RetireInsure.selectByPersonId(personId, insureCode 2·3·4) ×3
 * [E4]~[E12] insertRow/deleteRow/update → 구분별 L361-399·L401-418·L420-518(insertRetireInfo: 변경 행·삭제 행 + 기준 연도 = 발령일 연도)
 * [E13] downloadButton[출력/다운로드].Select (L214) → sys.Sys99_Print.insertRdRetireInsure → RDViewer(mrd Pay12_Rd_RetireInsure, rdGroupId·date·userId)
 * [E14] regenerationButton[4대보험 정산 재생성].Select (L252) → pay.Pay12_RetireInsure.callInsureRetire(insert) → 성공이면 retrieve()
 */
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { payApi } from '@/api/pay';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { PayRetireInsure } from '@/types/pay';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { RdViewer } from '@/components/lookup/RdViewer';
import { useGridCrud } from '@/hooks/useGridCrud';
import { RETIRE_NO_MONTH, RetireTabHandle, RetireTabParam } from './payRetireTab';

const gb = gbFor<PayRetireInsure>();
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;
const TITLE_STYLE: React.CSSProperties = { fontSize: 14, fontWeight: 700, padding: '0 10px' };

/** buildGrid1() L276-291 (건강보험) */
const buildGrid1 = () => [
  gb.textCenter('year', 60, '년도', { editor: 'text' }),  // L278
  gb.textCenter('applyTerm', 200, '적용기간', { editor: 'text' }),  // L279
  gb.long('totalPay', 140, '보수총액<br>(A)', { editor: 'number' }),
  gb.long('workMonthCnt', 80, '근무월수<br>(B)', { editor: 'number' }),
  gb.long('monthPay', 140, '보수월액<br>(C=A/B)', { editor: 'number' }),
  gb.long('payMonthCnt', 80, '정산월수<br>(D)', { editor: 'number' }),
  gb.double('insureRate', 100, '보험료율(%)<br>(E)', { editor: 'number' }),
  gb.long('monthAmt', 140, '월보험료<br>(F=C*E)', { editor: 'number' }),
  gb.long('fixAmt', 140, '확정보험료<br>(G=F*D)', { editor: 'number' }),
  gb.long('payAmt', 140, '납부보험료<br>(H)', { editor: 'number' }),
  gb.long('unpayAmt', 140, '전년도<br>미정산보험료<br>(I)', { editor: 'number' }),
  gb.long('settleAmt', 140, '정산보험료<br>(G-H+I)', { editor: 'number' }),
];

/** buildGrid2() L293-306 (장기요양보험) */
const buildGrid2 = () => [
  gb.textCenter('year', 60, '년도', { editor: 'text' }),
  gb.textCenter('applyTerm', 200, '적용기간', { editor: 'text' }),
  gb.long('monthPay', 140, '건강보험 월보험료<br>(A)', { editor: 'number' }),
  gb.double('insureRate', 100, '보험료율(%)<br>(B)', { editor: 'number' }),
  gb.long('payMonthCnt', 80, '정산월수<br>(C)', { editor: 'number' }),
  gb.long('monthAmt', 140, '월보험료<br>(D=A*B)', { editor: 'number' }),
  gb.long('fixAmt', 140, '확정보험료<br>(E=D*C)', { editor: 'number' }),
  gb.long('payAmt', 140, '납부보험료<br>(F)', { editor: 'number' }),
  gb.long('unpayAmt', 140, '전년도<br>미정산보험료<br>(G)', { editor: 'number' }),
  gb.long('settleAmt', 140, '정산보험료<br>(E-F+G)', { editor: 'number' }),
];

/** buildGrid3() L308-319 (고용보험) */
const buildGrid3 = () => [
  gb.textCenter('year', 60, '년도', { editor: 'text' }),
  gb.textCenter('applyTerm', 200, '적용기간', { editor: 'text' }),
  gb.long('totalPay', 140, '보수총액<br>(A)', { editor: 'number' }),
  gb.double('insureRate', 100, '보험료율(%)<br>(B)', { editor: 'number' }),
  gb.long('fixAmt', 140, '확정보험료<br>(C=A*B)', { editor: 'number' }),
  gb.long('payAmt', 140, '납부보험료<br>(D)', { editor: 'number' }),
  gb.long('unpayAmt', 140, '전년도<br>미정산보험료<br>(E)', { editor: 'number' }),
  gb.long('settleAmt', 140, '정산보험료<br>(C-D+E)', { editor: 'number' }),
];

interface SectionProps {
  title: string;
  insureCode: string;
  height: number;
  columnDefs: ReturnType<typeof buildGrid1>;
  /** 부모가 정한 급여(퇴직정산서) ID·사원·기준 연도 */
  ctx: React.MutableRefObject<{ personId: number | null; monthId: number | null; year: string | null }>;
}

interface SectionHandle {
  retrieve: () => Promise<unknown>;
  clear: () => void;
}

/** 구분 하나: 툴바([행 추가][행 삭제][저장] + 새로고침) + 셀 편집 그리드. 삭제는 [저장]까지 미룬다(deleteList) */
const InsureSection = forwardRef<SectionHandle, SectionProps>(({ title, insureCode, height, columnDefs, ctx }, ref) => {
  const [deleteIds, setDeleteIds] = useState<number[]>([]);
  const crud = useGridCrud<PayRetireInsure>({
    idField: 'retireInsureId',
    // retrieve(itemType) L321-359: pay.Pay12_RetireInsure.selectByPersonId(personId, insureCode)
    search: useCallback(() => (ctx.current.personId == null ? Promise.resolve([]) : payApi.searchRetireInsures(ctx.current.personId, insureCode)), [ctx, insureCode]),
    // insertRow(itemType) L361-399: monthId·insureCode만 채운 새 행
    newRow: () => ({ monthId: ctx.current.monthId ?? 0, insureCode }),
    firstEditField: 'year',
    // 저장·삭제는 [저장]이 한 번에 보낸다(update() L420-518) — 이 훅의 save·remove는 쓰지 않는다
    save: async rows => rows,
    remove: async () => 0,
  });
  const { retrieve: crudRetrieve, clear: crudClear } = crud;

  const retrieve = useCallback(async () => {
    setDeleteIds([]);
    await crudRetrieve();
  }, [crudRetrieve]);
  const clear = useCallback(() => { setDeleteIds([]); crudClear(); }, [crudClear]);
  useImperativeHandle(ref, () => ({ retrieve, clear }));

  // [E4]·[E7]·[E10] insertButton[행 추가].Select → insertRow(itemType) L361-399
  const insertRow = () => {
    if (ctx.current.monthId == null) return;
    crud.addRow();
  };

  // [E5]·[E8]·[E11] deleteButton[행 삭제].Select → deleteRow(itemType) L401-418: 고른 행을 그리드에서 빼고 deleteList에 둔다(저장에서 서버로)
  const deleteRow = () => {
    const selected = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length === 0) return;
    const ids = selected.map(r => r.retireInsureId);
    setDeleteIds(prev => [...prev, ...ids.filter(id => id > 0)]);
    crud.removeRows(ids);
  };

  // [E6]·[E9]·[E12] updateButton[저장].Select → update(itemType) L420-518: 변경 행이나 삭제 행이 있을 때 pay.Pay12_RetireInsure.insertRetireInfo(updateList, deleteList, year)
  const update = async () => {
    const changed = crud.getChanged();
    if (changed.length === 0 && deleteIds.length === 0) return;
    if (ctx.current.monthId == null) return;
    try {
      await payApi.saveRetireInsures(ctx.current.monthId, insureCode, ctx.current.year ?? '', changed, deleteIds);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <>
      <div style={{ height: 45, display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
        <span style={TITLE_STYLE}>{title}</span>
        <Button type="addRow" onClick={insertRow}>행 추가</Button>
        <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
        <Button type="save" count={{ ...crud.changes, modified: crud.changes.modified + deleteIds.length }} onClick={update}>저장</Button>
        {/* [E1] [E2] [E3] anchor1·2·3.MouseDown (L87·L94·L101) → retrieve(itemType) */}
        <ReloadOutlined style={{ cursor: 'pointer', marginLeft: 8 }} onMouseDown={() => void retrieve()} />
      </div>
      <div style={{ height, flex: 'none' }}>
        <CellEditGrid<PayRetireInsure> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_SELECTION} />
      </div>
    </>
  );
});
InsureSection.displayName = 'InsureSection';

// [E0] 화면 열림 (생성자 L83-154) → settings(): 툴바·구분별 툴바·그리드 3개
export const Pay12_TabPage_RetireInsure = forwardRef<RetireTabHandle>((_props, ref) => {
  const ctx = useRef<{ personId: number | null; monthId: number | null; year: string | null }>({ personId: null, monthId: null, year: null });
  const sec1 = useRef<SectionHandle>(null);
  const sec2 = useRef<SectionHandle>(null);
  const sec3 = useRef<SectionHandle>(null);
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  const columns1 = useMemo(buildGrid1, []);
  const columns2 = useMemo(buildGrid2, []);
  const columns3 = useMemo(buildGrid3, []);

  const clear = useCallback(() => {
    ctx.current.monthId = null;
    sec1.current?.clear(); sec2.current?.clear(); sec3.current?.clear();
  }, []);

  // retrieve() L321-359: 세 구분을 모두 조회
  const retrieveAll = useCallback(async () => {
    await Promise.all([sec1.current?.retrieve(), sec2.current?.retrieve(), sec3.current?.retrieve()]);
  }, []);

  // retrieve(param) L528-562
  const retrieve = useCallback(async (param: RetireTabParam) => {
    ctx.current = { personId: param.personId, monthId: null, year: param.year };
    const month = param.personId == null ? null : await payApi.getRetireMonth(param.personId).catch(err => { message.error(errorMessage(err, '조회 실패')); return null; });
    if (month == null) {
      clear();
      message.warning(RETIRE_NO_MONTH);
      return;
    }
    ctx.current.monthId = month.monthId;
    await retrieveAll();
  }, [clear, retrieveAll]);

  useImperativeHandle(ref, () => ({ retrieve, clear }));

  useEffect(() => () => { ctx.current.monthId = null; }, []);

  // [E13] downloadButton[출력/다운로드].Select (L214) → sys.Sys99_Print.insertRdRetireInsure → RDViewer.viewer
  const download = async () => {
    const personId = ctx.current.personId;
    if (personId == null) return;
    try {
      const rdGroupId = await payApi.rdPrintRetireInsures(personId);
      const today = new Date().toISOString().slice(0, 10);
      const res = await rdApi.buildUrl({ kind: 'viewer', mrd: 'Pay12_Rd_RetireInsure', options: '/rhtmlimportopt [2]', rv: { rdGroupId, date: today, userId: String(personId) } });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    }
  };

  // [E14] regenerationButton[4대보험 정산 재생성].Select (L252) → pay.Pay12_RetireInsure.callInsureRetire → 성공이면 retrieve()
  const regenerate = async () => {
    const personId = ctx.current.personId;
    if (personId == null) return;
    try {
      await payApi.regenerateRetireInsures(personId);
      await retrieveAll();
    } catch (err) {
      message.error(errorMessage(err, '재생성 실패'));
    }
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 40, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', flex: 'none' }}>
        <Button type="download" onClick={download}>출력/다운로드</Button>
        <Button type="generate" onClick={regenerate}>4대보험 정산 재생성</Button>
      </div>
      <InsureSection ref={sec1} title="1. 건강보험" insureCode="2" height={170} columnDefs={columns1} ctx={ctx} />
      <InsureSection ref={sec2} title="2. 장기요양보험" insureCode="3" height={170} columnDefs={columns2} ctx={ctx} />
      <InsureSection ref={sec3} title="3. 고용보험" insureCode="4" height={230} columnDefs={columns3} ctx={ctx} />
      <RdViewer url={rdUrl} title="4대보험 정산" onClose={() => setRdUrl(null)} />
    </div>
  );
});
Pay12_TabPage_RetireInsure.displayName = 'Pay12_TabPage_RetireInsure';
