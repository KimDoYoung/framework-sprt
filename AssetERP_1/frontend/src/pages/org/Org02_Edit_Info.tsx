/**
 * 조직정보 편집 폼 (C02) — Org02_Lookup_OrgInfo 오른쪽에 들어간다(ContentPanel).
 * AS-IS: myApp/client/vi/org/Org02_Edit_Info.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 공개 메서드(editData·update·deleteCheck)는 ref로 부른다.
 */
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DatePicker, Input, message, Modal, Space } from 'antd';
import { orgCodeApi } from '@/api/org';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { OrgCode } from '@/types/org';
import { Button } from '@/components/button';
import { CodeSelect } from '@/components/form/CodeSelect';
import { Org01_Move_OrgCode } from './Org01_Move_OrgCode';
import { OrgField, OrgForm, OrgRow, toForm, toReq, ymd } from './orgForm';

export interface Org02_Edit_InfoRef {
  /** editData(editModel, codeName, baseDate) L172-202 */
  editData: (editModel: Partial<OrgCode>, codeName: string | null, baseDate: string) => void;
  /** update(codeModel, treeGrid, callback) L232-248 → callback(1 저장 / -1 변경일이 개설일보다 앞) */
  update: (codeModel: Partial<OrgCode>, callback: (result: 1 | -1) => void) => Promise<void>;
  /** deleteCheck(treeGrid) L204-216 — 원본에서 부르는 곳이 없다 */
  deleteCheck: (callback?: () => void) => void;
}

const DATE_W = 200; // HorizontalLayoutData(200, -1)
const RED = '#CE4242'; // setHtmlStyle("변경일", "CE4242")

export const Org02_Edit_Info = forwardRef<Org02_Edit_InfoRef>((_, ref) => {
  const [f, setF] = useState<OrgForm | null>(null);
  const [baseDate, setBaseDate] = useState('');
  const [lookupDisabled, setLookupDisabled] = useState(false);
  const [dcrEnabled, setDcrEnabled] = useState(false);
  const [moveDate, setMoveDate] = useState<string | null>(null);
  const set = <K extends keyof OrgForm>(k: K, v: OrgForm[K]) => setF(prev => (prev ? { ...prev, [k]: v } : prev));

  useImperativeHandle(ref, () => ({
    // [E0] 생성자 L88-170 + editData() L172-202: 상위가 없으면 [상위조직변경] 비활성, 문서코드는 채번방식 '2'일 때만 활성
    editData: (editModel, codeName, base) => {
      setBaseDate(base);
      setLookupDisabled(codeName == null);
      setF(toForm(editModel, codeName ?? '상위조직이 없습니다'));
      sysApi.getDcrNumberingCode()
        .then(code => setDcrEnabled(code === '2'))
        .catch(err => message.error(errorMessage(err, '회사 조회 실패')));
    },

    update: async (codeModel, callback) => {
      if (!f) return;
      // 원본은 변경일이 비면 compareTo에서 멈춘다(NPE) → 경고로 멈춤
      if (!f.modDate) { message.warning('변경일은 필수입력 항목입니다'); return; }
      if (codeModel.openDate && codeModel.openDate > ymd(f.modDate)!) { callback(-1); return; }
      // TreeGridUpdate org.Org01_Code.update(companyId, baseDate = 변경일) → callback(1)
      try {
        await orgCodeApi.updateOrgCode(f.codeId!, toReq(f, ymd(f.modDate)!));
        callback(1);
      } catch (err) {
        message.error(errorMessage(err, '저장 실패'));
      }
    },

    deleteCheck: callback => {
      Modal.confirm({
        title: '삭제',
        content: '선택한 정보를 삭제하시겠습니까?',
        okText: '예',
        cancelText: '아니오',
        // [E3] messageBox.DialogHide [YES] (L207) → delete() L218-230: TreeGridDelete org.Org01_Code.delete(companyId, baseDate)
        onOk: async () => {
          if (!f?.codeId || !f.infoId) return;
          try {
            await orgCodeApi.deleteOrgCode(f.codeId, f.infoId);
            callback?.();
          } catch (err) {
            message.error(errorMessage(err, '삭제 실패'));
          }
        },
      });
    },
  }), [f]);

  // [E2] parentLookupButton[상위조직변경].Select (L102) → Org01_Move_OrgCode.open(baseDate) → 같은 상위면 경고
  const onMoveSelect = (parentOrgModel: OrgCode) => {
    if (!f) return;
    if (f.parentCodeId === parentOrgModel.codeId) {
      message.warning('동일한 조직은 등록할 수 없습니다');
      return;
    }
    setF({ ...f, parentOrgName: parentOrgModel.korNm ?? '', parentCodeId: parentOrgModel.codeId });
  };

  return (
    <div style={{ border: '1px solid #d9d9d9', height: '100%', padding: '10px 20px', overflow: 'auto', background: '#fff' }}>
      {f && (
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <OrgRow>
            <OrgField label="상위조직" width={380}><Input value={f.parentOrgName} readOnly /></OrgField>
            <Button type="change" disabled={lookupDisabled} onClick={() => setMoveDate(baseDate)}>상위조직변경</Button>
          </OrgRow>
          <OrgRow>
            <OrgField label="변경일" width={DATE_W} color={RED}><DatePicker style={{ width: '100%' }} value={f.modDate} onChange={v => set('modDate', v)} format="YYYY-MM-DD" /></OrgField>
            <OrgField label="변경사유" color={RED}><Input value={f.modReason} onChange={e => set('modReason', e.target.value)} /></OrgField>
          </OrgRow>
          <OrgRow>
            <OrgField label="조직코드" width={DATE_W}><Input value={f.orgCd} disabled /></OrgField>
            <OrgField label="조직명"><Input value={f.korNm} onChange={e => set('korNm', e.target.value)} /></OrgField>
          </OrgRow>
          <OrgRow>
            {/* [E1] levelName[조직레벨].Collapse (L96) → levelCode = 선택 코드 */}
            <OrgField label="조직레벨" width={DATE_W}><CodeSelect kindCd="OrgLevelCode" style={{ width: '100%' }} value={f.levelCd} onChange={v => set('levelCd', v)} /></OrgField>
            <OrgField label="정렬순서" width={DATE_W}><Input value={f.sortOrder} onChange={e => set('sortOrder', e.target.value)} /></OrgField>
          </OrgRow>
          <OrgRow>
            <OrgField label="주요업무"><Input value={f.note} onChange={e => set('note', e.target.value)} /></OrgField>
          </OrgRow>
          <OrgRow>
            <OrgField label="문서코드" width={DATE_W}><Input value={f.dcrIdWord} disabled={!dcrEnabled} onChange={e => set('dcrIdWord', e.target.value)} /></OrgField>
          </OrgRow>
          <OrgRow>
            <OrgField label="개설일" width={DATE_W}><DatePicker style={{ width: '100%' }} value={f.openDate} disabled format="YYYY-MM-DD" /></OrgField>
            <OrgField label="개설사유"><Input value={f.openReason} disabled /></OrgField>
          </OrgRow>
          <OrgRow>
            <OrgField label="종료일" width={DATE_W}><DatePicker style={{ width: '100%' }} value={f.closeDate} onChange={v => set('closeDate', v)} format="YYYY-MM-DD" /></OrgField>
            <OrgField label="종료사유"><Input value={f.closeReason} onChange={e => set('closeReason', e.target.value)} /></OrgField>
          </OrgRow>
        </Space>
      )}
      <Org01_Move_OrgCode baseDate={moveDate} onSelect={onMoveSelect} onClose={() => setMoveDate(null)} />
    </div>
  );
});
Org02_Edit_Info.displayName = 'Org02_Edit_Info';
