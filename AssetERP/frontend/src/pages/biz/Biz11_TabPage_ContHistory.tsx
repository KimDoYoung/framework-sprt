/**
 * 계약사 관리 > 이력관리 탭 (EE20) — Biz10_Tab_ContCorp 아래 두 번째 탭("이력관리")
 * AS-IS: myApp/client/vi/biz/Biz11_TabPage_ContHistory.java (302줄) + Biz11_Edit_ContHistory·Biz14_Lookup_RelateAppr·Biz11_Lookup_FileList
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L51-76: 위 툴바(SearchBarBuilder — [등록][삭제][저장] + [자동연장][첨부파일관리], 입력칸 없음) + 이력 그리드(체크박스 단일, 읽기 전용)
 * UX보강(10): 툴바 = 조회 칸이 없어 SearchBar 대신 단추 줄
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { bizContCorpApi } from '@/api/bizCont';
import { errorMessage } from '@/api/client';
import { BizContCorp } from '@/types/bizCont';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Biz11_Edit_ContHistory, BizContHistoryEditTarget } from './Biz11_Edit_ContHistory';
import { Biz11_Lookup_FileList } from './Biz11_Lookup_FileList';
import { Biz14_Lookup_RelateAppr } from './Biz14_Lookup_RelateAppr';

const gb = gbFor<BizContCorp>();
/** setChecked(SINGLE) — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  /** 위 그리드에서 고른 계약사 */
  corp: BizContCorp | null;
  nonce: number;
  /** updateTransInfoGrid() L168-197: 위 그리드의 이 계약사 행을 다시 읽는다 */
  onCorpChanged: () => void;
}

export const Biz11_TabPage_ContHistory: React.FC<Props> = ({ corp, nonce, onCorpChanged }) => {
  const gridRef = useRef<AgGridReact<BizContCorp>>(null);
  const [rows, setRows] = useState<BizContCorp[]>([]);
  const [loading, setLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<BizContHistoryEditTarget | null>(null);
  const [relateHistoryId, setRelateHistoryId] = useState<number | null>(null);
  const [fileParentId, setFileParentId] = useState<number | null>(null);
  const contCorpId = corp?.contCorpId ?? null;

  // retrieve() L149-155: 서비스 biz.Biz11_ContHistory.selectByContCorpId(contCorpId). init() L139-141: 행을 비운다
  const retrieve = useCallback(async () => {
    if (contCorpId == null) { setRows([]); return; }
    setLoading(true);
    try {
      setRows(await bizContCorpApi.searchHistories(contCorpId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [contCorpId]);

  // [E0] 화면 열림 (생성자 L51-76) → 초기화 — 위 그리드 행을 누르거나 탭을 열면 retrieve()
  useEffect(() => { void retrieve(); }, [retrieve, nonce]);

  // [E1] searchBarBuilder[등록].Insert (L56) → insertRow() L200-213: 계약사가 없으면 "계약사를 먼저 선택해주세요", 아니면 Biz11_Edit_ContHistory("new", contCorpModel, cb → retrieve())
  const insertRow = () => {
    if (corp == null) {
      message.warning('계약사를 먼저 선택해주세요');
      return;
    }
    setEditTarget({ kind: 'new', corp });
  };

  // [E3] searchBarBuilder[저장].Update (L58) → update() L158-166: GridUpdate → biz.Biz11_ContHistory.update → updateTransInfoGrid()
  //   이 그리드는 편집 칸이 없어 바뀐 행이 없다 — 변경 0건 저장은 서버를 부르지 않고 메시지도 없다(11 §1)
  const update = () => undefined;

  // [E2] searchBarBuilder[삭제].Delete (L57) → deleteRow() L216-234: biz.Biz11_ContHistory.deleteCheck(contCorpId) — 이력이 2건 이상이어야 delete()
  const deleteRow = async () => {
    const sel = gridRef.current?.api.getSelectedRows()[0];
    if (!sel) {
      message.warning('선택된 내역이 없습니다');
      return;
    }
    try {
      const count = await bizContCorpApi.countHistories(sel.contCorpId);
      if (count > 1) {
        // [E7] messageBox.DialogHide [YES] (L239) → delete() L236-255: HtmlMessageBox "삭제" "선택한 정보를 삭제하시겠습니까?" [YES] → GridDeleteData biz.Biz11_ContHistory.delete → updateTransInfoGrid()
        Modal.confirm({
          title: '삭제', content: '선택한 정보를 삭제하시겠습니까?', okText: '예', cancelText: '아니오', width: 350,
          onOk: async () => {
            try {
              await bizContCorpApi.deleteHistories([sel.contHistoryId]);
              setRows(prev => prev.filter(r => r.contHistoryId !== sel.contHistoryId));
              onCorpChanged();
            } catch (err) {
              message.error(errorMessage(err, '삭제 실패'));
            }
          },
        });
      } else {
        message.warning('계약사정보는 1(개)이상 있어야합니다');
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E4] autoInsertButton[자동연장].Select (L62) → autoInsert() L257-286: 고른 계약사의 가장 최근 이력을 복사해 새 이력으로 —
  //   이력·보수정보 ID 비움, 계약상태 3, 계약기간 01, 거래개시일·적용일 = 거래종료일 + 1일, 거래종료일 = 거래개시일 + 12개월 - 1일 → biz.Biz10_ContCorp.insertUpdate → "자동연장이 완료되었습니다." → retrieve()
  const autoInsert = async () => {
    if (corp == null) return;
    if (!corp.closeDate) {
      message.warning('거래종료일이 없어 자동연장할 수 없습니다');
      return;
    }
    const start = dayjs(corp.closeDate).add(1, 'day');
    const close = start.add(12, 'month').subtract(1, 'day');
    const fmtD = (d: dayjs.Dayjs) => d.format('YYYY-MM-DD');
    try {
      await bizContCorpApi.save({
        contCorpId: corp.contCorpId,
        history: {
          contHistoryId: null, regDate: fmtD(start), contCorpNm: corp.contCorpNm, contStatusCd: '3', corpStatusCd: corp.corpStatusCd, trType: corp.trType,
          contPeriodCd: '01', contDate: corp.contDate, startDate: fmtD(start), closeDate: fmtD(close), baseFee: corp.baseFee, manager: corp.manager,
          managerTel: corp.managerTel, note: corp.note, personId: corp.personId, address: corp.address, ceo: corp.ceo,
        },
        fee: {
          feeInfoId: null, minFeeYn: corp.minFeeYn, manageMinFee: corp.manageMinFee, advMinFee: corp.advMinFee, discrMinFee: corp.discrMinFee,
          feeChargeType: corp.feeChargeType, withYn: corp.withYn, withFee: corp.withFee,
        },
      });
      message.success('자동연장이 완료되었습니다.');
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '자동연장 실패'));
    }
  };

  // [E5] fileManageButton[첨부파일관리].Select (L68) → fileManage() L288-295: 계약사가 하나 선택돼 있으면 Biz11_Lookup_FileList.open(contCorpId), 아니면 "상단의 계약사정보를 선택해주세요"
  const fileManage = () => {
    if (corp == null) {
      message.warning('상단의 계약사정보를 선택해주세요');
      return;
    }
    setFileParentId(corp.contCorpId);
  };

  // buildGrid() L78-136
  const columnDefs = useMemo(() => [
    gb.date('regDate', 100, '적용일자'),  // L115
    // [E6] actionCell1 (ImageCell "Edit").callbackOnCreate (L86) → Biz11_Edit_ContHistory("edit", 위 계약사 + 이 행의 이력·보수정보, cb → retrieve())
    iconCell<BizContCorp>('edit', 'editAction', 30, '수정', row => setEditTarget({ kind: 'edit', corp: row })),  // L116
    gb.text('contCorpNm', 200, '계약사명'),  // L117
    gb.text('contStatusNm', 100, '계약상태'),  // L118
    gb.text('corpStatusNm', 100, '거래유무'),  // L119
    gb.text('trType', 100, '거래형태'),  // L120
    gb.textCenter('contPeriodNm', 70, '계약기간'),  // L121
    gb.date('contDate', 100, '(재)계약일'),  // L122
    gb.date('startDate', 100, '거래개시일'),  // L123
    gb.date('closeDate', 100, '거래종료일'),  // L124
    gb.text('minFeeStr', 230, '최저보수'),  // L125
    gb.text('withFeeStr', 100, '병행보수'),  // L126
    gb.text('feeChargeTypeNm', 130, '청구구분'),  // L127
    gb.text('baseFee', 100, '기본보수(bp)'),  // L128
    gb.text('manager', 100, '담당자명'),  // L129
    gb.text('managerTel', 150, '담당자연락처'),  // L130
    // actionCell3 (ImageCell "View") → Biz14_Lookup_RelateAppr.open(contHistoryId)
    iconCell<BizContCorp>('view', 'relateAction', 50, '연관문서', row => setRelateHistoryId(row.contHistoryId)),  // L132
    gb.text('note', 200, '비고'),  // L133
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Button type="save" onClick={autoInsert}>자동연장</Button>
        <Button type="view" onClick={fileManage}>첨부파일관리</Button>
        <Button type="register" onClick={insertRow}>등록</Button>
        <Button type="delete" onClick={deleteRow}>삭제</Button>
        <Button type="save" onClick={update}>저장</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<BizContCorp>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.contHistoryId)}
          loading={loading}
          rowSelection={SINGLE_CHECK}
        />
      </div>
      <Biz11_Edit_ContHistory target={editTarget} onDone={() => { void retrieve(); }} onClose={() => setEditTarget(null)} />
      <Biz14_Lookup_RelateAppr contHistoryId={relateHistoryId} onClose={() => setRelateHistoryId(null)} />
      <Biz11_Lookup_FileList parentId={fileParentId} onClose={() => setFileParentId(null)} />
    </div>
  );
};
