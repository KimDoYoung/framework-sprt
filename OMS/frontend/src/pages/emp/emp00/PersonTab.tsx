import React, { useEffect, useState } from 'react';
import { Button, Col, DatePicker, Form, Input, Modal, Row, Space, Typography, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { empApi } from '../../../api/emp';
import { errorMessage } from '../../../api/client';
import { Person } from '../../../types/emp';

type FormValues = Omit<Person, 'hireDate'> & { hireDate: Dayjs | null };

/** 입사일부터 오늘까지: 년차(입사 해 = 1년차), 근속년수 */
const yearsOf = (hireDate?: Dayjs | null) => {
  if (!hireDate) return { thYear: '', workYear: '' };
  const today = dayjs();
  return { thYear: `${today.year() - hireDate.year() + 1}년차`, workYear: `${today.diff(hireDate, 'year')}년 ${today.diff(hireDate, 'month') % 12}개월` };
};

/**
 * 기본정보 탭 (AS-IS Emp01_TabPage_Person): 사원 기본정보 편집·삭제.
 * 사진(FileUpload)과 입사일 이력 Lookup(Emp02_Lookup_HireDate)은 파일 저장 정책 결정 전이라 변환하지 않았다.
 */
export const PersonTab: React.FC<{ personId?: number; onSaved: () => void; onDeleted: () => void }> = ({ personId, onSaved, onDeleted }) => {
  const [form] = Form.useForm<FormValues>();
  const [person, setPerson] = useState<Person>();
  const hireDate = Form.useWatch('hireDate', form);

  useEffect(() => {
    form.resetFields();
    setPerson(undefined);
    if (personId == null) return;
    empApi.getPerson(personId)
      .then(p => { setPerson(p); form.setFieldsValue({ ...p, hireDate: p.hireDate ? dayjs(p.hireDate) : null }); })
      .catch(err => message.error(errorMessage(err, '사원 조회 실패')));
  }, [personId, form]);

  const save = async () => {
    if (!person) return;
    const v = await form.validateFields();
    try {
      const saved = await empApi.updatePerson(person.personId, {
        korNm: v.korNm, hireDate: v.hireDate ? v.hireDate.format('YYYY-MM-DD') : null, orderSeq: v.orderSeq ?? null,
        emailAddr: v.emailAddr ?? null, officeTelno: v.officeTelno ?? null, officeDetail: v.officeDetail ?? null,
        mobileTelno: v.mobileTelno ?? null, note: v.note ?? null,
      });
      setPerson(saved);
      message.success('저장되었습니다.');
      onSaved();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  const remove = () => {
    if (!person) return;
    Modal.confirm({
      title: '확인',
      content: <>선택한 사원의 정보를 삭제하면 예전 데이터도 전부 삭제됩니다. 진행하시겠습니까?<br />
        <Typography.Text type="danger">[ 퇴직처리는 '일반발령' 탭에서 가능합니다 ]</Typography.Text></>,
      okText: '진행',
      cancelText: '취소',
      onOk: async () => {
        try {
          await empApi.deletePerson(person.personId);
          message.success('삭제되었습니다.');
          onDeleted();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  const disabled = !person;
  const { thYear, workYear } = yearsOf(hireDate);
  return (
    <Form form={form} labelCol={{ span: 8 }} size="small" disabled={disabled}>
      <Row gutter={12}>
        <Col span={8}><Form.Item name="empNo" label="사원번호"><Input readOnly /></Form.Item></Col>
        <Col span={8}><Form.Item name="hireDate" label="입사일"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
        <Col span={8} />
        <Col span={8}><Form.Item name="orderSeq" label="출력순서"><Input placeholder="미입력시 자동정렬" /></Form.Item></Col>
        <Col span={8}><Form.Item name="emailAddr" label="이메일"><Input /></Form.Item></Col>
        <Col span={8}><Form.Item label="년차"><Input value={thYear} disabled /></Form.Item></Col>
        <Col span={8}><Form.Item name="korNm" label="한글명" rules={[{ required: true, whitespace: true, message: '성명은 필수입력 항목입니다' }]}><Input /></Form.Item></Col>
        <Col span={8}><Form.Item name="officeTelno" label="회사전화"><Input /></Form.Item></Col>
        <Col span={8}><Form.Item label="근속년수"><Input value={workYear} disabled /></Form.Item></Col>
        <Col span={8}><Form.Item name="officeDetail" label="내선번호"><Input /></Form.Item></Col>
        <Col span={8}><Form.Item name="mobileTelno" label="휴대폰"><Input /></Form.Item></Col>
        <Col span={24}><Form.Item name="note" label="특이사항" labelCol={{ span: 2 }}><Input.TextArea rows={2} maxLength={400} /></Form.Item></Col>
      </Row>
      <Space style={{ width: '100%', justifyContent: 'center' }}>
        <Button type="primary" onClick={save}>저장</Button>
        <Button danger onClick={remove}>삭제</Button>
      </Space>
    </Form>
  );
};
