/**
 * 직책 편집창 (N08) — 직책별 책무 등록의 [등록]·수정 아이콘이 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm20_Edit_Role.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 730×380(원본): 직책 · 직책그룹(콤보)+기타그룹명 · 개요(100 높이) · 사용시작일+보고CEO(조회창 칸) · 사용종료일 + [연결책무(n건)][연결회의체(n건)][연결부서(n건)][저장][닫기]
 * 결정: 등록(INSERT)에서는 새 직책이 아직 저장되지 않아 연결 버튼이 "직책을 저장한 뒤 연결할 수 있습니다"를 안내한다 (AS-IS는 미리 받은 ID로 연결을 먼저 저장해 직책 없는 연결이 남을 수 있다)
 * UX보강(10): 조회창(UX-05은 Tdm20_Lookup_SelectSingle 안에서)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, message, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmRole } from '@/types/tdm';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { AreaMessage } from '@/components/lookup/AreaMessage';
import { LookupInput } from '@/components/lookup/LookupInput';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Tdm20_Lookup_SelectSingle } from './Tdm20_Lookup_SelectSingle';
import { Tdm21_Lookup_RoleRelateTask } from './Tdm21_Lookup_RoleRelateTask';
import { Tdm22_Lookup_RoleRelateCncl } from './Tdm22_Lookup_RoleRelateCncl';
import { Tdm23_Lookup_RoleRelateOrg } from './Tdm23_Lookup_RoleRelateOrg';

const FORMAT = 'YYYY-MM-DD';
const BLUE = '#0069B4';   // setHtmlStyle(…, "0069B4") 필수 항목 라벨
const ETC = 'E';          // 직책그룹 "기타그룹"
const CEO = 'C';          // 보고CEO는 직책그룹 C(대표이사)에서 고른다

interface Props {
  /** INSERT = 등록, UPDATE = 수정, null이면 닫힘 */
  mode: 'INSERT' | 'UPDATE' | null;
  /** UPDATE: 선택한 직책 */
  role?: TdmRole | null;
  /** 부르는 쪽의 기준일 'yyyy-MM-dd' — 연결부서 창이 이 날짜의 조직을 보여 준다 (AS-IS baseDate) */
  baseDate: string;
  /** AS-IS callBack.execute() — 저장이 끝난 뒤 (부르는 쪽이 다시 조회). 닫기는 onClose */
  onSaved: () => void;
  onClose: () => void;
}

const Label: React.FC<{ required?: boolean; width?: number; children: React.ReactNode }> = ({ required, width = 100, children }) => (
  <div style={{ width, textAlign: 'right', paddingRight: 8, fontWeight: 'bold', color: required ? BLUE : undefined, flex: 'none' }}>{children}</div>
);

const cntOf = (s: string | null | undefined) => (s ? s : '0건');

export const Tdm20_Edit_Role: React.FC<Props> = ({ mode, role, baseDate, onSaved, onClose }) => {
  const [roleId, setRoleId] = useState<number | null>(null);
  const [roleName, setRoleName] = useState('');
  const [roleType, setRoleType] = useState<string | undefined>();
  const [etcName, setEtcName] = useState('');
  const [overview, setOverview] = useState('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [ceoRoleId, setCeoRoleId] = useState<number | null>(null);
  const [ceoRoleName, setCeoRoleName] = useState('');
  const [taskCnt, setTaskCnt] = useState('0건');
  const [cnclCnt, setCnclCnt] = useState('0건');
  const [orgCnt, setOrgCnt] = useState('0건');
  const [ceoLookup, setCeoLookup] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [cnclOpen, setCnclOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);
  const [reasonOpen, setReasonOpen] = useState(false);

  // [E0] 화면 열림 (생성자 L122-138) → setting(), show() / insert() L80-100, edit() L102-120, retrieveRelate() L489-507: 열 때 값 채우기 (등록은 새 ID를 서버가 저장 때 만든다)
  useEffect(() => {
    if (!mode) return;
    setTaskOpen(false); setCnclOpen(false); setOrgOpen(false); setCeoLookup(false); setReasonOpen(false);
    if (mode === 'UPDATE' && role) {
      setRoleId(role.roleId);
      setRoleName(role.roleName ?? '');
      setRoleType(role.roleType ?? undefined);
      setEtcName(role.roleTypeEtcName ?? '');
      setOverview(role.overview ?? '');
      setStartDate(role.startDate ? dayjs(role.startDate) : null);
      setEndDate(role.endDate ? dayjs(role.endDate) : null);
      setCeoRoleId(role.ceoRoleId);
      setCeoRoleName(role.ceoRoleName ?? '');
      setTaskCnt(cntOf(role.roleRelateTaskCnt)); setCnclCnt(cntOf(role.roleRelateCnclCnt)); setOrgCnt(cntOf(role.roleRelateOrgCnt));
      return;
    }
    setRoleId(null);
    setRoleName(''); setRoleType(undefined); setEtcName(''); setOverview('');
    setStartDate(null); setEndDate(null); setCeoRoleId(null); setCeoRoleName('');
    setTaskCnt('0건'); setCnclCnt('0건'); setOrgCnt('0건');
  }, [mode, role]);

  // [E1] roleTypeName[직책그룹].Collapse (L141) → 기타그룹이면 기타그룹명을 켜고, 아니면 끄고 비운다
  const changeRoleType = (code: string | undefined) => {
    setRoleType(code);
    if (code !== ETC) setEtcName('');
  };

  // [E5] roleRelateTaskButton[연결책무(0건)].Select (L186) → Tdm21_Lookup_RoleRelateTask.open(roleId, 건수 → 버튼 문구)
  // [E6] roleRelateCnclButton[연결회의체(0건)].Select (L203) → Tdm22_Lookup_RoleRelateCncl.open(roleId, 건수 → 버튼 문구)
  // [E7] roleRelateOrgButton[연결부서(0건)].Select (L220) → Tdm23_Lookup_RoleRelateOrg.open(roleModel, baseDate, 건수 → 버튼 문구)
  // 연결 버튼: 저장된 직책에서만 연다
  const openRelate = (open: () => void) => {
    if (!roleId) {
      message.info('직책을 저장한 뒤 연결할 수 있습니다');
      return;
    }
    open();
  };

  const toDate = (d: Dayjs | null) => (d ? d.format(FORMAT) : null);

  // [E3] updateButton[저장].Select (L173) → updateChk() L278-328 → preUpdate() L330-354
  const updateChk = () => {
    if (!roleName) { message.warning('직책는 필수입력 항목입니다'); return; }
    if (!roleType) { message.warning('직책그룹은 필수선택 항목입니다'); return; }
    if (!overview) { message.warning('개요는 필수입력 항목입니다'); return; }
    if (!startDate) { message.warning('사용시작일은 필수선택 항목입니다'); return; }
    if (roleType === ETC && !etcName) { message.warning('기타그룹명은 필수입력 항목입니다'); return; }
    if (!ceoRoleId) { message.warning('보고CEO는 필수선택 항목입니다'); return; }
    if (mode === 'UPDATE' && role) {
      // getHistoryMap() L374-487: 바뀐 것이 없으면 안내, 있으면 변경사유를 받는다
      const unchanged =
        (role.roleName ?? '') === roleName && (role.roleType ?? '') === roleType && (role.roleTypeEtcName ?? '') === etcName &&
        (role.overview ?? '') === overview && role.ceoRoleId === ceoRoleId &&
        (role.startDate ?? '') === startDate.format(FORMAT) && (role.endDate ?? '') === (toDate(endDate) ?? '');
      if (unchanged) {
        message.warning('변경사항이 없습니다');
        return;
      }
      setReasonOpen(true);
    } else {
      void update(null);
    }
  };

  // update() L356-372: tdm.Tdm20_Role.modelUpdate (수정이면 변경이력 historyMap은 서버가 만든다) → callBack, hide()
  const update = async (reason: string | null) => {
    try {
      await tdmApi.saveRole({
        roleId: mode === 'UPDATE' ? roleId : null,
        roleName,
        roleType: roleType!,
        roleTypeEtcName: roleType === ETC ? etcName : null,
        overview,
        startDate: startDate!.format(FORMAT),
        endDate: toDate(endDate),
        ceoRoleId,
        reason,
      });
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
      return;
    }
    onSaved();
    onClose();
  };

  return (
    <LookupModal
      open={!!mode}
      title="직책"
      width={730}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="change" style={{ width: 150 }} onClick={() => openRelate(() => setTaskOpen(true))}>연결책무({taskCnt})</Button>
            <Button type="change" style={{ width: 150 }} onClick={() => openRelate(() => setCnclOpen(true))}>연결회의체({cnclCnt})</Button>
            <Button type="change" style={{ width: 130 }} onClick={() => openRelate(() => setOrgOpen(true))}>연결부서({orgCnt})</Button>
            <Button type="save" onClick={updateChk}>저장</Button>
            {/* [E4] closeButton[닫기].Select (L179) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: '10px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Label required>직책</Label>
          <Input value={roleName} onChange={e => setRoleName(e.target.value)} style={{ flex: 1 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Label required>직책그룹</Label>
          <div style={{ width: 150 }}>
            <SystemCodeComboBox kindCd="TdmRoleType" placeholder="선택하세요" style={{ width: '100%' }} value={roleType} onChange={code => changeRoleType(code)} />
          </div>
          <Label width={110}>기타그룹명</Label>
          <Input value={etcName} disabled={roleType !== ETC} onChange={e => setEtcName(e.target.value)} style={{ flex: 1 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <Label required>개요</Label>
          <Input.TextArea value={overview} onChange={e => setOverview(e.target.value)} style={{ height: 100, resize: 'none', flex: 1 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Label required>사용시작일</Label>
          <div style={{ width: 250 }}><DatePicker value={startDate} format={FORMAT} allowClear={false} onChange={d => setStartDate(d)} style={{ width: 140 }} /></div>
          <Label required>보고CEO</Label>
          {/* [E2] ceoRoleName[보고CEO].TriggerClick (L153) → Tdm20_Lookup_SelectSingle.open("C", …) */}
          <LookupInput value={ceoRoleName} width={190} onOpen={() => setCeoLookup(true)} onClear={() => { setCeoRoleId(null); setCeoRoleName(''); }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Label>사용종료일</Label>
          <DatePicker value={endDate} format={FORMAT} onChange={d => setEndDate(d)} style={{ width: 140 }} />
        </div>
      </div>
      <Tdm20_Lookup_SelectSingle
        open={ceoLookup}
        roleType={CEO}
        onSelect={r => { setCeoRoleId(r.roleId); setCeoRoleName(r.roleName ?? ''); }}
        onClose={() => setCeoLookup(false)}
      />
      <Tdm21_Lookup_RoleRelateTask roleId={taskOpen ? roleId : null} onClose={count => { setTaskCnt(`${count}건`); setTaskOpen(false); }} />
      <Tdm22_Lookup_RoleRelateCncl roleId={cnclOpen ? roleId : null} onClose={count => { setCnclCnt(`${count}건`); setCnclOpen(false); }} />
      <Tdm23_Lookup_RoleRelateOrg roleId={orgOpen ? roleId : null} baseDate={baseDate} onClose={count => { setOrgCnt(`${count}건`); setOrgOpen(false); }} />
      <AreaMessage open={reasonOpen} title="변경사유" required
        onResult={text => { if (text == null) message.warning('저장이 취소되었습니다 (변경사유 미입력)'); else void update(text); }}
        onClose={() => setReasonOpen(false)} />
    </LookupModal>
  );
};
