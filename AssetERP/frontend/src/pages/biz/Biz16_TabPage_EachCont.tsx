/**
 * 계약사 관리 > 개별계약서 탭 (EE20) — Biz10_Tab_ContCorp 아래 세 번째 탭("개별계약서")
 * AS-IS: myApp/client/vi/biz/Biz16_TabPage_EachCont.java (496줄) + Dcr30_Lookup_Link·Dcr01_Lookup_Class(components·pages/dcr)·Apr01_Edit_ApprDoc(pages/apr)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L67-96: 위 툴바(SearchBarBuilder — [등록][삭제][저장] + 관리자만 [문서분류지정], 입력칸 없음) + 셀 편집 그리드(체크박스 단일)
 * 상신 문서: 연결 코드 C01(서버 EachContLinkSeedProvider 가 제목·본문을 만든다), 저장하면 biz.Biz16_EachCont.updateApprId
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { bizContCorpApi } from '@/api/bizCont';
import { dcrApi } from '@/api/dcr';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { BizContCorp, BizContEach } from '@/types/bizCont';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Dcr30_Lookup_Link } from '@/components/lookup/Dcr30_Lookup_Link';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { Dcr01_Lookup_Class } from '../dcr/Dcr01_Lookup_Class';

const gb = gbFor<BizContEach>();
/** setChecked(SINGLE) — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;
const LINK_CODE = 'C01';

interface Props {
  corp: BizContCorp | null;
  nonce: number;
  /** updateTransInfoGrid() L255-286 */
  onCorpChanged: () => void;
}

export const Biz16_TabPage_EachCont: React.FC<Props> = ({ corp, nonce, onCorpChanged }) => {
  const [userManager, setUserManager] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  /** [상신]으로 연 계약서 행 — 문서분류 확인 창(Dcr01_Lookup_Class) → 상신 문서(Apr01_Edit_ApprDoc) */
  const [apprRow, setApprRow] = useState<BizContEach | null>(null);
  const [classOpen, setClassOpen] = useState(false);
  const [defaultClassId, setDefaultClassId] = useState<number | null>(null);
  const [linkDoc, setLinkDoc] = useState<{ classTreeId: number; contractId: number } | null>(null);
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  const contCorpId = corp?.contCorpId ?? null;

  useEffect(() => { schApi.isUserManager().then(setUserManager).catch(() => setUserManager(false)); }, []);

  const crud = useGridCrud<BizContEach>({
    idField: 'contractId',
    // retrieve() L152-165: 서비스 biz.Biz16_EachCont.selectByCorpId(contCorpId, companyId)
    search: useCallback(async () => (contCorpId == null ? [] : bizContCorpApi.searchEachConts(contCorpId)), [contCorpId]),
    // update() L205-253: GridUpdate → biz.Biz16_EachCont.update → updateTransInfoGrid()
    save: useCallback(async (rows: BizContEach[]) => {
      // 바뀐 행마다 시작일(startDate) = 그 행의 계약일 — AS-IS 는 고른 행의 계약일(selectModel.getDate())을 넣는다
      await bizContCorpApi.saveEachConts(rows.map(r => ({ ...r, startDate: r.date })));
      return rows;
    }, []),
    reloadAfterSave: true,
    // deleteRow() L402-431: GridDeleteData biz.Biz16_EachCont.delete → updateTransInfoGrid()
    remove: useCallback((ids: number[]) => bizContCorpApi.deleteEachConts(ids), []),
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',
    // insertRow() L390-399: 회사·계약사를 채운 새 행
    newRow: useCallback(() => ({ companyId: corp?.companyId, contCorpId: corp?.contCorpId }), [corp]),
    firstEditField: 'date',
    // update() L205-253: 모든 행의 계약일·펀드명·보수율·시작일(=계약일)이 있어야 한다
    validate: (_changed, all) => {
      for (const r of all) {
        if (!r.date) return '계약일은 필수작성 항목입니다';
        if (!r.fundNm) return '펀드명은 필수작성 항목입니다';
        if (!r.fundFee) return '보수율은 필수작성 항목입니다';
      }
      return undefined;
    },
    onChanged: onCorpChanged,
  });
  // crud 는 rows 가 바뀔 때마다 새 객체라 의존성에는 안정된 것만 꺼내 쓴다
  const { clear: crudClear, retrieve: crudRetrieve } = crud;

  // [E0] 화면 열림 (생성자 L67-95) → 초기화 — 위 그리드 행을 누르거나 탭을 열면 retrieve()
  useEffect(() => {
    if (contCorpId == null) crudClear(); else void crudRetrieve();
  }, [contCorpId, nonce, crudClear, crudRetrieve]);

  const selectedRow = () => crud.gridRef.current?.api?.getSelectedRows()[0];

  // [E1] searchBarBuilder[등록].Insert (L72) → insertRow() L390-399: GridInsertRow (맨 아래 빈 행)
  const insertRow = () => {
    if (corp == null) {
      message.warning('계약사를 먼저 선택해주세요');
      return;
    }
    crud.addRow();
  };

  // [E2] searchBarBuilder[삭제].Delete (L73) → deleteRow() L402-431: 결재가 끝난(30) 문서는 "결제완료된 문서가 존재합니다.", 결재 중(10·20)은 "결제진행 중인 문서가 존재합니다.", 아니면 확인 → delete → [E5] updateTransInfoGrid()
  const deleteRow = () => {
    const sel = selectedRow();
    if (sel?.apprStatusCd === '30') {
      message.warning('결제완료된 문서가 존재합니다.');
      return;
    }
    if (sel?.apprStatusCd === '10' || sel?.apprStatusCd === '20') {
      message.warning('결제진행 중인 문서가 존재합니다.');
      return;
    }
    void crud.deleteChecked();
  };

  // [E3] searchBarBuilder[저장].Update (L74) → update() L205-253: 선택한 행의 결재 상태가 30이면 "결제완료된 문서는 수정 불가능합니다.", 10·20이면 "결제진행 중인 문서는 수정 불가능합니다."
  const update = async () => {
    crud.gridRef.current?.api?.stopEditing();
    const sel = selectedRow();
    if (sel?.apprStatusCd === '30') {
      message.warning('결제완료된 문서는 수정 불가능합니다.');
      return;
    }
    if (sel?.apprStatusCd === '10' || sel?.apprStatusCd === '20') {
      message.warning('결제진행 중인 문서는 수정 불가능합니다.');
      return;
    }
    await crud.saveRows();
  };

  // buildGrid() L97-144의 apprCell(ImageCell "Edit") → 서비스 biz.Biz16_EachCont.selectByContCorpId: 계약사 주소·대표이사가 없으면 "계약사 주소와 대표이사를 입력해야합니다.", 있으면 updateCheck()
  const onAppr = async (row: BizContEach) => {
    try {
      const list = await bizContCorpApi.searchEachContAddr(row.contCorpId);
      for (const r of list) {
        if (!r.ceo || !r.address) {
          message.warning('계약사 주소와 대표이사를 입력해야합니다.');
          return;
        }
        updateCheck(row);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };
  // updateCheck() L167-202: 모든 행의 계약일·펀드명·보수율·시작일이 있고 저장하지 않은 변경이 없어야 한다 — 아니면 "저장 후 상신을 진행해주세요"
  const updateCheck = (row: BizContEach) => {
    crud.gridRef.current?.api?.stopEditing();
    if (crud.rows.some(r => !r.date || !r.fundNm || !r.fundFee || !r.startDate) || crud.hasChanges()) {
      message.warning('저장 후 상신을 진행해주세요');
      return;
    }
    checkAppr(row);
  };
  // checkAppr() L288-319: 결재 문서가 있고 상태가 상신·완료·결재중이면 그 문서를 읽기로 열고(닫으면 retrieve()), 아니면 checkdcr()
  const checkAppr = (row: BizContEach) => {
    if (row.apprId != null && ['상신', '완료', '결재중'].includes(row.aprStatusNm ?? '')) {
      setViewApprId(row.apprId);
      return;
    }
    void checkdcr(row);
  };
  // checkdcr() L321-355: dcr.Dcr30_Link.selectByLinkCode(companyId, "C01") → Dcr01_Lookup_Class.open(지정된 분류 또는 null) → insertLinkApproval()
  const checkdcr = async (row: BizContEach) => {
    try {
      const list = await dcrApi.searchClassTreeByLinkCode(LINK_CODE);
      setDefaultClassId(list.length === 0 ? null : list[0].classTreeId);
      setApprRow(row);
      setClassOpen(true);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };
  // insertLinkApproval() L357-371: 계약사명 → createMapping() → Apr01_Edit_ApprDoc.insertLinkApproval(classTreeModel, "C01", 행, false, cb → updateApprId(apprId))
  const onClassResult = (c: { classTreeId: number }) => {
    setClassOpen(false);
    if (apprRow) setLinkDoc({ classTreeId: c.classTreeId, contractId: apprRow.contractId });
  };
  // updateApprId() L373-387: biz.Biz16_EachCont.updateApprId(contractId, apprId) → retrieve()
  const updateApprId = async (apprId: number) => {
    if (!linkDoc) return;
    try {
      await bizContCorpApi.updateEachContApprId(linkDoc.contractId, apprId);
      await crud.retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // buildGrid() L97-144
  const columnDefs = useMemo(() => [
    gb.date('date', 120, '계약일', { editor: 'date' }),  // L131
    gb.text('fundNm', 400, '펀드명', { editor: 'text' }),  // L132
    gb.date('fundStartDate', 120, '설정일', { editor: 'date' }),  // L133
    gb.text('fundFee', 140, '보수율', { editor: 'text' }),  // L135
    gb.text('note', 280, '비고', { editor: 'text' }),  // L136
    gb.textCenter('aprStatusNm', 120, '결재상태'),  // L140
    iconCell<BizContEach>('edit', 'apprAction', 50, '상신', row => void onAppr(row)),  // L141
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [crud.rows]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Button type="register" onClick={insertRow}>등록</Button>
        <Button type="delete" disabled={!crud.hasChecked} onClick={deleteRow}>삭제</Button>
        <Button type="save" count={crud.changes} onClick={update}>저장</Button>
        {/* [E4] dcrLinkButton[문서분류지정].Select (L80) → Dcr30_Lookup_Link.open("C01", cb{}) — 관리자(LoginUser.getIsUserManager())만 보인다 */}
        {userManager && <Button type="save" onClick={() => setLinkOpen(true)}>문서분류지정</Button>}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<BizContEach> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_CHECK} />
      </div>
      <Dcr30_Lookup_Link open={linkOpen} linkCodeList={LINK_CODE} onClose={() => setLinkOpen(false)} />
      <Dcr01_Lookup_Class open={classOpen} classTreeId={defaultClassId} onResult={onClassResult} onClose={() => setClassOpen(false)} />
      <Apr01_Edit_ApprDoc
        apprId={viewApprId}
        link={linkDoc ? { classTreeId: linkDoc.classTreeId, linkCode: LINK_CODE, refId: linkDoc.contractId } : null}
        onLinkSaved={id => void updateApprId(id)}
        onClosed={() => void crud.retrieve()}
        onClose={() => { setViewApprId(null); setLinkDoc(null); setApprRow(null); }}
      />
    </div>
  );
};
