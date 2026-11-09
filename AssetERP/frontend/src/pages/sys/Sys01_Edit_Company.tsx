/**
 * 신규고객사 등록 팝업 (A15) — Sys01_Tab_Company [등록]에서 연다.
 * AS-IS: myApp/client/vi/sys/Sys01_Edit_Company.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 스타일: MF (docs/modal-style.md 편집 폼 모달 원칙 — EditForm 부품). 라벨 폭 98(가장 긴 라벨 7글자),
 *   모달 1000 → 안쪽 960, 3열은 칸 폭을 똑같이 나눈다(칸 사이 8)
 */
import React, { useState } from 'react';
import { DatePicker, Input, message, Modal, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Company, CompanyCreateReq } from '@/types/sys';
import { Button } from '@/components/button';
import { EditModal, EditRow, EditField as Field } from '@/components/form/EditForm';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

interface Props {
  open: boolean;
  onClose: () => void;
  /** AS-IS update() 콜백: grid.getStore().add + select */
  onSaved: (company: Company) => void;
}

interface EditForm {
  companyNm: string;
  locNm: string;
  emgrcyPasswd: string;
  startDate: Dayjs | null;
  mailInfo: string;
  bizNo: string;
  leaveMonthCd?: string;
  taxType?: string;
  accountCloseMonth?: string;
}

// AS-IS 생성자 L83-84: 과세구분 기본 '1'(면세)
const EMPTY: EditForm = { companyNm: '', locNm: '', emgrcyPasswd: '', startDate: null, mailInfo: '', bizNo: '', taxType: '1' };

/** AS-IS getEditor() L136-170: 3열 3줄. 라벨 폭은 AS-IS 120이 아니라 가장 긴 라벨(7글자)에 맞춰 98 */
const LABEL_WIDTH = 98;

export const Sys01_Edit_Company: React.FC<Props> = ({ open, onClose, onSaved }) => {
  const [f, setF] = useState<EditForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof EditForm>(k: K, v: EditForm[K]) => setF(prev => ({ ...prev, [k]: v }));

  // [E5] closeButton[닫기].Select (L128) → hide()
  const hide = () => { setF(EMPTY); onClose(); };

  // [E4] updateButton[등록].Select (L122) → updateChk() L180-222
  const updateChk = () => {
    // spaceDelete() L172-178: 앞뒤 공백 제거 (서버에서도 한다)
    const companyNm = f.companyNm.trim(), locNm = f.locNm.trim(), emgrcyPasswd = f.emgrcyPasswd.trim(), bizNo = f.bizNo.trim();
    if (!companyNm) return message.warning('고객사명은 필수 입력항목입니다.');
    if (!locNm) return message.warning('서브도메인은 필수 입력항목입니다.');
    if (!emgrcyPasswd) return message.warning('회사암호는 필수 입력항목입니다.');
    if (!f.startDate) return message.warning('설립일은 필수 입력항목입니다.');
    if (!bizNo) return message.warning('사업자 등록번호는 필수 입력항목입니다.');
    Modal.confirm({
      title: '확인',
      content: '해당 신규 고객사를 등록하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      // [E6] msgBox.DialogHide [YES] (L206) → update()
      onOk: () => update({
        companyNm, locNm, emgrcyPasswd, bizNo,
        startDate: f.startDate!.format('YYYY-MM-DD'),
        mailInfo: f.mailInfo.trim() || undefined,
        leaveMonthCd: f.leaveMonthCd, taxType: f.taxType, accountCloseMonth: f.accountCloseMonth,
      }),
    });
  };

  // update() L224-241: 서비스 sys.Sys01_Company.update → 목록에 추가·선택 후 닫기
  const update = async (req: CompanyCreateReq) => {
    setSaving(true);
    try {
      const saved = await sysApi.createCompany(req);
      onSaved(saved);
      hide();
    } catch (err) {
      message.error(errorMessage(err, '등록 실패'));
    } finally {
      setSaving(false);
    }
  };

  // [E0] 화면 열림 (생성자 L69-101) → settings(), getEditor(), show()
  // [E1]~[E3] 콤보 Collapse → 코드값 저장 (L104-121): SystemCodeComboBox가 코드를 바로 준다
  return (
    <EditModal
      open={open}
      title="신규고객사 등록"
      width={1000}
      onCancel={hide}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="register" onClick={updateChk} loading={saving}>등록</Button>
            <Button type="close" onClick={hide}>닫기</Button>
          </Space>
        </div>
      }
    >
      <EditRow>
        <Field label="고객사명" labelWidth={LABEL_WIDTH}>
          <Input value={f.companyNm} onChange={e => set('companyNm', e.target.value)} />
        </Field>
        <Field label="서브도메인" labelWidth={LABEL_WIDTH}>
          <Input value={f.locNm} onChange={e => set('locNm', e.target.value)} />
        </Field>
        <Field label="회사암호" labelWidth={LABEL_WIDTH}>
          <Input value={f.emgrcyPasswd} onChange={e => set('emgrcyPasswd', e.target.value)} />
        </Field>
      </EditRow>
      <EditRow>
        <Field label="설립일" labelWidth={LABEL_WIDTH}>
          <DatePicker style={{ width: '100%' }} value={f.startDate} onChange={d => set('startDate', d)}
            format="YYYY-MM-DD" defaultPickerValue={dayjs()} />
        </Field>
        <Field label="메일서버정보" labelWidth={LABEL_WIDTH}>
          <Input value={f.mailInfo} onChange={e => set('mailInfo', e.target.value)} />
        </Field>
        <Field label="사업자등록번호" labelWidth={LABEL_WIDTH}>
          <Input value={f.bizNo} onChange={e => set('bizNo', e.target.value)} />
        </Field>
      </EditRow>
      <EditRow>
        <Field label="휴가결산(월)" labelWidth={LABEL_WIDTH}>
          <SystemCodeComboBox kindCd="MonthsCode" style={{ width: '100%' }} value={f.leaveMonthCd} onChange={v => set('leaveMonthCd', v)} />
        </Field>
        <Field label="과세구분" labelWidth={LABEL_WIDTH}>
          <SystemCodeComboBox kindCd="TaxType" style={{ width: '100%' }} value={f.taxType} onChange={v => set('taxType', v)} />
        </Field>
        <Field label="회계결산(월)" labelWidth={LABEL_WIDTH}>
          <SystemCodeComboBox kindCd="MonthsCode" style={{ width: '100%' }} value={f.accountCloseMonth} onChange={v => set('accountCloseMonth', v)} />
        </Field>
      </EditRow>
    </EditModal>
  );
};
