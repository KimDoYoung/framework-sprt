/**
 * 조직상세 정보 팝업 (C02) — Org01_Tab_OrgCode [하위조직등록]에서 연다(insertData).
 * AS-IS: myApp/client/vi/org/Org01_Edit_OrgCode.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 수정 모드(삭제 버튼)는 원본에서도 이 화면에서 열리지 않지만(호출처는 insertData뿐) 원본대로 둔다.
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, message, Modal, Space } from 'antd';
import dayjs from 'dayjs';
import { orgCodeApi } from '@/api/org';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { OrgCode } from '@/types/org';
import { Button } from '@/components/button';
import { CodeSelect } from '@/components/form/CodeSelect';
import { Org01_Move_OrgCode } from './Org01_Move_OrgCode';
import { OrgField, OrgForm, OrgRow, toForm, toReq } from './orgForm';

export interface OrgEditTarget {
  /** 트리의 상위 조직 (없으면 "상위조직이 없습니다") */
  parentModel: OrgCode | null;
  /** 등록이면 parentCodeId만 있는 새 모델 */
  editModel: Partial<OrgCode>;
  baseDate: string;
  actionCode: 'insertData' | 'editData';
}

interface Props {
  /** editData(treeGrid, parentModel, editModel, baseDate, actionCode, callback) L112-277 — 값이 있으면 열린다 */
  target: OrgEditTarget | null;
  onClose: () => void;
  /** callback.execute(result): 저장 → 저장한 조직, 삭제 → 상위 조직 */
  onSaved: (model: Partial<OrgCode> | null) => void;
}

const DATE_W = 210; // AS-IS HorizontalLayoutData(200, -1). 날짜 칸 최소 140 + 라벨 70이 들어가게 210

export const Org01_Edit_OrgCode: React.FC<Props> = ({ target, onClose, onSaved }) => {
  const [f, setF] = useState<OrgForm | null>(null);
  const [numberingCode, setNumberingCode] = useState('1'); // L93 기본 "1"
  const [moveDate, setMoveDate] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof OrgForm>(k: K, v: OrgForm[K]) => setF(prev => (prev ? { ...prev, [k]: v } : prev));
  const insert = target?.actionCode === 'insertData';

  // [E0] editData() L112-277: 회사 문서번호 채번방식(sys.Sys01_Company.selectById) → '1'이면 문서코드 비활성. 폼 값, 등록이면 개설일 = 오늘
  useEffect(() => {
    if (!target) { setF(null); return; }
    const form = toForm(target.editModel, target.parentModel ? target.parentModel.korNm ?? '' : '상위조직이 없습니다');
    if (target.actionCode === 'insertData') form.openDate = dayjs(); // openDate.setValue(LoginUser.getToday())
    setF(form);
    setNumberingCode('1');
    sysApi.getDcrNumberingCode().then(setNumberingCode).catch(err => message.error(errorMessage(err, '회사 조회 실패')));
  }, [target]);

  // [E4] closeButton[닫기].Select (L174) → hide()
  const hide = () => onClose();

  // [E3] updateButton[저장].Select (L168) → update() L279-322
  const update = async () => {
    if (!target || !f) return;
    if (numberingCode !== '1' && !f.dcrIdWord) return message.warning('문서코드는 필수입력 항목입니다');
    if (!f.openDate) return message.warning('개설일은 필수입력 항목입니다');
    if (!f.openReason) return message.warning('개설사유는 필수입력 항목입니다');
    if (!f.orgCd) return message.warning('조직코드는 필수입력 항목입니다');
    if (!f.levelCd) return message.warning('조직레벨은 필수입력 항목입니다');
    if (f.modDate && f.openDate.isAfter(f.modDate, 'day')) return message.warning('변경일은 개설일 이후여야 합니다');
    // TreeGridUpdate org.Org01_Code.update(companyId, baseDate) → hide() → callback.execute(orgCodeModel)
    setSaving(true);
    try {
      const req = toReq(f, target.baseDate);
      const saved = insert ? await orgCodeApi.createOrgCode(req) : await orgCodeApi.updateOrgCode(f.codeId!, req);
      hide();
      onSaved(saved ?? { codeId: f.codeId ?? undefined });
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // [E5] deleteButton[삭제].Select (L257, 수정 모드만) → deleteCheck() L324-336
  const deleteCheck = () => {
    Modal.confirm({
      title: '삭제',
      content: '선택한 정보를 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      // [E6] messageBox.DialogHide [YES] (L327) → delete()
      onOk: () => remove(),
    });
  };

  // delete() L338-352: TreeGridDelete org.Org01_Code.delete(companyId, baseDate) → hide() → callback.execute(parentModel)
  const remove = async () => {
    if (!target || !f?.codeId || !f.infoId) return;
    try {
      await orgCodeApi.deleteOrgCode(f.codeId, f.infoId);
      hide();
      onSaved(target.parentModel);
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // [E2] parentLookupButton[상위조직변경].Select (L149) → Org01_Move_OrgCode.open(baseDate) → 같은 상위면 경고
  const onMoveSelect = (parentOrgModel: OrgCode) => {
    if (!f) return;
    if (f.parentCodeId === parentOrgModel.codeId) {
      message.warning('동일한 조직은 등록할 수 없습니다');
      return;
    }
    setF({ ...f, parentOrgName: parentOrgModel.korNm ?? '', parentCodeId: parentOrgModel.codeId });
  };

  const dcrDisabled = numberingCode === '1';

  return (
    <Modal
      open={!!target && !!f}
      title="조직상세 정보"
      width={600}
      maskClosable={false}
      onCancel={hide}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {!insert && <Button type="delete" onClick={deleteCheck}>삭제</Button>}
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            <Button type="close" onClick={hide}>닫기</Button>
          </Space>
        </div>
      }
    >
      {f && (
        <Space direction="vertical" size={16} style={{ width: 560, padding: '10px 0' }}>
          <OrgRow>
            <OrgField label="상위조직" width={380}><Input value={f.parentOrgName} readOnly /></OrgField>
            <Button type="change" onClick={() => setMoveDate(target!.baseDate)}>상위조직변경</Button>
          </OrgRow>
          {insert ? (
            <>
              <OrgRow>
                <OrgField label="개설일" width={DATE_W}><DatePicker style={{ width: '100%' }} value={f.openDate} onChange={v => set('openDate', v)} format="YYYY-MM-DD" /></OrgField>
                <OrgField label="개설사유"><Input value={f.openReason} onChange={e => set('openReason', e.target.value)} /></OrgField>
              </OrgRow>
              <OrgRow>
                <OrgField label="조직코드" width={DATE_W}><Input value={f.orgCd} onChange={e => set('orgCd', e.target.value)} /></OrgField>
                <OrgField label="조직명"><Input value={f.korNm} onChange={e => set('korNm', e.target.value)} /></OrgField>
              </OrgRow>
              <OrgRow>
                {/* [E1] levelName[조직레벨].Collapse (L143) → levelCode = 선택 코드 */}
                <OrgField label="조직레벨" width={DATE_W}><CodeSelect kindCd="OrgLevelCode" style={{ width: '100%' }} value={f.levelCd} onChange={v => set('levelCd', v)} /></OrgField>
                <OrgField label="정렬순서" width={DATE_W}><Input value={f.sortOrder} onChange={e => set('sortOrder', e.target.value)} /></OrgField>
              </OrgRow>
              <OrgRow>
                <OrgField label="주요업무"><Input value={f.note} onChange={e => set('note', e.target.value)} /></OrgField>
              </OrgRow>
              <OrgRow>
                <OrgField label="문서코드" width={DATE_W}><Input value={f.dcrIdWord} disabled={dcrDisabled} onChange={e => set('dcrIdWord', e.target.value)} /></OrgField>
              </OrgRow>
              <OrgRow>
                <OrgField label="종료일" width={DATE_W}><DatePicker style={{ width: '100%' }} value={f.closeDate} disabled format="YYYY-MM-DD" /></OrgField>
                <OrgField label="종료사유"><Input value={f.closeReason} disabled /></OrgField>
              </OrgRow>
            </>
          ) : (
            <>
              <OrgRow>
                <OrgField label="변경일" width={DATE_W}><DatePicker style={{ width: '100%' }} value={f.modDate} onChange={v => set('modDate', v)} format="YYYY-MM-DD" /></OrgField>
                <OrgField label="변경사유"><Input value={f.modReason} onChange={e => set('modReason', e.target.value)} /></OrgField>
              </OrgRow>
              <OrgRow>
                <OrgField label="조직코드" width={DATE_W}><Input value={f.orgCd} disabled /></OrgField>
                <OrgField label="조직명"><Input value={f.korNm} onChange={e => set('korNm', e.target.value)} /></OrgField>
              </OrgRow>
              <OrgRow>
                <OrgField label="조직레벨" width={DATE_W}><CodeSelect kindCd="OrgLevelCode" style={{ width: '100%' }} value={f.levelCd} onChange={v => set('levelCd', v)} /></OrgField>
                <OrgField label="정렬순서" width={DATE_W}><Input value={f.sortOrder} onChange={e => set('sortOrder', e.target.value)} /></OrgField>
              </OrgRow>
              <OrgRow>
                <OrgField label="개설일" width={DATE_W}><DatePicker style={{ width: '100%' }} value={f.openDate} disabled format="YYYY-MM-DD" /></OrgField>
                <OrgField label="개설사유"><Input value={f.openReason} disabled /></OrgField>
              </OrgRow>
              <OrgRow>
                <OrgField label="종료일" width={DATE_W}><DatePicker style={{ width: '100%' }} value={f.closeDate} onChange={v => set('closeDate', v)} format="YYYY-MM-DD" /></OrgField>
                <OrgField label="종료사유"><Input value={f.closeReason} onChange={e => set('closeReason', e.target.value)} /></OrgField>
              </OrgRow>
              <OrgRow>
                <OrgField label="비고"><Input.TextArea style={{ height: 100 }} value={f.note} onChange={e => set('note', e.target.value)} /></OrgField>
              </OrgRow>
            </>
          )}
        </Space>
      )}
      <Org01_Move_OrgCode baseDate={moveDate} onSelect={onMoveSelect} onClose={() => setMoveDate(null)} />
    </Modal>
  );
};
