/**
 * 책무배분 등록창 (N11) — 임원별 직책배정의 [등록]이 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm30_Edit_RoleAllc.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 550×320(원본): 직책(조회창) · 담당임원(조회창) + 겸직여부 · 직책부여일 · 책무배분일 + 대체 임직원 · 등록사유(80 높이) + [저장][닫기]
 * 저장 = 직책배정(tdm30)과 책무배분일(tdm34) 한 건을 같이 만든다 (updateRoleAllcDetail L343-363)
 * UX보강(10): 조회창(UX-05)
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, DatePicker, Input, message, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Tdm01_Lookup_SelectSingle } from './Tdm01_Lookup_SelectSingle';
import { Tdm20_Lookup_SelectSingle } from './Tdm20_Lookup_SelectSingle';
import { checkRoleAllcMerge } from './tdmRoleAllcCheck';

const FORMAT = 'YYYY-MM-DD';
const BLUE = '#0069B4';   // setHtmlStyle(…, "0069B4") 필수 항목 라벨

interface Props {
  open: boolean;
  /** 부르는 화면의 기준일 'yyyy-MM-dd' (insert(baseDate, callBack)) — 본업무 검사 기준 */
  baseDate: string;
  /** AS-IS callBack.execute() — 저장이 끝난 뒤 (부르는 쪽이 다시 조회). 닫기는 onClose */
  onSaved: () => void;
  onClose: () => void;
}

const Label: React.FC<{ required?: boolean; children: React.ReactNode }> = ({ required, children }) => (
  <div style={{ width: 100, textAlign: 'right', paddingRight: 8, fontWeight: 'bold', color: required ? BLUE : undefined, flex: 'none' }}>{children}</div>
);

export const Tdm30_Edit_RoleAllc: React.FC<Props> = ({ open, baseDate, onSaved, onClose }) => {
  const [roleId, setRoleId] = useState<number | null>(null);
  const [roleName, setRoleName] = useState('');
  const [personId, setPersonId] = useState<number | null>(null);
  const [personName, setPersonName] = useState('');
  const [addTitleYn, setAddTitleYn] = useState(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [roleAllcDate, setRoleAllcDate] = useState<Dayjs | null>(null);
  const [regReason, setRegReason] = useState('');
  const [deputyEmpName, setDeputyEmpName] = useState('');
  const [roleLookup, setRoleLookup] = useState(false);
  const [personLookup, setPersonLookup] = useState(false);

  // [E0] 화면 열림 (생성자 L78-83) → insert() L85-107: 새 직책배정 모델로 시작 (새 ID는 서버가 저장 때 만든다)
  useEffect(() => {
    if (!open) return;
    setRoleId(null);
    setRoleName('');
    setPersonId(null);
    setPersonName('');
    setAddTitleYn(false);
    setStartDate(null);
    setRoleAllcDate(null);
    setRegReason('');
    setDeputyEmpName('');
  }, [open]);

  // [E3] updateButton[저장].Select (L155) → updateChk() L207-238: 필수 검사 순서는 원본 그대로
  const updateChk = async () => {
    if (!roleName) { message.warning('직책는 필수선택 항목입니다'); return; }
    if (!personName) { message.warning('담당임원은 필수선택 항목입니다'); return; }
    if (!startDate) { message.warning('직책부여일은 필수선택 항목입니다'); return; }
    if (!roleAllcDate) { message.warning('책무배분일은 필수선택 항목입니다'); return; }
    if (startDate.format(FORMAT) > roleAllcDate.format(FORMAT)) { message.warning('책부배분일은 직책부여일보다 과거일 수 없습니다'); return; }
    if (!regReason) { message.warning('등록사유는 필수입력 항목입니다'); return; }
    // [E생략] 유고시 대체 임직원 필수 검사는 원본에서 주석 처리(L230-233)
    await updateChk02();
  };

  // updateChk02() L240-328: tdm.Tdm30_RoleAllc.notInRoleAllcIdList → 본업무 갯수·직책기간 겹침 검사 → update()
  const updateChk02 = async () => {
    try {
      const others = await tdmApi.searchRoleAllcOthers([]);
      const mine = { personId, personName, roleId, roleName, addTitleYn, startDate: startDate!.format(FORMAT), endDate: null };
      const invalid = checkRoleAllcMerge([mine, ...others], baseDate);
      if (invalid) { message.warning(invalid); return; }
      // update() L330-341 → updateRoleAllcDetail() L343-363: tdm.Tdm30_RoleAllc.modelUpdate → tdm.Tdm34_RoleAllcDetail.modelUpdate → callBack, hide()
      await tdmApi.createRoleAllc({
        roleId: roleId!,
        personId: personId!,
        addTitleYn,
        startDate: startDate!.format(FORMAT),
        roleAllcDate: roleAllcDate!.format(FORMAT),
        regReason,
        deputyEmpName: deputyEmpName || null,
      });
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
      return;
    }
    onSaved();
    onClose();
  };

  return (
    <>
      <LookupModal
        open={open}
        title="책무배분 등록"
        width={550}
        closable={false}
        maskClosable={false}
        onCancel={onClose}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" onClick={updateChk}>저장</Button>
              {/* [E4] closeButton[닫기].Select (L161) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: '10px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Label required>직책</Label>
            {/* [E1] roleName[직책].TriggerClick (L120) → Tdm20_Lookup_SelectSingle.openAll(오늘): 고른 직책, 선택 없이 닫으면 비움 */}
            <LookupInput value={roleName} width={380} onOpen={() => setRoleLookup(true)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Label required>담당임원</Label>
            {/* [E2] personName[담당임원].TriggerClick (L141) → Tdm01_Lookup_SelectSingle.open() */}
            <LookupInput value={personName} width={150} onOpen={() => setPersonLookup(true)} />
            <div style={{ width: 100, textAlign: 'right', paddingRight: 8, fontWeight: 'bold', flex: 'none' }}>겸직여부</div>
            <Checkbox checked={addTitleYn} onChange={e => setAddTitleYn(e.target.checked)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Label required>직책부여일</Label>
            <DatePicker value={startDate} format={FORMAT} allowClear={false} onChange={d => setStartDate(d)} style={{ width: 150 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Label required>책무배분일</Label>
            <DatePicker value={roleAllcDate} format={FORMAT} allowClear={false} onChange={d => setRoleAllcDate(d)} style={{ width: 150 }} />
            <div style={{ width: 100, textAlign: 'right', paddingRight: 8, fontWeight: 'bold', flex: 'none' }}>대체 임직원</div>
            <Input value={deputyEmpName} onChange={e => setDeputyEmpName(e.target.value)} style={{ width: 120 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <Label required>등록사유</Label>
            <Input.TextArea value={regReason} onChange={e => setRegReason(e.target.value)} style={{ height: 80, resize: 'none', flex: 1 }} />
          </div>
        </div>
      </LookupModal>
      <Tdm20_Lookup_SelectSingle
        open={roleLookup}
        allButton
        stdDate={dayjs().format(FORMAT)}
        onSelect={r => { setRoleId(r.roleId); setRoleName(r.roleName ?? ''); }}
        onClose={() => setRoleLookup(false)}
      />
      <Tdm01_Lookup_SelectSingle
        open={personLookup}
        onSelect={hr => { setPersonId(hr.personId); setPersonName(hr.personName ?? ''); }}
        onClose={() => setPersonLookup(false)}
      />
    </>
  );
};
