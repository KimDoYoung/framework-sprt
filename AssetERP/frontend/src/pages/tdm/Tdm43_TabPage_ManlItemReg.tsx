/**
 * 매뉴얼(점검항목) 작성의 아래 점검항목 목록 (N17)
 * AS-IS: myApp/client/vi/tdm/Tdm43_TabPage_ManlItemReg.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L56-79: 툴바 "▼ 점검항목:" [등록][삭제][불러오기][작성완료][작성취소] + 점검항목 그리드(체크박스 다중: 수정 60 · 코드 80 · 점검항목 550 · 점검주기 250 · 점검방법 80 · 증빙자료 300)
 * 함께: Tdm43_Edit_Manl(등록·수정, E13-2)·Tdm43_Lookup_ManlItemRegList(불러오기)·AreaMessage(점검방법 보기)
 * UX보강(10): 해당 없음(원본 툴바에 [조회]가 없다)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Space, message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmManlCopyItem, TdmManlDutyReg, TdmManlItem } from '@/types/tdm';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { AreaMessage } from '@/components/lookup/AreaMessage';
import { Tdm43_Edit_Manl, ManlEditMode } from './Tdm43_Edit_Manl';
import { Tdm43_Lookup_ManlItemRegList } from './Tdm43_Lookup_ManlItemRegList';

const gb = gbFor<TdmManlItem>();

export interface ManlItemRegTarget {
  /** 위 그리드에서 고른 관리의무(AS-IS manlDutyModel) — 없으면 목록이 비고 버튼은 안내만 한다 */
  duty: TdmManlDutyReg | null;
  /** 같은 관리의무를 다시 눌러도 다시 읽게 하는 번호 (AS-IS retrieve(selectModel) 호출마다 +1) */
  nonce: number;
}

interface Props {
  target: ManlItemRegTarget;
  /** AS-IS callback.execute() — 작성완료·작성취소가 끝난 뒤 위 그리드를 다시 읽는다 */
  onEndChanged: () => void;
}

const confirmBox = (title: string, content: string, width: number) => new Promise<boolean>(resolve => {
  Modal.confirm({ title, content, width, onOk: () => resolve(true), onCancel: () => resolve(false) });
});

export const Tdm43_TabPage_ManlItemReg: React.FC<Props> = ({ target, onEndChanged }) => {
  const { duty } = target;
  const gridRef = useRef<AgGridReact<TdmManlItem>>(null);
  const [rows, setRows] = useState<TdmManlItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [ended, setEnded] = useState(false);   // checkButtonEnabled(endYn) — true면 [등록][삭제][불러오기]가 비활성
  const [edit, setEdit] = useState<{ mode: ManlEditMode; manl: TdmManlItem; endYn: boolean } | null>(null);
  const [howView, setHowView] = useState<TdmManlItem | null>(null);
  const [listOpen, setListOpen] = useState(false);

  // retrieve(selectModel) L198-214: checkButtonEnabled(endYn) → tdm.Tdm43_Manl.selectByManlDutyId(manlDutyId, orgId)
  const retrieve = useCallback(async (d: TdmManlDutyReg | null) => {
    if (!d) { setRows([]); return; }
    setEnded(d.endYn);
    setLoading(true);
    try {
      setRows(await tdmApi.searchManlItemsByDuty(d.manlDutyId, d.orgId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L56-79) → settings() / 부모의 retrieveTabPage() → retrieve(selectModel) · clear() L312-314
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(duty); }, [duty?.manlDutyId, duty?.orgId, target.nonce]);

  // buildGrid() L161-196 (setChecked MULTI) — actionCell01(Edit) L163-173, actionCell02(View) L174-182
  const columnDefs = useMemo(() => [
    iconCell<TdmManlItem>('edit', 'actionCell01', 60, '수정', row => {  // L188
      // 수정창 edit(model, endYn, cb) — 작성완료면 저장·연결 편집이 없다
      if (duty) setEdit({ mode: 'edit', manl: row, endYn: duty.endYn });
    }),
    gb.textCenter('manlCode', 80, '코드'),  // L189
    gb.textArea('checkItem', 550, '점검항목'),  // L190
    gb.text('checkCycleInfo', 250, '점검주기'),  // L191
    iconCell<TdmManlItem>('view', 'actionCell02', 80, '점검방법', row => setHowView(row)),  // L192 AreaMessage.open("점검방법", checkHow)
    gb.textArea('checkEvidDocName', 300, '증빙자료'),  // L193 addTextLimitArea
  ], [duty]);

  // [E1] insertButton[등록].Select [manlDutyModel == null] (L82): 관리의무를 먼저 고르게 하고 Tdm43_Edit_Manl.insert(관리의무 값, orgId, cb → retrieve())
  const insertManl = () => {
    if (!duty) { message.warning('상단의 관리의무를 먼저 선택해주세요'); return; }
    setEdit({
      mode: 'insert', endYn: false,
      manl: {
        manlId: 0, manlOrgId: duty.manlOrgId, orgId: duty.orgId, exctId: duty.exctId, roleId: duty.roleId, roleName: duty.roleName,
        taskId: duty.taskId, taskName: duty.taskName, taskRelateDetailId: duty.taskRelateDetailId, taskRelateDetailName: duty.taskRelateDetailName,
        taskRelateDutyId: duty.taskRelateDutyId, taskRelateDutyName: duty.taskRelateDutyName, manlDutyId: duty.manlDutyId,
      },
    });
  };

  // [E2] deleteButton[삭제].Select [cnt == 0] (L99): 고른 행이 없으면 안내 / 작성완료면 막고 / 확인(370)
  // [E3] messageBox.DialogHide [YES] (L114) → delete() L216-229: tdm.Tdm43_Manl.delete → 그리드에서 뺀다(다시 읽지 않는다)
  const deleteManl = async () => {
    const checked = gridRef.current?.api.getSelectedRows() ?? [];
    if (checked.length === 0) { message.warning('선택된 점검항목이 없습니다'); return; }
    if (duty?.endYn) { message.warning('작성완료되어 삭제할 수 없습니다'); return; }
    if (!await confirmBox('확인', `선택한 ${checked.length}건의 점검항목을 삭제하시겠습니까?`, 370)) return;
    try {
      await tdmApi.deleteManlItems(duty!.manlOrgId, checked.map(r => r.manlId));
      const gone = new Set(checked.map(r => r.manlId));
      setRows(prev => prev.filter(r => !gone.has(r.manlId)));
    } catch (err) {
      message.warning(errorMessage(err, '삭제 실패'));
    }
  };

  // [E4] loadButton[불러오기].Select [manlDutyModel == null] (L126): 관리의무를 먼저 고르게 하고 Tdm43_Lookup_ManlItemRegList.open(manlDutyModel, cb → copyManlList())
  const loadManl = () => {
    if (!duty) { message.warning('상단의 관리의무를 먼저 선택해주세요'); return; }
    setListOpen(true);
  };
  // copyManlList(list) L243-273: tdm.Tdm43_Manl.copyManlList → 끝나면 retrieve(manlDutyModel)
  const copyManlList = async (items: TdmManlCopyItem[]) => {
    if (!duty) return;
    try {
      await tdmApi.copyManls(duty, items.map(i => i.manlId));
      await retrieve(duty);
    } catch (err) {
      message.warning(errorMessage(err, '등록 실패'));
    }
  };

  // [E5] confirmButton[작성완료].Select (L147)·[E6] cancelButton[작성취소].Select (L153) → updateEndYn(endYn) L275-310
  const updateEndYn = async (endYn: boolean) => {
    if (!duty) return;
    if (duty.endYn && endYn) { message.warning('작성완료된 관리의무 점검항목입니다'); return; }
    if (!duty.endYn && !endYn) { message.warning('완료전 관리의무 점검항목입니다'); return; }
    if (rows.length === 0) { message.warning('점검항목이 없습니다'); return; }
    try {
      await tdmApi.updateManlDutyEnd({ manlDutyId: duty.manlDutyId, manlOrgId: duty.manlOrgId, orgId: duty.orgId, endYn });
      setEnded(endYn);        // checkButtonEnabled(endYn)
      onEndChanged();         // callback.execute() — 부모가 위 그리드를 다시 읽는다
    } catch (err) {
      message.warning(errorMessage(err, '잠겨진 매뉴얼입니다'));
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, borderBottom: '1px solid #d9d9d9' }}>
        <b style={{ color: '#15428b' }}>▼ 점검항목:</b>
        <Space>
          <Button type="register" disabled={ended} onClick={insertManl}>등록</Button>
          <Button type="delete" disabled={ended} onClick={deleteManl}>삭제</Button>
          <Button type="register" disabled={ended} onClick={loadManl}>불러오기</Button>
          <Button type="save" onClick={() => updateEndYn(true)}>작성완료</Button>
          <Button type="cancel" onClick={() => updateEndYn(false)}>작성취소</Button>
        </Space>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<TdmManlItem>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.manlId)}
          loading={loading}
        />
      </div>
      <Tdm43_Edit_Manl
        mode={edit?.mode ?? 'edit'}
        manl={edit?.manl ?? null}
        endYn={edit?.endYn}
        onSaved={() => void retrieve(duty)}
        onClose={() => setEdit(null)}
      />
      <AreaMessage open={!!howView} title="점검방법" value={howView?.checkHow} readOnly onClose={() => setHowView(null)} />
      <Tdm43_Lookup_ManlItemRegList target={listOpen ? duty : null} onResult={items => void copyManlList(items)} onClose={() => setListOpen(false)} />
    </div>
  );
};
