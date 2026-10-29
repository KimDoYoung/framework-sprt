/**
 * 화환신청 공유지정 창 — Bbs20_Edit_FloralRequest [설정]에서 연다 (T21)
 * AS-IS: myApp/client/vi/bbs/Bbs21_Lookup_FloralRequestShare.java (317줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L76-106: 모달 580×450 "화환신청 공유지정", 툴바 50(○직원 ●부서 · [행 추가][행 삭제] · 새로고침 아이콘), 그리드(구분 70·부서 250·성명 100, 체크 다중), 아래 가운데 [저장][닫기]
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Radio, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { AgGridReact } from 'ag-grid-react';
import dayjs from 'dayjs';
import { bbsFloralApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import { BbsFloralShare } from '@/types/bbs';
import { OrgInfo, TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { Emp00_Lookup_SelectMulti } from '@/components/lookup/Emp00_Lookup_SelectMulti';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Org00_Lookup_SelectMulti } from '@/components/lookup/Org00_Lookup_SelectMulti';

const gb = gbFor<BbsFloralShare>();

interface Props {
  /** open(floralRequestId, callbackResult) — 값이 있으면 열린다 */
  floralRequestId: number | null;
  /** callbackResult.execute(resultMsg): 저장 뒤 신청공유 문구. 받은 뒤 창이 닫힌다 */
  onResult: (shareInfo: string) => void;
  onClose: () => void;
}

export const Bbs21_Lookup_FloralRequestShare: React.FC<Props> = ({ floralRequestId, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<BbsFloralShare>>(null);
  const [rows, setRows] = useState<BbsFloralShare[]>([]);
  const [deleteList, setDeleteList] = useState<number[]>([]);
  const [shareType, setShareType] = useState<'1' | '2'>('2');  // ButtonSetting() L129-132: radio01 직원 false, radio02 부서 true
  const [empOpen, setEmpOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);
  const tempId = useRef(0);

  // retrieve() L305-311: 서비스 bbs.Bbs21_FloralRequestShare.selectByFloralRequestId(floralRequestId)
  const retrieve = async () => {
    if (floralRequestId == null) return;
    try {
      setRows(await bbsFloralApi.searchShares(floralRequestId));
      setDeleteList([]);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L76-106, open L113-117) → ButtonSetting(), retrieve()
  useEffect(() => {
    if (floralRequestId == null) return;
    setRows([]);
    setDeleteList([]);
    setShareType('2');
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floralRequestId]);

  const append = (list: BbsFloralShare[]) => {
    setRows(prev => [...prev, ...list]);
    // 03 원칙 17: 맨 아래에 넣고 보여 준다
    setTimeout(() => {
      const api = gridRef.current?.api;
      const last = list[list.length - 1];
      const node = last ? api?.getRowNode(String(last.floralRequestShareId)) : undefined;
      if (api && node?.rowIndex != null) api.ensureIndexVisible(node.rowIndex);
    }, 0);
  };

  // openLookupEmpInfo() L198-225: Emp00_Lookup_SelectMulti(오늘) → 구분 "1"·직원, 조직·사원
  const onEmpResult = (list: TransInfo[]) => {
    setEmpOpen(false);
    append(list.map(t => ({
      floralRequestShareId: --tempId.current, floralRequestId, shareCode: '1', shareName: '직원',
      orgId: t.orgCodeId ?? null, orgName: t.parentFullNm ?? null, personId: t.personId, personName: t.korNm ?? null,
    })));
  };

  // openLookupOrgInfo() L171-196: Org00_Lookup_SelectMulti(오늘) → 구분 "2"·부서, 조직
  const onOrgSelect = (list: OrgInfo[]) => {
    setOrgOpen(false);
    append(list.map(o => ({
      floralRequestShareId: --tempId.current, floralRequestId, shareCode: '2', shareName: '부서',
      orgId: o.orgCodeId, orgName: o.parentFullNm ?? null, personId: null, personName: null,
    })));
  };

  // [E4] insertButton[행 추가].Select (L136) → insertRow() L227-235: 직원이면 사원 조회창, 부서면 조직 조회창
  const insertRow = () => (shareType === '1' ? setEmpOpen(true) : setOrgOpen(true));

  // [E5] deleteButton[행 삭제].Select (L142) → deleteRow() L297-303: 체크한 행을 그리드에서 빼고 deleteList에 둔다 (저장 때 서버에서 지운다)
  const deleteRow = () => {
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) return;
    const ids = new Set(checked.map(c => c.floralRequestShareId));
    setDeleteList(prev => [...prev, ...checked.filter(c => c.floralRequestShareId > 0).map(c => c.floralRequestShareId)]);
    setRows(prev => prev.filter(r => !ids.has(r.floralRequestShareId)));
  };

  // [E1] updateButton[저장].Select (L83) → update() L237-272 → updateEnd() L274-295: 서비스 bbs.Bbs21_FloralRequestShare.delete + update → selectShareInfo → callback.execute(문구) → hide()
  const update = async () => {
    if (floralRequestId == null) return;
    try {
      const info = await bbsFloralApi.saveShares(floralRequestId, deleteList,
        rows.filter(r => r.floralRequestShareId <= 0).map(r => ({ shareCode: r.shareCode ?? '2', personId: r.personId ?? null, orgId: r.orgId ?? null })));
      onResult(info);
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // grid() L160-169
  const columnDefs = useMemo(() => [
    gb.textCenter('shareName', 70, '구분'),  // L164
    gb.text('orgName', 250, '부서'),  // L165
    gb.textCenter('personName', 100, '성명'),  // L166
  ], []);

  return (
    <LookupModal
      open={floralRequestId != null}
      title="화환신청 공유지정"
      width={580}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L89) → hide() */}
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
          {/* [E3] anchor.MouseDown (L122) → retrieve() */}
          <ReloadOutlined style={{ cursor: 'pointer' }} onClick={() => { void retrieve(); }} />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<BbsFloralShare> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.floralRequestShareId)} />
        </div>
      </div>
      <Emp00_Lookup_SelectMulti open={empOpen} transDate={dayjs().format('YYYY-MM-DD')} onResult={onEmpResult} onClose={() => setEmpOpen(false)} />
      <Org00_Lookup_SelectMulti baseDate={orgOpen ? dayjs().format('YYYY-MM-DD') : undefined} onSelect={onOrgSelect} onClose={() => setOrgOpen(false)} />
    </LookupModal>
  );
};
