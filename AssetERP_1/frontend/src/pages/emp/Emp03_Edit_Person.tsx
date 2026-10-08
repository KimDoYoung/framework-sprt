/**
 * 신규사원 등록 팝업 (C01) — Emp00_Tab_TransInfo [등록]에서 연다.
 * AS-IS: myApp/client/vi/emp/Emp03_Edit_Person.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 */
import React, { useState } from 'react';
import { Col, DatePicker, Input, message, Modal, Row, Space, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Dayjs } from 'dayjs';
import { empApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { CodeSelect } from '@/components/form/CodeSelect';
import { Org00_Lookup_SelectSingle } from '../org/Org00_Lookup_SelectSingle';

interface Props {
  open: boolean;
  onClose: () => void;
  /** AS-IS update() 콜백: grid.getStore().add + select */
  onSaved: (row: TransInfo) => void;
}

interface EditForm {
  empNo: string;
  korNm: string;
  kindCd?: string;
  hireDate: Dayjs | null;
  expiryDate: Dayjs | null;
  officeTelNo: string;
  officeDetail: string;
  mobileTelNo: string;
  hireCd?: string;
  emailAddr: string;
  titleCd?: string;
  posCd?: string;
  orgCodeId?: number;
  orgKorNm: string;
  note: string;
}

const EMPTY: EditForm = {
  empNo: '', korNm: '', hireDate: null, expiryDate: null, officeTelNo: '', officeDetail: '', mobileTelNo: '', emailAddr: '', orgKorNm: '', note: '',
};

/** AS-IS getEditor() L254-289: 칸 폭 250(이메일 500), 라벨 폭 88. 필수 라벨은 파란색(0069B4) */
const Field: React.FC<{ label: string; required?: boolean; span?: number; children: React.ReactNode }> = ({ label, required, span = 8, children }) => (
  <Col span={span}>
    <Space.Compact block style={{ alignItems: 'center' }}>
      <Typography.Text style={{ width: 88, flex: 'none', color: required ? '#0069B4' : undefined }}>{label}</Typography.Text>
      <div style={{ flex: 1 }}>{children}</div>
    </Space.Compact>
  </Col>
);

export const Emp03_Edit_Person: React.FC<Props> = ({ open, onClose, onSaved }) => {
  const [f, setF] = useState<EditForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [orgBaseDate, setOrgBaseDate] = useState<string>();
  const set = <K extends keyof EditForm>(k: K, v: EditForm[K]) => setF(prev => ({ ...prev, [k]: v }));

  // [E2] closeButton[닫기].Select (L159) → hide()
  const hide = () => { setF(EMPTY); onClose(); };

  // [E8] orgKorName[조직].TriggerClick (L216): 입사일이 없으면 막고, 입사일 기준으로 조직찾기(openFixDate)
  const lookupOrg = () => {
    if (!f.hireDate) {
      message.warning('입사일을 먼저 등록해야 합니다.');
      return;
    }
    setOrgBaseDate(f.hireDate.format('YYYY-MM-DD'));
  };

  // [E1] updateButton[저장].Select (L151) → update() L300-358
  const update = async () => {
    // spaceDelete() L292-297: 사번·이름·휴대폰·이메일 앞뒤 공백 제거
    const empNo = f.empNo.trim(), korNm = f.korNm.trim(), mobileTelNo = f.mobileTelNo.trim(), emailAddr = f.emailAddr.trim();
    if (!empNo) return message.warning('사원번호는 필수입력 항목입니다');
    if (!korNm) return message.warning('성명은 필수입력 항목입니다');
    if (!f.hireDate) return message.warning('입사일은 필수입력 항목입니다');
    if (!emailAddr) return message.warning('이메일은 필수입력 항목입니다');
    if (!f.kindCd) return message.warning('사원구분은 필수선택 항목입니다');
    if (!mobileTelNo) return message.warning('휴대폰번호는 필수입력 항목입니다');
    if (!f.titleCd) return message.warning('직책은 필수입력 항목입니다');
    if (!f.posCd) return message.warning('직위는 필수입력 항목입니다');
    if (!f.orgCodeId) return message.warning('조직은 필수입력 항목입니다');

    // 서비스 emp.Emp00_TransInfo.update(transInfoModel, expiryDate) → 목록에 추가·선택 후 닫기
    setSaving(true);
    try {
      const saved = await empApi.createTransInfo({
        empNo, korNm, mobileTelNo, emailAddr,
        kindCd: f.kindCd, hireDate: f.hireDate.format('YYYY-MM-DD'), expiryDate: f.expiryDate?.format('YYYY-MM-DD'),
        officeTelNo: f.officeTelNo || undefined, officeDetail: f.officeDetail || undefined, hireCd: f.hireCd,
        titleCd: f.titleCd, posCd: f.posCd, orgCodeId: f.orgCodeId, note: f.note || undefined,
      });
      onSaved(saved);
      hide();
    } catch (err) {
      message.error(errorMessage(err, '등록 실패'));
    } finally {
      setSaving(false);
    }
  };

  // [E0] 화면 열림 (생성자 L142-176) → getEditor(), show()
  // [E3]·[E5]~[E7] 사원구분·직위·직책·채용구분 Collapse → 코드 저장 (L179-212): CodeSelect가 코드를 바로 준다
  // [E4 생략] transName[발령구분] Collapse (L186): 원본도 폼에 넣지 않은 콤보 — 서버가 채용(100)으로 정한다
  return (
    <Modal
      open={open}
      title="신규사원 등록"
      width={800}
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
        <Row gutter={20}>
          <Field label="사원번호" required><Input value={f.empNo} onChange={e => set('empNo', e.target.value)} /></Field>
          <Field label="한글명" required><Input value={f.korNm} onChange={e => set('korNm', e.target.value)} /></Field>
          <Field label="사원구분" required>
            <CodeSelect kindCd="EmpKindCode" style={{ width: '100%' }} value={f.kindCd} onChange={v => set('kindCd', v)} />
          </Field>
        </Row>
        <Row gutter={20} style={{ marginTop: 10 }}>
          <Field label="입사일" required>
            <DatePicker style={{ width: '100%' }} value={f.hireDate} onChange={d => set('hireDate', d)} format="YYYY-MM-DD" />
          </Field>
          <Field label="계약종료일">
            <DatePicker style={{ width: '100%' }} value={f.expiryDate} onChange={d => set('expiryDate', d)} format="YYYY-MM-DD" />
          </Field>
        </Row>
        <Row gutter={20}>
          <Field label="회사번호"><Input value={f.officeTelNo} onChange={e => set('officeTelNo', e.target.value)} /></Field>
          <Field label="내선번호"><Input value={f.officeDetail} onChange={e => set('officeDetail', e.target.value)} /></Field>
          <Field label="휴대폰" required><Input value={f.mobileTelNo} onChange={e => set('mobileTelNo', e.target.value)} /></Field>
        </Row>
        <Row gutter={20} style={{ marginTop: 10 }}>
          <Field label="채용구분">
            <CodeSelect kindCd="HireCode" style={{ width: '100%' }} value={f.hireCd} onChange={v => set('hireCd', v)} />
          </Field>
          <Field label="이메일" required span={16}><Input value={f.emailAddr} onChange={e => set('emailAddr', e.target.value)} /></Field>
        </Row>
        <Row gutter={20}>
          <Field label="직책" required>
            <CodeSelect kindCd="EmpTitleCode" style={{ width: '100%' }} value={f.titleCd} onChange={v => set('titleCd', v)} />
          </Field>
          <Field label="직위" required>
            <CodeSelect kindCd="EmpPosCode" style={{ width: '100%' }} value={f.posCd} onChange={v => set('posCd', v)} />
          </Field>
          <Field label="조직" required>
            {/* LookupTriggerField(편집 불가) */}
            <Input readOnly value={f.orgKorNm} onClick={lookupOrg}
              suffix={<SearchOutlined style={{ cursor: 'pointer' }} onClick={lookupOrg} />} />
          </Field>
        </Row>
        <Row gutter={20}>
          <Field label="특이사항" span={24}>
            <Input.TextArea rows={5} value={f.note} onChange={e => set('note', e.target.value)} />
          </Field>
        </Row>
      </Space>
      <Org00_Lookup_SelectSingle
        baseDate={orgBaseDate}
        onClose={() => setOrgBaseDate(undefined)}
        onSelect={org => setF(prev => ({ ...prev, orgCodeId: org.orgCodeId, orgKorNm: org.korNm ?? '' }))}
      />
    </Modal>
  );
};
