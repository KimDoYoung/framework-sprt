import React, { useEffect, useState } from 'react';
import { Button, Col, DatePicker, Form, Input, Modal, Row, Space, Switch, Tabs, message } from 'antd';
import { CopyOutlined, EditOutlined, GlobalOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { sysApi } from '../../../api/sys';
import { errorMessage } from '../../../api/client';
import { CompanyDetail } from '../../../types/sys';
import { PendingScreenView } from '../../../components/PendingScreenView';
import { LoginSecureModal } from './LoginSecureModal';

type FormValues = Omit<CompanyDetail, 'companyId' | 'startDate' | 'closeDate'> & { startDate: dayjs.Dayjs | null; closeDate: dayjs.Dayjs | null };

const toForm = (c: CompanyDetail): FormValues => ({
  ...c,
  startDate: c.startDate ? dayjs(c.startDate) : null,
  closeDate: c.closeDate ? dayjs(c.closeDate) : null,
});

/**
 * 선택한 고객사의 탭 (AS-IS Sys01_TabPage_Info01 관리정보, Sys01_TabPage_Info02 기본정보, Sys02_Tab_User 고객별 관리자).
 * 두 정보 탭은 같은 회사 행을 편집하므로 한 폼을 나눠 보여 주고, 저장은 회사 전체를 PUT 한다.
 */
export const CompanyInfoTabs: React.FC<{ companyId?: number; onSaved: (c: CompanyDetail) => void }> = ({ companyId, onSaved }) => {
  const [form] = Form.useForm<FormValues>();
  const [company, setCompany] = useState<CompanyDetail>();
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState('');
  const [ipCompanyId, setIpCompanyId] = useState<number>();

  useEffect(() => {
    if (companyId == null) {
      setCompany(undefined);
      form.resetFields();
      return;
    }
    sysApi.getCompany(companyId)
      .then(c => { setCompany(c); form.setFieldsValue(toForm(c)); })
      .catch(err => message.error(errorMessage(err, '고객사 조회 실패')));
  }, [companyId, form]);

  const save = async () => {
    if (!company) return;
    const v = await form.validateFields();
    try {
      const saved = await sysApi.updateCompany(company.companyId, {
        ...company,
        ...v,
        startDate: v.startDate ? v.startDate.format('YYYY-MM-DD') : null,
        closeDate: v.closeDate ? v.closeDate.format('YYYY-MM-DD') : null,
      });
      setCompany(saved);
      form.setFieldsValue(toForm(saved));
      message.success('저장되었습니다.');
      onSaved(saved);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  const saveNote = async () => {
    if (!company) return;
    try {
      await sysApi.updateCompanyNote(company.companyId, note);
      const updated = { ...company, note };
      setCompany(updated);
      form.setFieldValue('note', note);
      setNoteOpen(false);
      onSaved(updated);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  const disabled = !company;
  const info01 = (
    <>
      <Space style={{ marginBottom: 12 }}>
        <Button type="primary" onClick={save} disabled={disabled}>저장</Button>
        <Button icon={<CopyOutlined />} disabled={disabled}
          onClick={() => navigator.clipboard.writeText(String(company?.companyId)).then(() => message.success('회사ID를 복사했습니다.'))}>
          회사ID 복사
        </Button>
      </Space>
      <Row gutter={12}>
        <Col span={6}>
          <Form.Item label="보안로그인">
            <Space>
              <Form.Item name="loginSecureYn" valuePropName="checked" noStyle><Switch disabled={disabled} /></Form.Item>
              <Button size="small" icon={<GlobalOutlined />} disabled={disabled} onClick={() => setIpCompanyId(company?.companyId)}>공인IP</Button>
            </Space>
          </Form.Item>
        </Col>
        <Col span={6}><Form.Item name="companyNm" label="고객명" rules={[{ required: true, whitespace: true, message: '고객명은 필수 입력항목입니다.' }]}><Input disabled={disabled} /></Form.Item></Col>
        <Col span={6}><Form.Item name="locNm" label="서브도메인" rules={[{ required: true, whitespace: true, message: '서브도메인은 필수 입력항목입니다.' }]}><Input disabled={disabled} /></Form.Item></Col>
        <Col span={6}><Form.Item name="bizNo" label="사업자번호" rules={[{ required: true, whitespace: true, message: '사업자등록번호는 필수 입력항목입니다.' }]}><Input disabled={disabled} /></Form.Item></Col>
        <Col span={6}><Form.Item name="emgrcyPasswd" label="회사암호"><Input disabled={disabled} /></Form.Item></Col>
        <Col span={6}><Form.Item name="closeDate" label="계약종료일"><DatePicker style={{ width: '100%' }} disabled={disabled} /></Form.Item></Col>
        <Col span={6}><Form.Item name="icamCompanyCd" label="ICAM 운용사"><Input maxLength={8} disabled={disabled} /></Form.Item></Col>
        <Col span={6}><Form.Item name="icamAdvisCompanyCd" label="ICAM 자문사"><Input maxLength={8} disabled={disabled} /></Form.Item></Col>
        <Col span={6}><Form.Item name="useYn" label="사용여부" valuePropName="checked"><Switch disabled={disabled} /></Form.Item></Col>
        <Col span={18}>
          <Form.Item label="비고">
            <Space.Compact style={{ width: '100%' }}>
              <Form.Item name="note" noStyle><Input readOnly disabled={disabled} /></Form.Item>
              <Button icon={<EditOutlined />} disabled={disabled}
                onClick={() => { setNote(company?.note ?? ''); setNoteOpen(true); }} />
            </Space.Compact>
          </Form.Item>
        </Col>
      </Row>
    </>
  );

  const info02 = (
    <>
      <Space style={{ marginBottom: 12 }}>
        <Button type="primary" onClick={save} disabled={disabled}>저장</Button>
      </Space>
      <Row gutter={12}>
        <Col span={6}><Form.Item name="startDate" label="설립일"><DatePicker style={{ width: '100%' }} disabled={disabled} /></Form.Item></Col>
        <Col span={6}><Form.Item name="empInfo" label="담당자"><Input placeholder="이름/부서/직책" disabled={disabled} /></Form.Item></Col>
        <Col span={6}><Form.Item name="officeTelNo" label="대표전화"><Input disabled={disabled} /></Form.Item></Col>
        <Col span={6}><Form.Item name="emailAddr" label="이메일주소"><Input disabled={disabled} /></Form.Item></Col>
      </Row>
    </>
  );

  return (
    <Form form={form} labelCol={{ span: 8 }} style={{ height: '100%' }}>
      <Tabs
        style={{ height: '100%' }}
        items={[
          { key: 'info01', label: '관리정보', children: info01, forceRender: true },
          { key: 'info02', label: '기본정보', children: info02, forceRender: true },
          {
            key: 'user', label: '고객별 관리자',
            // AS-IS Sys02_Tab_User — scope.md 후순위 화면 (비밀번호 암복호화·메뉴 권한 Lookup 정리 후 변환)
            children: <div style={{ height: 260 }}><PendingScreenView title="고객별 관리자" classNm="Sys02_Tab_User" /></div>,
          },
        ]}
      />
      <Modal open={noteOpen} title="비고" width={900} onOk={saveNote} onCancel={() => setNoteOpen(false)} okText="저장" cancelText="닫기">
        <Input.TextArea rows={18} value={note} onChange={e => setNote(e.target.value)} />
      </Modal>
      <LoginSecureModal companyId={ipCompanyId} onClose={() => setIpCompanyId(undefined)} />
    </Form>
  );
};
