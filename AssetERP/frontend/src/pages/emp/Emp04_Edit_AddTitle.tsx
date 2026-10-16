/**
 * 겸직 등록 팝업 (C01-6) — Emp04_TabPage_AddTitle [등록]·[수정] 셀에서 연다.
 * AS-IS: myApp/client/vi/emp/Emp04_Edit_AddTitle.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, DatePicker, Input, message, Modal, Space, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { empAddTitleApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { AddTitle } from '@/types/emp';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Org00_Lookup_SelectSingle } from '@/components/lookup/Org00_Lookup_SelectSingle';

/** insert(personId) = { personId }, edit(personId, 행) = { personId, row } */
export interface AddTitleTarget {
  personId: number;
  row?: AddTitle;
}

interface Props {
  /** 값이 있으면 열린다 */
  target?: AddTitleTarget;
  onClose: () => void;
  /** AS-IS callBack.execute(): 탭이 다시 조회한다 */
  onSaved: () => void;
}

interface EditForm {
  startDate: Dayjs | null;
  closeDate: Dayjs | null;
  orgCodeId?: number;
  orgNm: string;
  orgHeadYn: boolean;
  titleCd?: string;
  posCd?: string;
  transReason: string;
}

const toForm = (row?: AddTitle): EditForm => row
  ? {
      startDate: row.startDate ? dayjs(row.startDate) : null,
      closeDate: row.closeDate ? dayjs(row.closeDate) : null,
      orgCodeId: row.orgCodeId ?? undefined,
      orgNm: row.orgNm ?? '',
      orgHeadYn: row.orgHeadYn === 'true',
      titleCd: row.titleCd ?? undefined,
      posCd: row.posCd ?? undefined,
      transReason: row.transReason ?? '',
    }
  // insert() L76-88: 시작일자 = 오늘
  : { startDate: dayjs(), closeDate: null, orgNm: '', orgHeadYn: false, transReason: '' };

/** getEditor() L171-197: FieldLabel 라벨 폭 75 */
const Field: React.FC<{ label: string; width: number; children: React.ReactNode }> = ({ label, width, children }) => (
  <Space.Compact style={{ width, alignItems: 'center' }}>
    <Typography.Text style={{ width: 75, flex: 'none' }}>{label}</Typography.Text>
    <div style={{ flex: 1 }}>{children}</div>
  </Space.Compact>
);

export const Emp04_Edit_AddTitle: React.FC<Props> = ({ target, onClose, onSaved }) => {
  const [f, setF] = useState<EditForm>(toForm());
  const [saving, setSaving] = useState(false);
  const [orgBaseDate, setOrgBaseDate] = useState<string>();
  const set = <K extends keyof EditForm>(k: K, v: EditForm[K]) => setF(prev => ({ ...prev, [k]: v }));

  // [E0] 화면 열림 (생성자 L100-115) → insert() L76-88 / edit() L90-98
  useEffect(() => { if (target) setF(toForm(target.row)); }, [target]);

  // [E2] closeButton[닫기].Select (L124) → hide()
  const hide = () => onClose();

  // [E5] orgName[조직].TriggerClick (L148): 시작일자가 없으면 막고, 시작일자 기준으로 조직찾기(openFixDate)
  const lookupOrg = () => {
    if (!f.startDate) {
      message.warning('발령일을 먼저 등록해야 합니다.');
      return;
    }
    setOrgBaseDate(f.startDate.format('YYYY-MM-DD'));
  };

  // [E1] updateButton[저장].Select (L118) → update() L203-249
  const update = async () => {
    if (!target) return;
    if (!f.startDate) return message.warning('겸직시작일은 필수입력 항목입니다');
    if (!f.titleCd) return message.warning('직책은 필수입력 항목입니다');
    if (!f.posCd) return message.warning('직위는 필수입력 항목입니다');
    if (!f.orgCodeId) return message.warning('조직은 필수입력 항목입니다');

    // 서비스 emp.Emp04_AddTitle.updateList(updateModel, transModel, personId) → callBack + hide
    setSaving(true);
    try {
      await empAddTitleApi.updateList({
        addTitleId: target.row?.addTitleId,
        personId: target.personId,
        transPersonId: target.row?.transPersonId,
        startDate: f.startDate.format('YYYY-MM-DD'),
        closeDate: f.closeDate?.format('YYYY-MM-DD') ?? null,
        orgCodeId: f.orgCodeId,
        orgHeadYn: String(f.orgHeadYn),
        titleCd: f.titleCd,
        posCd: f.posCd,
        transReason: f.transReason || null,
      });
      onSaved();
      hide();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // [E3]·[E4] posName[직위]·titleName[직책] Collapse → 코드 저장 (L133-144): SystemCodeComboBox가 코드를 바로 준다
  return (
    <Modal
      open={!!target}
      title="겸직 등록"
      width={850}
      maskClosable={false}
      onCancel={hide}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            <Button type="close" onClick={hide}>닫기</Button>
          </Space>
        </div>
      }
    >
      <Space direction="vertical" size={18} style={{ width: '100%', padding: '10px 0' }}>
        <Space size={20}>
          <Field label="시작일자" width={240}>
            <DatePicker style={{ width: '100%' }} value={f.startDate} onChange={d => set('startDate', d)} format="YYYY-MM-DD" />
          </Field>
          <Field label="조직" width={400}>
            {/* LookupTriggerField(편집 불가) */}
            <Input readOnly value={f.orgNm} onClick={lookupOrg}
              suffix={<SearchOutlined style={{ cursor: 'pointer' }} onClick={lookupOrg} />} />
          </Field>
          <Field label="조직장" width={200}>
            <Checkbox checked={f.orgHeadYn} onChange={e => set('orgHeadYn', e.target.checked)} />
          </Field>
        </Space>
        <Space size={20}>
          <Field label="종료일자" width={240}>
            <DatePicker style={{ width: '100%' }} value={f.closeDate} onChange={d => set('closeDate', d)} format="YYYY-MM-DD" />
          </Field>
          <Field label="직책" width={200}>
            <SystemCodeComboBox kindCd="EmpTitleCode" style={{ width: '100%' }} value={f.titleCd} onChange={v => set('titleCd', v)} />
          </Field>
          <Field label="직위" width={200}>
            <SystemCodeComboBox kindCd="EmpPosCode" style={{ width: '100%' }} value={f.posCd} onChange={v => set('posCd', v)} />
          </Field>
        </Space>
        <Field label="겸직사유" width={800}>
          <Input.TextArea rows={3} value={f.transReason} onChange={e => set('transReason', e.target.value)} />
        </Field>
      </Space>
      <Org00_Lookup_SelectSingle
        baseDate={orgBaseDate}
        onClose={() => setOrgBaseDate(undefined)}
        onSelect={org => setF(prev => ({ ...prev, orgCodeId: org.orgCodeId, orgNm: org.korNm ?? '' }))}
      />
    </Modal>
  );
};
