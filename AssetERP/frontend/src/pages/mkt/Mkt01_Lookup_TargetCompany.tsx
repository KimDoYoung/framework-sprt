/**
 * 활동처 및 이익제공처 추가·수정 창 (Z05) — Mkt01_Grid_TargetCompany의 [등록]·수정 아이콘, Mkt03_Lookup_History의 [활동처 바로가기]에서 연다
 * AS-IS: myApp/client/vi/mkt/Mkt01_Lookup_TargetCompany.java (470줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L97-116: 모달 "활동처 및 이익제공처 추가" 1260×650, 라벨 폭 110 — 활동처구분(콤보 "선택하세요")·활동처·주요사항(높이 67)·담당자(툴바 40 + 셀 편집 그리드 200)·업무활동공유(읽기 전용 + [설정])·안내 글·미사용, 아래 가운데 [저장][닫기]
 * 스타일: MFG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Checkbox, Input, message, Space, Typography } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { LookupModal } from '@/components/lookup/LookupModal';
import { mktManagerApi, mktTargetCompanyApi } from '@/api/mkt';
import { errorMessage } from '@/api/client';
import { MktManager, MktTargetCompany } from '@/types/mkt';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Mkt01_Lookup_SelectCompany } from './Mkt01_Lookup_SelectCompany';
import { Mkt05_Lookup_Share } from './Mkt05_Lookup_Share';

const gb = gbFor<MktManager>();

// managerGirdBuilder() L303-317 (setChecked MULTI, 셀 편집)
const columnDefs = [
  gb.textCenter('managerName', 80, '담당자', { editor: 'text' }),   // L308
  gb.text('orgName', 130, '부서', { editor: 'text' }),              // L309
  gb.textCenter('posName', 100, '직위', { editor: 'text' }),        // L310
  gb.text('tel', 200, '전화', { editor: 'text' }),                  // L311
  gb.text('emailAddr', 180, '이메일', { editor: 'text' }),          // L312
  gb.textArea('note', 230, '비고', { editor: 'text' }),             // L313
  gb.text('retireInfo', 100, '퇴직정보', { editor: 'text' }),       // L314
];

/** 라벨 폭 110 (form.setLabelWidth(110)) */
const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
    <Typography.Text style={{ width: 110, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10, color: required ? '#0069B4' : undefined }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

export interface MktTargetCompanyTarget {
  /** null이면 새 활동처(openNew), 값이 있으면 그 활동처 */
  id: number | null;
  /** open(model, callback): 목록 행이 있으면 그대로 쓰고, 없으면 open2(targetCompanyId)처럼 서버에서 읽는다 */
  row?: MktTargetCompany;
}

interface Props {
  /** 값이 있으면 열린다 */
  target: MktTargetCompanyTarget | null;
  /** update() L390-425: 저장한 활동처 (grid.getStore().update) */
  onSaved?: (row: MktTargetCompany) => void;
  onClose: () => void;
}

const n = (s: string | null | undefined) => (s == null || s === '' ? null : s);

export const Mkt01_Lookup_TargetCompany: React.FC<Props> = ({ target, onSaved, onClose }) => {
  const [f, setF] = useState<MktTargetCompany | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteIds, setDeleteIds] = useState<number[]>([]);
  const [selectManagers, setSelectManagers] = useState<MktManager[] | null>(null);
  const [shareParent, setShareParent] = useState<number | null>(null);
  const ctxId = useRef<number | null>(null);

  const crud = useGridCrud<MktManager>({
    idField: 'managerId',
    // retrieveManager() L376-388: mkt.Mkt02_Manager.selectByTargetCompanyId
    search: useCallback(() => (ctxId.current == null ? Promise.resolve([]) : mktManagerApi.search(ctxId.current)), []),
    // managerInsertRow() L319-326: 활동처 ID·회사만 채운 새 행
    newRow: () => ({ targetCompanyId: ctxId.current ?? 0 }),
    firstEditField: 'managerName',
    // 저장·삭제는 [저장]이 한 번에 보낸다(managerUpdate() L336-374) — 이 훅의 save·remove는 쓰지 않는다
    save: async rows => rows,
    remove: async () => 0,
  });
  const { retrieve: crudRetrieve, clear: crudClear } = crud;

  const retrieveManager = useCallback(async () => {
    setDeleteIds([]);
    await crudRetrieve();
  }, [crudRetrieve]);

  // [E0] 화면 열림 (생성자 L97-116) → getEditor(), show() · openNew() L118-151 / open() L166-175 / open2() L153-164
  useEffect(() => {
    if (!target) { setF(null); setDeleteIds([]); crudClear(); ctxId.current = null; return; }
    let alive = true;
    void (async () => {
      try {
        if (target.id == null) {
          // openNew(): getSeq → 비어 있는 모델 (회사, 미사용 false)
          const id = await mktTargetCompanyApi.nextId();
          if (!alive) return;
          ctxId.current = id;
          setF({ targetCompanyId: id, itemTypeCode: null, targetCompanyName: null, addr: null, tel: null, note: null, unuseYn: false, itemTypeName: null, managerInfo: null, shareInfo: null });
          setDeleteIds([]);
          crudClear();
        } else {
          const model = target.row ?? await mktTargetCompanyApi.get(target.id);
          if (!alive) return;
          ctxId.current = model.targetCompanyId;
          setF(model);
          await retrieveManager();
        }
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  if (!f) return null;
  const set = <K extends keyof MktTargetCompany>(k: K, v: MktTargetCompany[K]) => setF(prev => prev && { ...prev, [k]: v });
  const unsaved = deleteIds.length > 0 || crud.hasChanges();

  // [E1] insertManagerButton[행 추가].Select (L182) → managerInsertRow() L319-326
  const managerInsertRow = () => crud.addRow();

  // [E2] deleteManagerButton[행 삭제].Select (L188) → managerDeleteRow() L328-334: 고른 행을 그리드에서 빼고 managerDeleteList에 둔다
  const managerDeleteRow = () => {
    const selected = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length === 0) return;
    const ids = selected.map(r => r.managerId);
    setDeleteIds(prev => [...prev, ...ids.filter(id => id > 0)]);
    crud.removeRows(ids);
  };

  // [E3] updateManagerButton[저장].Select (L194) → managerUpdate() L336-374: mkt.Mkt02_Manager.delete → mkt.Mkt02_Manager.update
  const managerUpdate = async () => {
    const changed = crud.getChanged();
    if (deleteIds.length === 0 && changed.length === 0) {
      message.warning('저장할 내역이 없습니다.');
      return;
    }
    if (changed.some(r => !r.managerName)) {
      message.warning('담당자를 입력하세요');
      return;
    }
    try {
      if (deleteIds.length > 0) await mktManagerApi.remove(deleteIds);
      if (changed.length > 0) await mktManagerApi.save(changed.map(r => ({ ...r, targetCompanyId: ctxId.current! })));
      await retrieveManager();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E4] companyChangeButton[활동처 변경].Select (L200) → companyChange() L427-440
  const companyChange = () => {
    const selected = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length === 0) {
      message.warning('선택된 담당자가 없습니다');
      return;
    }
    setSelectManagers(selected);
  };

  // [E6] updateButton[저장].Select (L213) → update() L390-425: mkt.Mkt01_TargetCompany.updateOne → grid.store.update() + callback + hide()
  const update = async () => {
    if (!f.itemTypeCode) return message.warning('활동처구분을 선택하세요');
    if (!f.targetCompanyName) return message.warning('활동처를 입력하세요');
    if (unsaved) return message.warning('변경 또는 삭제되지 않은 담당자 정보가 존재합니다. 담당자 저장 버튼을 클릭한 후 진행하세요');
    setSaving(true);
    try {
      const saved = await mktTargetCompanyApi.save({
        targetCompanyId: f.targetCompanyId, itemTypeCode: f.itemTypeCode, targetCompanyName: f.targetCompanyName.trim(),
        addr: n(f.addr), tel: n(f.tel), note: n(f.note), unuseYn: !!f.unuseYn,
      });
      onSaved?.(saved);
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // [E7] cancleButton[닫기].Select (L219) → 저장하지 않은 담당자 정보가 있으면 안내만, 아니면 hide()
  const cancel = () => {
    if (unsaved) {
      message.warning('변경 또는 삭제되지 않은 담당자 정보가 존재합니다. 담당자 저장 또는 새로고침하여 확인해 주세요');
      return;
    }
    onClose();
  };

  return (
    <LookupModal
      open
      title="활동처 및 이익제공처 추가"
      width={1260}
      style={{ top: 20 }}
      maskClosable={false}
      onCancel={cancel}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            <Button type="close" onClick={cancel}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px', maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
        <Field label="활동처구분" required>
          <SystemCodeComboBox kindCd="CrmItemTypeCode" style={{ width: 500 }} placeholder="선택하세요" value={f.itemTypeCode ?? undefined}
            onChange={(code, name) => setF(prev => prev && { ...prev, itemTypeCode: code ?? null, itemTypeName: name ?? null })} />
        </Field>
        <Field label="활동처" required>
          <Input style={{ width: 500 }} value={f.targetCompanyName ?? ''} onChange={e => set('targetCompanyName', e.target.value)} />
        </Field>
        <Field label="주요사항"><Input.TextArea style={{ height: 67 }} value={f.note ?? ''} onChange={e => set('note', e.target.value)} /></Field>
        <Field label="담당자">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Button type="addRow" onClick={managerInsertRow}>행 추가</Button>
              <Button type="removeRow" onClick={managerDeleteRow}>행 삭제</Button>
              <Button type="save" count={{ ...crud.changes, modified: crud.changes.modified + deleteIds.length }} onClick={managerUpdate}>저장</Button>
              <Button type="change" onClick={companyChange}>활동처 변경</Button>
              {/* [E5] refreshManagerButton.MouseDown (L206) → retrieveManager() */}
              <ReloadOutlined style={{ cursor: 'pointer' }} onMouseDown={() => void retrieveManager()} />
            </div>
            <div style={{ height: 200 }}>
              <CellEditGrid<MktManager> crud={crud} columnDefs={columnDefs} />
            </div>
          </div>
        </Field>
        <Field label="업무활동공유">
          <Space>
            <Input style={{ width: 500 }} readOnly value={f.shareInfo ?? ''} />
            {/* [E8] shareButton[설정].Select (L234) → lookupShare() L442-452 */}
            <Button type="register" onClick={() => setShareParent(f.targetCompanyId)}>설정</Button>
          </Space>
        </Field>
        <Typography.Text type="secondary" style={{ marginLeft: 110, fontSize: 12 }}>(업무활동내역 생성시 공유기본 설정에 따라 공유정보가 기본값으로 초기 등록됩니다.)</Typography.Text>
        <Field label="미사용"><Checkbox checked={!!f.unuseYn} onChange={e => set('unuseYn', e.target.checked)} /></Field>
      </div>
      <Mkt01_Lookup_SelectCompany managers={selectManagers} onDone={() => void retrieveManager()} onClose={() => setSelectManagers(null)} />
      <Mkt05_Lookup_Share parentId={shareParent} onResult={info => set('shareInfo', info)} onClose={() => setShareParent(null)} />
    </LookupModal>
  );
};
