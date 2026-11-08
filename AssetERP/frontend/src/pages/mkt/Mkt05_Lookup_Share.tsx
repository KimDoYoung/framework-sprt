/**
 * 공유지정 창 (Z05) — Mkt01_Lookup_TargetCompany·Mkt03_Lookup_History의 [설정]에서 연다
 * AS-IS: myApp/client/vi/mkt/Mkt05_Lookup_Share.java (319줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L77-107: 모달 "공유지정" 580×450, 위 = 직원/부서 라디오(기본 부서) + [행 추가][행 삭제] + 새로고침, 아래 = 체크 다중 그리드(구분 70·부서 250·성명 100), 아래 가운데 [저장][닫기]
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Radio, Space } from 'antd';
import dayjs from 'dayjs';
import { ReloadOutlined } from '@ant-design/icons';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Org00_Lookup_SelectMulti } from '@/components/lookup/Org00_Lookup_SelectMulti';
import { Emp00_Lookup_SelectMulti } from '@/components/lookup/Emp00_Lookup_SelectMulti';
import { mktShareApi } from '@/api/mkt';
import { errorMessage } from '@/api/client';
import { MktShare } from '@/types/mkt';
import { OrgInfo, TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';

const gb = gbFor<MktShare>();
const TODAY = () => dayjs().format('YYYY-MM-DD');

interface Props {
  /** open(parentId, callbackResult) L109-118 — 활동처 ID 또는 활동내역 ID. 값이 있으면 열린다 */
  parentId: number | null;
  /** updateEnd() L277-298: 저장 뒤 공유 요약(없으면 빈 글자)을 주고 닫는다 */
  onResult: (shareInfo: string) => void;
  onClose: () => void;
}

// grid() L161-170 (setChecked MULTI)
const columnDefs = [
  gb.textCenter('shareName', 70, '구분'),   // L165
  gb.text('orgName', 250, '부서'),          // L166
  gb.textCenter('personName', 100, '성명'), // L167
];

export const Mkt05_Lookup_Share: React.FC<Props> = ({ parentId, onResult, onClose }) => {
  const open = parentId != null;
  const [rows, setRows] = useState<MktShare[]>([]);
  const [deleteIds, setDeleteIds] = useState<number[]>([]);
  const [checked, setChecked] = useState<MktShare[]>([]);
  // ButtonSetting() L120-159: radio01 직원(false) · radio02 부서(true)
  const [kind, setKind] = useState<'1' | '2'>('2');
  const [orgOpen, setOrgOpen] = useState(false);
  const [empOpen, setEmpOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tempId, setTempId] = useState(0);

  // retrieve() L308-313: mkt.Mkt05_Share.selectByParentId(parentId)
  const retrieve = useCallback(async () => {
    if (parentId == null) return;
    setDeleteIds([]);
    setChecked([]);
    try {
      setRows(await mktShareApi.search(parentId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [parentId]);

  // [E0] 화면 열림 (생성자 L77-107) → show() · open() → ButtonSetting(), retrieve()
  useEffect(() => {
    if (!open) return;
    setKind('2');
    setRows([]);
    void retrieve();
  }, [open, retrieve]);

  const addRows = (list: Omit<MktShare, 'shareId' | 'parentId'>[]) => {
    setRows(prev => {
      let id = tempId;
      const added = list.map(r => { id -= 1; return { ...r, shareId: id, parentId: parentId! }; });
      setTempId(id);
      return [...prev, ...added];
    });
  };

  // openLookupOrgInfo() L172-198: 부서 — shareCode "2", 부서명 = 조직 전체 이름
  const onOrgs = (orgs: OrgInfo[]) => {
    setOrgOpen(false);
    addRows(orgs.map(o => ({ shareCode: '2', shareName: '부서', orgId: o.orgCodeId, orgName: o.parentFullNm ?? null, personId: null, personName: null })));
  };

  // openLookupEmpInfo() L200-228: 직원 — shareCode "1", 부서·성명
  const onEmps = (list: TransInfo[]) => {
    setEmpOpen(false);
    addRows(list.map(t => ({ shareCode: '1', shareName: '직원', orgId: t.orgCodeId ?? null, orgName: t.parentFullNm ?? null, personId: t.personId, personName: t.korNm ?? null })));
  };

  // [E4] insertButton[행 추가].Select (L137) → insertRow() L230-238
  const insertRow = () => (kind === '1' ? setEmpOpen(true) : setOrgOpen(true));

  // [E5] deleteButton[행 삭제].Select (L143) → deleteRow() L300-306: 고른 행을 그리드에서 빼고 deleteList에 둔다
  const deleteRow = () => {
    if (checked.length === 0) return;
    const ids = new Set(checked.map(r => r.shareId));
    setDeleteIds(prev => [...prev, ...checked.map(r => r.shareId).filter(id => id > 0)]);
    setRows(prev => prev.filter(r => !ids.has(r.shareId)));
    setChecked([]);
  };

  // [E1] updateButton[저장].Select (L84) → update() L240-275: 지울 행 삭제 + 새 행 저장(둘 다 없으면 아무 일도 없다 — 원본 그대로)
  const update = async () => {
    const newRows = rows.filter(r => r.shareId <= 0);
    if (deleteIds.length === 0 && newRows.length === 0) return;
    setSaving(true);
    try {
      const info = await mktShareApi.save(parentId!, newRows, deleteIds);
      onResult(info ?? '');
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  const grid = useMemo(() => (
    <MultiGrid<MktShare>
      rowData={rows}
      columnDefs={columnDefs}
      getRowId={p => String(p.data.shareId)}
      rowClick
      onCheckedChange={setChecked}
    />
  ), [rows]);

  return (
    <LookupModal
      open={open}
      title="공유지정"
      width={600}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L90) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Radio.Group value={kind} onChange={e => setKind(e.target.value)}>
            <Radio value="1">직원</Radio>
            <Radio value="2">부서</Radio>
          </Radio.Group>
          <Button type="addRow" onClick={insertRow}>행 추가</Button>
          <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
          {/* [E3] anchor.MouseDown (L123) → retrieve() */}
          <ReloadOutlined style={{ cursor: 'pointer' }} onMouseDown={() => void retrieve()} />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>{grid}</div>
      </div>
      <Org00_Lookup_SelectMulti baseDate={orgOpen ? TODAY() : undefined} onClose={() => setOrgOpen(false)} onSelect={onOrgs} />
      <Emp00_Lookup_SelectMulti open={empOpen} transDate={TODAY()} onResult={onEmps} onClose={() => setEmpOpen(false)} />
    </LookupModal>
  );
};
