/**
 * 이익제공(수령) 거래상대방 목록 (L02) — Biz01_Tab_Card 오른쪽 아래 `Biz02_Grid_PersonList`의 아래쪽 칸
 * AS-IS: myApp/client/vi/biz/Biz02_Grid_ExternalList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L56-74: 툴바 "거래상대방" + [등록][삭제] (마감·상신이면 감춤), 그리드(buildGrid: 체크박스 다중, 회사명 170 · 성명 70 · 부서 100)
 * 1단계: [등록]이 여는 거래처 조회창 `Mkt01_Lookup_Select`(다른 도메인 mkt)는 다음 단계 — 마감 확인까지 하고 안내만 띄운다. 서버 등록 API는 아직 없다.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { bizPersonApi, bizPromoApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { BizPerson } from '@/types/biz';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';

const gb = gbFor<BizPerson>();

interface Props {
  promo: { promoId: number } | null;
  closed: boolean;
  refreshKey: number;
  onChanged: () => void;
}

export const Biz02_Grid_ExternalList: React.FC<Props> = ({ promo, closed, refreshKey, onChanged }) => {
  const gridRef = useRef<AgGridReact<BizPerson>>(null);
  const [rows, setRows] = useState<BizPerson[]>([]);
  const promoId = promo?.promoId ?? null;

  // retrieve(): 서비스 biz.Biz02_Person.selectByExternal(promoId)
  const retrieve = useCallback(async () => {
    if (promoId == null) return;
    try {
      setRows(await bizPersonApi.searchExternal(promoId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [promoId]);

  // [E0] 화면 열림 (생성자 L56-74) → setting() — 고른 내역이 바뀌면(또는 부모가 다시 읽게 하면) 다시 조회
  useEffect(() => { void retrieve(); }, [retrieve, refreshKey]);

  // closeCheck(): 서비스 biz.Biz01_Promo.closeCheck([내역]) → 마감이면 안내하고 멈춘다
  const closeCheck = async (action: () => void) => {
    if (promoId == null) return;
    try {
      if (await bizPromoApi.hasClosed([promoId])) {
        message.warning('마감된 내역 입니다. 다시 확인바랍니다.');
        return;
      }
      action();
    } catch (err) {
      message.error(errorMessage(err, '마감 확인 실패'));
    }
  };

  // insertRow() L77: Mkt01_Lookup_Select("MULTI") → 고른 거래처마다 biz.Biz02_Person.modelUpdate(empYn=false·회사명·담당자·부서) — 조회창이 다른 도메인이라 다음 단계
  const insertRow = () => message.info('거래처 조회창은 다음 단계에서 연결됩니다');

  // deleteRow(): 선택 없으면 "삭제대상을 선택하세요" → "확인"/"해당 정보를 삭제하시겠습니까?"(폭 350) → [E3] msgBox.DialogHide [YES] (L182) → GridDeleteData → biz.Biz02_Person.delete → callback.execute()
  const deleteRow = () => {
    const checked = gridRef.current?.api.getSelectedRows() ?? [];
    if (checked.length === 0) {
      message.warning('삭제대상을 선택하세요');
      return;
    }
    Modal.confirm({
      title: '확인',
      content: '해당 정보를 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 350,
      onOk: async () => {
        try {
          const n = await bizPersonApi.deletePeople(checked.map(r => r.personId));
          message.success(`${n}건 삭제되었습니다.`);
          await retrieve();
          onChanged();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  const columnDefs = useMemo(() => [
    gb.text('targetCompanyName', 170, '회사명'),
    gb.text('targetEmpName', 70, '성명'),
    gb.text('targetOrgName', 100, '부서'),
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, boxSizing: 'border-box', border: '1px solid #d9d9d9', padding: 8, ...(promo ? {} : { opacity: 0.6, pointerEvents: 'none' }) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 32 }}>
        <span style={{ fontWeight: 'bold' }}>거래상대방</span>
        {!closed && (
          <>
            {/* [E1] insertButton[등록].Select (L77) → closeCheck(), insertRow() */}
            <Button type="register" onClick={() => closeCheck(insertRow)}>등록</Button>
            {/* [E2] deleteButton[삭제].Select (L90) → closeCheck(), deleteRow() */}
            <Button type="delete" onClick={() => closeCheck(deleteRow)}>삭제</Button>
          </>
        )}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<BizPerson> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.personId)} />
      </div>
    </div>
  );
};
