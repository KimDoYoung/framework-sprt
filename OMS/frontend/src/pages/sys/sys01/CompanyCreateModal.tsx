import React from 'react';
import { Col, DatePicker, Form, Input, Modal, Row, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { sysApi } from '../../../api/sys';
import { errorMessage } from '../../../api/client';
import { CompanyDetail } from '../../../types/sys';

interface FormValues {
  companyNm: string; locNm: string; bizNo: string; emgrcyPasswd: string;
  startDate: Dayjs; closeDate: Dayjs;
  icamCompanyCd?: string; icamAdvisCompanyCd?: string;
  empInfo?: string; officeTelNo?: string; emailAddr?: string; note?: string;
}

/**
 * 신규고객사 등록 (AS-IS Sys01_Edit_Company). 서버가 최상위 조직·기본 공통코드를 함께 만든다.
 * asseterpdb에 맞춰 사업자등록번호(NOT NULL)를 받고, 없는 컬럼인 ICAM 회사유형은 뺐다.
 */
export const CompanyCreateModal: React.FC<{ open: boolean; onClose: () => void; onCreated: (c: CompanyDetail) => void }> = ({ open, onClose, onCreated }) => {
  const [form] = Form.useForm<FormValues>();

  const save = async () => {
    const v = await form.validateFields();
    try {
      const created = await sysApi.createCompany({
        ...v,
        startDate: v.startDate.format('YYYY-MM-DD'),
        closeDate: v.closeDate.format('YYYY-MM-DD'),
        useYn: true,
        loginSecureYn: false,
        icamCompanyCd: v.icamCompanyCd ?? null,
        icamAdvisCompanyCd: v.icamAdvisCompanyCd ?? null,
        empInfo: v.empInfo ?? null,
        officeTelNo: v.officeTelNo ?? null,
        emailAddr: v.emailAddr ?? null,
        note: v.note ?? null,
      });
      message.success('등록되었습니다.');
      onCreated(created);
    } catch (err) {
      message.error(errorMessage(err, '등록 실패'));
    }
  };

  const req = (label: string) => [{ required: true, whitespace: true, message: `${label}은(는) 필수 입력항목입니다.` }];
  return (
    <Modal open={open} title="신규고객사 등록" width={1000} onOk={save} onCancel={onClose} okText="등록" cancelText="닫기" destroyOnClose>
      <Form form={form} labelCol={{ span: 9 }} preserve={false}>
        <Row gutter={12}>
          <Col span={8}><Form.Item name="companyNm" label="고객사명" rules={req('고객사명')}><Input /></Form.Item></Col>
          <Col span={8}><Form.Item name="locNm" label="서브도메인" rules={req('서브도메인')}><Input /></Form.Item></Col>
          <Col span={8}><Form.Item name="emgrcyPasswd" label="회사암호" rules={req('회사암호')}><Input /></Form.Item></Col>
          <Col span={8}><Form.Item name="bizNo" label="사업자등록번호" rules={req('사업자등록번호')}><Input /></Form.Item></Col>
          <Col span={8}><Form.Item name="startDate" label="설립일" rules={[{ required: true, message: '설립일은 필수 입력항목입니다.' }]}><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
          <Col span={8}>
            <Form.Item name="closeDate" label="계약종료일" dependencies={['startDate']}
              rules={[{ required: true, message: '계약종료일은 필수 입력항목입니다.' },
                ({ getFieldValue }) => ({
                  validator: (_, v: Dayjs) => (!v || !getFieldValue('startDate') || !dayjs(getFieldValue('startDate')).isAfter(v)
                    ? Promise.resolve() : Promise.reject(new Error('설립일은 계약종료일보다 이후 날짜로 입력할 수 없습니다.'))),
                })]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}><Form.Item name="icamCompanyCd" label="ICAM 운용사코드"><Input maxLength={8} /></Form.Item></Col>
          <Col span={8}><Form.Item name="icamAdvisCompanyCd" label="ICAM 자문사코드"><Input maxLength={8} /></Form.Item></Col>
          <Col span={8} />
          <Col span={8}><Form.Item name="empInfo" label="담당자"><Input /></Form.Item></Col>
          <Col span={8}><Form.Item name="officeTelNo" label="대표전화"><Input /></Form.Item></Col>
          <Col span={8}><Form.Item name="emailAddr" label="이메일주소"><Input /></Form.Item></Col>
          <Col span={24}><Form.Item name="note" label="비고" labelCol={{ span: 3 }}><Input /></Form.Item></Col>
        </Row>
      </Form>
    </Modal>
  );
};
