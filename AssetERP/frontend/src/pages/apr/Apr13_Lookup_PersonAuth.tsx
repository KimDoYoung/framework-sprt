/**
 * 공람설정 창 (V09) — 결재가 끝난(30) 문서를 볼 수 있는 사원을 더하고 뺀다. 문서창 푸터의 [공람설정]이 연다.
 * AS-IS: myApp/client/vi/apr/Apr13_Lookup_PersonAuth.java (175줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L49-69: 320×400 모달 "공람설정", 위 오른쪽 [행 추가][행 삭제], 체크 다중 그리드(사원번호 120 · 사원명 120), 푸터 [저장][닫기]
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import { aprExtraApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Emp00_Lookup_SelectMulti } from '@/components/lookup/Emp00_Lookup_SelectMulti';

interface Row {
  /** 화면용 줄 번호(저장된 줄은 personAuthId와 같다, 새 줄은 음수) */
  rowKey: number;
  personAuthId: number | null;
  personId: number;
  personNo: string | null;
  personName: string | null;
}

const gb = gbFor<Row>();

interface Props {
  /** open(apprModel) — 값이 있으면 열린다 */
  apprId: number | null;
  onClose: () => void;
}

export const Apr13_Lookup_PersonAuth: React.FC<Props> = ({ apprId, onClose }) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [checked, setChecked] = useState<Row[]>([]);
  /** deleteList — [행 삭제]로 뺀 저장된 줄 */
  const [deleteIds, setDeleteIds] = useState<number[]>([]);
  const [lookupOpen, setLookupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const seq = useRef(0);

  // retrieve() L111-122: 서비스 apr.Apr13_PersonAuth.selectByApprId(apprId)
  const retrieve = useCallback(async () => {
    if (apprId == null) return;
    setLoading(true);
    try {
      const list = await aprExtraApi.getPersonAuths(apprId);
      setRows(list.map(r => ({ rowKey: r.personAuthId, ...r })));
      setChecked([]);
      setDeleteIds([]);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [apprId]);
  useEffect(() => {
    if (apprId == null) { setRows([]); setChecked([]); setDeleteIds([]); return; }
    void retrieve();
  }, [apprId, retrieve]);

  // [E1] insertButton[행 추가].Select (L75) → insertRow() L124-149: Emp00_Lookup_SelectMulti.open(오늘, false) → 고른 사원마다 맨 아래에 (03 원칙 17)
  const onPick = (list: TransInfo[]) => {
    setLookupOpen(false);
    setRows(prev => [...prev, ...list.map(m => ({ rowKey: --seq.current, personAuthId: null, personId: m.personId, personNo: m.empNo ?? null, personName: m.korNm ?? null }))]);
  };

  // [E2] deleteButton[행 삭제].Select (L81) → deleteRow() L151-157: 체크한 줄을 화면에서 빼고 저장된 줄은 deleteList에 둔다
  const deleteRow = () => {
    const gone = new Set(checked.map(r => r.rowKey));
    setDeleteIds(prev => [...prev, ...checked.filter(r => r.personAuthId != null).map(r => r.personAuthId as number)]);
    setRows(prev => prev.filter(r => !gone.has(r.rowKey)));
    setChecked([]);
  };

  // [E3] updateButton[저장].Select (L87) → update() L159-170: apr.Apr13_PersonAuth.update(새 줄) → delete(뺀 줄)
  const update = async () => {
    if (apprId == null) return;
    try {
      await aprExtraApi.savePersonAuths(apprId, rows.filter(r => r.personAuthId == null).map(r => r.personId), deleteIds);
      message.success('저장이 완료되었습니다');
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // buildGrid() L101-109
  const columnDefs = useMemo(() => [
    gb.textCenter('personNo', 120, '사원번호'),  // L105
    gb.textCenter('personName', 120, '사원명'),  // L106
  ], []);

  return (
    <>
      <LookupModal
        open={apprId != null}
        title="공람설정"
        width={420}
        style={{ top: 20 }}
        maskClosable={false}
        onCancel={onClose}
        destroyOnClose
        focusFirst={false}
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            <Button type="save" onClick={update}>저장</Button>
            {/* [E4] closeButton[닫기].Select (L93) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button type="addRow" onClick={() => setLookupOpen(true)}>행 추가</Button>
            <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
          </div>
          <div style={{ height: 'min(300px, calc(100vh - 300px))' }}>
            <MultiGrid<Row>
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.rowKey)}
              loading={loading}
              onCheckedChange={setChecked}
            />
          </div>
        </div>
      </LookupModal>
      <Emp00_Lookup_SelectMulti open={lookupOpen && apprId != null} transDate={dayjs().format('YYYY-MM-DD')} onResult={onPick} onClose={() => setLookupOpen(false)} />
    </>
  );
};
