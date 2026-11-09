/**
 * 책무배분 수정창 (N11) — 임원별 직책배정 그리드의 수정 아이콘이 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm30_Edit_RoleAllcModify.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 550×250(원본): 직책(수정 불가) · 담당임원(조회창) + 겸직여부 · 직책부여일 + 직책해제일 + [저장][닫기]
 * 저장해도 창은 닫히지 않는다(원본 update() L270-287은 hide()를 부르지 않는다) — 부르는 쪽이 받은 행으로 그리드 행만 바꾼다
 * UX보강(10): 조회창(UX-05)
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, DatePicker, Input, message, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmRoleAllc } from '@/types/tdm';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { EditModal, EditRow, EditField } from '@/components/form/EditForm';
import { Tdm01_Lookup_SelectSingle } from './Tdm01_Lookup_SelectSingle';
import { checkRoleAllcMerge } from './tdmRoleAllcCheck';

const FORMAT = 'YYYY-MM-DD';
const BLUE = '#0069B4';   // setHtmlStyle(…, "0069B4") 필수 항목 라벨

interface Props {
  /** 고른 직책배정 (값이 있으면 열림, open(selectModel, baseDate, callBack)) */
  target: TdmRoleAllc | null;
  /** 부르는 화면의 기준일 'yyyy-MM-dd' — 본업무 검사 기준 */
  baseDate: string;
  /** AS-IS callBack.execute(updateModel) — 저장된 행. 창은 그대로 둔다 */
  onSaved: (row: TdmRoleAllc) => void;
  onClose: () => void;
}

const lb = (text: string, required?: boolean) => <span style={{ fontWeight: 'bold', color: required ? BLUE : undefined }}>{text}</span>;

export const Tdm30_Edit_RoleAllcModify: React.FC<Props> = ({ target, baseDate, onSaved, onClose }) => {
  const [personId, setPersonId] = useState<number | null>(null);
  const [personName, setPersonName] = useState('');
  const [addTitleYn, setAddTitleYn] = useState(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [personLookup, setPersonLookup] = useState(false);

  // [E0] 화면 열림 (생성자 L69-75) → open() L77-92: editDriver.edit(고른 행)
  useEffect(() => {
    if (!target) return;
    setPersonId(target.personId);
    setPersonName(target.personName ?? '');
    setAddTitleYn(target.addTitleYn);
    setStartDate(target.startDate ? dayjs(target.startDate) : null);
    setEndDate(target.endDate ? dayjs(target.endDate) : null);
  }, [target]);

  // [E2] updateButton[저장].Select (L119) → updateChk() L161-178
  const updateChk = async () => {
    if (!personName) { message.warning('담당임원은 필수선택 항목입니다'); return; }
    if (!startDate) { message.warning('직책부여일은 필수선택 항목입니다'); return; }
    if (endDate && startDate.format(FORMAT) > endDate.format(FORMAT)) { message.warning('직책해제일은 직책부여일보다 미래일이어야 합니다.'); return; }
    await updateChk02();
  };

  // updateChk02() L180-268: tdm.Tdm30_RoleAllc.notInRoleAllcIdList(이 행 제외) → 본업무 갯수·직책기간 겹침 검사 → update() L270-287
  const updateChk02 = async () => {
    if (!target) return;
    try {
      const others = await tdmApi.searchRoleAllcOthers([target.roleAllcId]);
      const mine = {
        personId, personName, roleId: target.roleId, roleName: target.roleName, addTitleYn,
        startDate: startDate!.format(FORMAT), endDate: endDate ? endDate.format(FORMAT) : null,
      };
      const invalid = checkRoleAllcMerge([mine, ...others], baseDate);
      if (invalid) { message.warning(invalid); return; }
      const row = await tdmApi.updateRoleAllc(target.roleAllcId, {
        roleId: target.roleId,
        personId: personId!,
        addTitleYn,
        startDate: startDate!.format(FORMAT),
        endDate: endDate ? endDate.format(FORMAT) : null,
      });
      message.info('저장이 완료되었습니다');
      onSaved(row);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <>
      <EditModal
        open={!!target}
        title="책무배분 수정"
        width={550}
        closable={false}
        onCancel={onClose}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" onClick={updateChk}>저장</Button>
              {/* [E3] closeButton[닫기].Select (L125) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <EditField label={lb('직책', true)} labelWidth={85}>
          <Input value={target?.roleName?.trim() ?? ''} disabled style={{ width: 380 }} />
        </EditField>
        <EditRow>
          <EditField label={lb('담당임원', true)} labelWidth={85} width={250}>
            {/* [E1] personName[담당임원].TriggerClick (L98) → Tdm01_Lookup_SelectSingle.open() */}
            <LookupInput value={personName} width={150} onOpen={() => setPersonLookup(true)} />
          </EditField>
          <EditField label={lb('겸직여부')} labelWidth={85} width={252}>
            <Checkbox checked={addTitleYn} onChange={e => setAddTitleYn(e.target.checked)} />
          </EditField>
        </EditRow>
        <EditRow>
          <EditField label={lb('직책부여일', true)} labelWidth={85} width={250}>
            <DatePicker value={startDate} format={FORMAT} allowClear={false} onChange={d => setStartDate(d)} style={{ width: 150 }} />
          </EditField>
          <EditField label={lb('직책해제일')} labelWidth={85} width={252}>
            <DatePicker value={endDate} format={FORMAT} onChange={d => setEndDate(d)} style={{ width: 150 }} />
          </EditField>
        </EditRow>
      </EditModal>
      <Tdm01_Lookup_SelectSingle
        open={personLookup}
        onSelect={hr => { setPersonId(hr.personId); setPersonName(hr.personName ?? ''); }}
        onClose={() => setPersonLookup(false)}
      />
    </>
  );
};
