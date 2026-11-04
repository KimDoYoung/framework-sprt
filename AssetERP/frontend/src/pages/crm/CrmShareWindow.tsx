/**
 * 공유지정 창 공통 본문 (EE86 Crm14_Lookup_ShareDefault · EE87 Crm15_Lookup_Share) — 두 AS-IS 클래스는 제목·서비스 이름만 다르고 본문이 같다
 * AS-IS Crm14_Lookup_ShareDefault.java (322줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L77-107: 580×450 모달, 툴바 50(○직원 ●부서 · [행 추가][행 삭제] · 새로고침 아이콘), 그리드(구분 70·부서 250·성명 100, 체크 다중), 아래 가운데 [저장][닫기]
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Radio, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { AgGridReact } from 'ag-grid-react';
import dayjs from 'dayjs';
import { errorMessage } from '@/api/client';
import { CrmShare } from '@/types/crm';
import { OrgInfo, TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { Emp00_Lookup_SelectMulti } from '@/components/lookup/Emp00_Lookup_SelectMulti';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Org00_Lookup_SelectMulti } from '@/components/lookup/Org00_Lookup_SelectMulti';

const gb = gbFor<CrmShare>();

type NewRow = { shareCode: string; personId: number | null; orgId: number | null };

interface Props {
  /** open(id, callbackResult) — 값이 있으면 열린다 (거래처 번호 또는 업무활동 번호) */
  ownerId: number | null;
  title: string;
  /** retrieve() */
  load: (ownerId: number) => Promise<CrmShare[]>;
  /** update() → updateEnd(): 지운 줄·새 줄을 저장하고 공유 문구를 돌려준다 */
  save: (ownerId: number, deleteIds: number[], rows: NewRow[]) => Promise<string>;
  /** callbackResult.execute(resultMsg): 저장 뒤 공유 문구. 받은 뒤 창이 닫힌다 */
  onResult: (shareInfo: string) => void;
  onClose: () => void;
}

export const CrmShareWindow: React.FC<Props> = ({ ownerId, title, load, save, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<CrmShare>>(null);
  const [rows, setRows] = useState<CrmShare[]>([]);
  const [deleteList, setDeleteList] = useState<number[]>([]);
  const [shareType, setShareType] = useState<'1' | '2'>('2');  // ButtonSetting() L130-133: radio01 직원 false, radio02 부서 true
  const [empOpen, setEmpOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);
  const tempId = useRef(0);

  // retrieve() L310-316 (deleteList.clear())
  const retrieve = async () => {
    if (ownerId == null) return;
    try {
      setRows(await load(ownerId));
      setDeleteList([]);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L77-107, open L109-118) → ButtonSetting(), retrieve()
  useEffect(() => {
    if (ownerId == null) return;
    setRows([]);
    setDeleteList([]);
    setShareType('2');
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerId]);

  const append = (list: CrmShare[]) => {
    setRows(prev => [...prev, ...list]);
    // 03 원칙 17: 맨 아래에 넣고 보여 준다
    setTimeout(() => {
      const api = gridRef.current?.api;
      const last = list[list.length - 1];
      const node = last ? api?.getRowNode(String(last.shareId)) : undefined;
      if (api && node?.rowIndex != null) api.ensureIndexVisible(node.rowIndex);
    }, 0);
  };

  // openLookupEmpInfo() L200-228: Emp00_Lookup_SelectMulti(오늘) → 구분 "1"·직원, 조직·사원
  const onEmpResult = (list: TransInfo[]) => {
    setEmpOpen(false);
    append(list.map(t => ({
      shareId: --tempId.current, shareCode: '1', shareName: '직원',
      orgId: t.orgCodeId ?? null, orgName: t.parentFullNm ?? null, personId: t.personId, personName: t.korNm ?? null,
    })));
  };

  // openLookupOrgInfo() L172-198: Org00_Lookup_SelectMulti(오늘) → 구분 "2"·부서, 조직
  const onOrgSelect = (list: OrgInfo[]) => {
    setOrgOpen(false);
    append(list.map(o => ({
      shareId: --tempId.current, shareCode: '2', shareName: '부서',
      orgId: o.orgCodeId, orgName: o.parentFullNm ?? null, personId: null, personName: null,
    })));
  };

  // [E4] insertButton[행 추가].Select (L137) → insertRow() L230-238: 직원이면 사원 조회창, 부서면 조직 조회창
  const insertRow = () => (shareType === '1' ? setEmpOpen(true) : setOrgOpen(true));

  // [E5] deleteButton[행 삭제].Select (L143) → deleteRow() L302-308: 체크한 행을 그리드에서 빼고 deleteList에 둔다 (저장 때 서버에서 지운다)
  const deleteRow = () => {
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) return;
    const ids = new Set(checked.map(c => c.shareId));
    setDeleteList(prev => [...prev, ...checked.filter(c => c.shareId > 0).map(c => c.shareId)]);
    setRows(prev => prev.filter(r => !ids.has(r.shareId)));
  };

  // [E1] updateButton[저장].Select (L84) → update() L240-275 → updateEnd() L277-300: 지운 줄(delete) + 새 줄(update) → selectShareInfo → callback.execute(문구) → hide()
  const update = async () => {
    if (ownerId == null) return;
    try {
      const info = await save(ownerId, deleteList,
        rows.filter(r => r.shareId <= 0).map(r => ({ shareCode: r.shareCode ?? '2', personId: r.personId ?? null, orgId: r.orgId ?? null })));
      onResult(info);
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // grid() L161-170
  const columnDefs = useMemo(() => [
    gb.textCenter('shareName', 70, '구분'),  // L165
    gb.text('orgName', 250, '부서'),  // L166
    gb.textCenter('personName', 100, '성명'),  // L167
  ], []);

  return (
    <LookupModal
      open={ownerId != null}
      title={title}
      width={580}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L90) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Radio.Group value={shareType} onChange={e => setShareType(e.target.value)}>
            <Radio value="1">직원</Radio>
            <Radio value="2">부서</Radio>
          </Radio.Group>
          <Button type="addRow" onClick={insertRow}>행 추가</Button>
          <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
          {/* [E3] anchor.MouseDown (L123) → retrieve() */}
          <ReloadOutlined style={{ cursor: 'pointer' }} onClick={() => { void retrieve(); }} />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<CrmShare> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.shareId)} />
        </div>
      </div>
      <Emp00_Lookup_SelectMulti open={empOpen} transDate={dayjs().format('YYYY-MM-DD')} onResult={onEmpResult} onClose={() => setEmpOpen(false)} />
      <Org00_Lookup_SelectMulti baseDate={orgOpen ? dayjs().format('YYYY-MM-DD') : undefined} onSelect={onOrgSelect} onClose={() => setOrgOpen(false)} />
    </LookupModal>
  );
};
