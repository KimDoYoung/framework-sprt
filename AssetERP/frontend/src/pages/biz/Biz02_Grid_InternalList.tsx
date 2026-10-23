/**
 * 이익제공(수령) 직원 목록 (L02) — Biz01_Tab_Card 오른쪽 아래 `Biz02_Grid_PersonList`의 위쪽 칸
 * AS-IS: myApp/client/vi/biz/Biz02_Grid_InternalList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L57-74: 툴바 "직원" + [등록][삭제] (마감·상신이면 setButtonVisible(false)로 두 버튼을 감춘다), 그리드(buildGrid L99-106: 체크박스 다중, 본부(부서) 200 · 성명 100)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { bizPersonApi, bizPromoApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { BizPerson, BizPromoCard } from '@/types/biz';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { Emp00_Lookup_SelectMulti } from '@/components/lookup/Emp00_Lookup_SelectMulti';

const gb = gbFor<BizPerson>();

interface Props {
  /** retrieve(selectedItem) — 고른 내역. 없으면 setEnabled(false) */
  promo: BizPromoCard | null;
  /** setButtonVisible(!closeYn) 의 반대: 마감·상신이면 true */
  closed: boolean;
  /** 부모가 올리면 다시 읽는다 (Biz01_Edit_Card가 직원을 자동등록한 뒤 personList.retrieve) */
  refreshKey: number;
  /** callback.execute() — 본 화면 조회 */
  onChanged: () => void;
}

export const Biz02_Grid_InternalList: React.FC<Props> = ({ promo, closed, refreshKey, onChanged }) => {
  const gridRef = useRef<AgGridReact<BizPerson>>(null);
  const [rows, setRows] = useState<BizPerson[]>([]);
  const [empOpen, setEmpOpen] = useState(false);
  const promoId = promo?.promoId ?? null;

  // retrieve() L108-120: 서비스 biz.Biz02_Person.selectByInternal(promoId)
  const retrieve = useCallback(async () => {
    if (promoId == null) return;
    try {
      setRows(await bizPersonApi.searchInternal(promoId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [promoId]);

  // [E0] 화면 열림 (생성자 L57-74) → setting() — 고른 내역이 바뀌면(또는 부모가 다시 읽게 하면) 다시 조회
  useEffect(() => { void retrieve(); }, [retrieve, refreshKey]);

  // closeCheck() L212-231: 서비스 biz.Biz01_Promo.closeCheck([내역]) → 마감이면 안내하고 멈춘다
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

  // insertRow() L139-170: Emp00_Lookup_SelectMulti(오늘) → 고른 직원마다 서비스 biz.Biz02_Person.modelUpdate(promoId·empYn=true·empId) → callback.execute(), retrieve(promoModel)
  const insertRow = async (list: TransInfo[]) => {
    setEmpOpen(false);
    if (promoId == null || list.length === 0) return;
    try {
      await bizPersonApi.addEmps(promoId, list.map(t => t.personId));
      await retrieve();
      onChanged();
    } catch (err) {
      message.error(errorMessage(err, '등록 실패'));
    }
  };

  // deleteRow() L172-204: 선택 없으면 "삭제대상을 선택하세요" → "확인"/"해당 정보를 삭제하시겠습니까?"(폭 350) → [E3] msgBox.DialogHide [YES] (L181) → GridDeleteData → biz.Biz02_Person.delete → callback.execute()
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

  // buildGrid() L99-106
  const columnDefs = useMemo(() => [
    gb.textCenter('orgName', 200, '본부(부서)'),  // L102
    gb.textCenter('empName', 100, '성명'),  // L103
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, boxSizing: 'border-box', border: '1px solid #d9d9d9', padding: 8, ...(promo ? {} : { opacity: 0.6, pointerEvents: 'none' }) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 32 }}>
        <span style={{ fontWeight: 'bold' }}>직원</span>
        {!closed && (
          <>
            {/* [E1] insertButton[등록].Select (L77) → closeCheck(), insertRow() */}
            <Button type="register" onClick={() => closeCheck(() => setEmpOpen(true))}>등록</Button>
            {/* [E2] deleteButton[삭제].Select (L90) → closeCheck(), deleteRow() */}
            <Button type="delete" onClick={() => closeCheck(deleteRow)}>삭제</Button>
          </>
        )}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<BizPerson> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.personId)} />
      </div>
      <Emp00_Lookup_SelectMulti open={empOpen} transDate={dayjs().format('YYYY-MM-DD')} onResult={list => void insertRow(list)} onClose={() => setEmpOpen(false)} />
    </div>
  );
};
