/**
 * 신규고객사 등록 팝업 (A15) — Sys01_Tab_Company [등록]에서 연다.
 * AS-IS: myApp/client/vi/sys/Sys01_Edit_Company.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 */
import React, { useState } from 'react';
import { Col, DatePicker, Input, message, Modal, Row, Space, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Company, CompanyCreateReq } from '@/types/sys';
import { Button } from '@/components/button';
import { CodeSelect } from '@/components/form/CodeSelect';

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

/** AS-IS getEditor() L136-170: 3열 3줄, 라벨 폭 120 */
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <Col span={8}>
    <Space.Compact block style={{ alignItems: 'center' }}>
      <Typography.Text style={{ width: 120, flex: 'none' }}>{label}</Typography.Text>
      <div style={{ flex: 1 }}>{children}</div>
    </Space.Compact>
  </Col>
);

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
  // [E1]~[E3] 콤보 Collapse → 코드값 저장 (L104-121): CodeSelect가 코드를 바로 준다
  return (
    <Modal
      open={open}
      title="신규고객사 등록"
      width={1000}
      maskClosable={false}
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
      <Space direction="vertical" size={20} style={{ width: '100%', padding: '15px 0' }}>
        <Row gutter={20}>
          <Field label="고객사명">
            <Input value={f.companyNm} onChange={e => set('companyNm', e.target.value)} />
          </Field>
          <Field label="서브도메인">
            <Input value={f.locNm} onChange={e => set('locNm', e.target.value)} />
          </Field>
          <Field label="회사암호">
            <Input value={f.emgrcyPasswd} onChange={e => set('emgrcyPasswd', e.target.value)} />
          </Field>
        </Row>
        <Row gutter={20}>
          <Field label="설립일">
            <DatePicker style={{ width: '100%' }} value={f.startDate} onChange={d => set('startDate', d)}
              format="YYYY-MM-DD" defaultPickerValue={dayjs()} />
          </Field>
          <Field label="메일서버정보">
            <Input value={f.mailInfo} onChange={e => set('mailInfo', e.target.value)} />
          </Field>
          <Field label="사업자등록번호">
            <Input value={f.bizNo} onChange={e => set('bizNo', e.target.value)} />
          </Field>
        </Row>
        <Row gutter={20}>
          <Field label="휴가결산(월)">
            <CodeSelect kindCd="MonthsCode" style={{ width: '100%' }} value={f.leaveMonthCd} onChange={v => set('leaveMonthCd', v)} />
          </Field>
          <Field label="과세구분">
            <CodeSelect kindCd="TaxType" style={{ width: '100%' }} value={f.taxType} onChange={v => set('taxType', v)} />
          </Field>
          <Field label="회계결산(월)">
            <CodeSelect kindCd="MonthsCode" style={{ width: '100%' }} value={f.accountCloseMonth} onChange={v => set('accountCloseMonth', v)} />
          </Field>
        </Row>
      </Space>
    </Modal>
  );
};
