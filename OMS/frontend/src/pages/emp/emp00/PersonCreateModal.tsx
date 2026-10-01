import React, { useState } from 'react';
import { Col, DatePicker, Form, Input, Modal, Row, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Dayjs } from 'dayjs';
import { empApi } from '../../../api/emp';
import { errorMessage } from '../../../api/client';
import { TransInfo } from '../../../types/emp';
import { CodeSelect } from '../../../components/common/CodeSelect';
import { OrgLookup } from '../../../components/lookup/OrgLookup';

interface FormValues {
  empNo: string; korNm: string; kindCd: string; hireDate: Dayjs; officeTelno?: string; officeDetail?: string;
  mobileTelno: string; emailAddr: string; titleCd: string; posCd: string; orgCodeId: number; orgNm: string; note?: string;
}

const req = (msg: string) => [{ required: true, whitespace: true, message: msg }];

/** 신규사원 등록 (AS-IS Emp03_Edit_Person): 사원 + 채용발령. 조직은 입사일 기준 Lookup */
export const PersonCreateModal: React.FC<{ open: boolean; onClose: () => void; onCreated: (t: TransInfo | null) => void }> = ({ open, onClose, onCreated }) => {
  const [form] = Form.useForm<FormValues>();
  const [orgOpen, setOrgOpen] = useState(false);

  const save = async () => {
    const v = await form.validateFields();
    try {
      const created = await empApi.createTransInfo({
        empNo: v.empNo, korNm: v.korNm, kindCd: v.kindCd, hireDate: v.hireDate.format('YYYY-MM-DD'),
        officeTelno: v.officeTelno ?? null, officeDetail: v.officeDetail ?? null, mobileTelno: v.mobileTelno,
        emailAddr: v.emailAddr, titleCd: v.titleCd, posCd: v.posCd, orgCodeId: v.orgCodeId, note: v.note ?? null,
      });
      message.success('등록되었습니다.');
      form.resetFields();
      onCreated(created);
    } catch (err) {
      message.error(errorMessage(err, '등록 실패'));
    }
  };

  return (
    <Modal open={open} title="신규사원 등록" width={820} onOk={save} onCancel={onClose} okText="저장" cancelText="닫기" forceRender>
      <Form form={form} labelCol={{ span: 8 }} size="small">
        <Form.Item name="orgCodeId" hidden><Input /></Form.Item>
        <Row gutter={12}>
          <Col span={8}><Form.Item name="empNo" label="사원번호" rules={req('사원번호는 필수입력 항목입니다')}><Input maxLength={20} /></Form.Item></Col>
          <Col span={8}><Form.Item name="korNm" label="한글명" rules={req('성명은 필수입력 항목입니다')}><Input maxLength={40} /></Form.Item></Col>
          <Col span={8}><Form.Item name="kindCd" label="사원구분" rules={[{ required: true, message: '사원구분은 필수선택 항목입니다' }]}><CodeSelect kindCd="EmpKindCode" /></Form.Item></Col>
          <Col span={8}><Form.Item name="hireDate" label="입사일" rules={[{ required: true, message: '입사일은 필수입력 항목입니다' }]}><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
          <Col span={16} />
          <Col span={8}><Form.Item name="officeTelno" label="회사번호"><Input /></Form.Item></Col>
          <Col span={8}><Form.Item name="officeDetail" label="내선번호"><Input /></Form.Item></Col>
          <Col span={8}><Form.Item name="mobileTelno" label="휴대폰" rules={req('휴대폰번호는 필수입력 항목입니다')}><Input /></Form.Item></Col>
          <Col span={16}><Form.Item name="emailAddr" label="이메일" labelCol={{ span: 4 }} rules={req('이메일은 필수입력 항목입니다')}><Input /></Form.Item></Col>
          <Col span={8} />
          <Col span={8}><Form.Item name="titleCd" label="직책" rules={[{ required: true, message: '직책은 필수입력 항목입니다' }]}><CodeSelect kindCd="EmpTitleCode" /></Form.Item></Col>
          <Col span={8}><Form.Item name="posCd" label="직위" rules={[{ required: true, message: '직위는 필수입력 항목입니다' }]}><CodeSelect kindCd="EmpPosCode" /></Form.Item></Col>
          <Col span={8}>
            <Form.Item name="orgNm" label="조직" rules={[{ required: true, message: '조직은 필수입력 항목입니다' }]}>
              <Input readOnly suffix={<SearchOutlined style={{ cursor: 'pointer' }} onClick={() => {
                if (!form.getFieldValue('hireDate')) { message.warning('입사일을 먼저 등록해야 합니다.'); return; }
                setOrgOpen(true);
              }} />} />
            </Form.Item>
          </Col>
          <Col span={24}><Form.Item name="note" label="특이사항" labelCol={{ span: 3 }}><Input.TextArea rows={3} maxLength={400} /></Form.Item></Col>
        </Row>
      </Form>
      <OrgLookup
        open={orgOpen}
        baseDate={form.getFieldValue('hireDate')?.format?.('YYYY-MM-DD')}
        onCancel={() => setOrgOpen(false)}
        onOk={org => { form.setFieldsValue({ orgCodeId: org.orgCodeId, orgNm: org.korNm }); setOrgOpen(false); }}
      />
    </Modal>
  );
};
