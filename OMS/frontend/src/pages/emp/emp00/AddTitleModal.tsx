import React, { useEffect, useState } from 'react';
import { Checkbox, Col, DatePicker, Form, Input, Modal, Row, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { empApi } from '../../../api/emp';
import { errorMessage } from '../../../api/client';
import { AddTitle } from '../../../types/emp';
import { CodeSelect } from '../../../components/common/CodeSelect';
import { OrgLookup } from '../../../components/lookup/OrgLookup';

interface FormValues {
  startDate: Dayjs; closeDate?: Dayjs | null; orgCodeId: number; orgNm: string; orgHeadYn: boolean;
  titleCd: string; posCd: string; transReason?: string;
}

/** 겸직 등록·수정 (AS-IS Emp04_Edit_AddTitle). target이 { personId }뿐이면 신규 */
export const AddTitleModal: React.FC<{ target?: Partial<AddTitle> & { personId: number }; onClose: () => void; onSaved: () => void }> = ({ target, onClose, onSaved }) => {
  const [form] = Form.useForm<FormValues>();
  const [orgOpen, setOrgOpen] = useState(false);
  const isNew = target?.addTitleId == null;

  useEffect(() => {
    if (!target) return;
    form.resetFields();
    form.setFieldsValue(isNew
      // AS-IS insert: 시작일 오늘
      ? { startDate: dayjs(), orgHeadYn: false }
      : {
        startDate: dayjs(target.startDate), closeDate: target.closeDate ? dayjs(target.closeDate) : null,
        orgCodeId: target.orgCodeId, orgNm: target.orgNm ?? '', orgHeadYn: target.orgHeadYn,
        titleCd: target.titleCd, posCd: target.posCd ?? undefined, transReason: target.transReason ?? undefined,
      });
  }, [target, form, isNew]);

  const save = async () => {
    if (!target) return;
    const v = await form.validateFields();
    const body = {
      startDate: v.startDate.format('YYYY-MM-DD'), closeDate: v.closeDate ? v.closeDate.format('YYYY-MM-DD') : null,
      orgCodeId: v.orgCodeId, titleCd: v.titleCd, posCd: v.posCd, orgHeadYn: !!v.orgHeadYn, transReason: v.transReason ?? null,
    };
    try {
      if (isNew) await empApi.createAddTitle(target.personId, body);
      else await empApi.updateAddTitle(target.addTitleId!, body);
      message.success('저장되었습니다.');
      onSaved();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <Modal open={!!target} title="겸직 등록" width={850} onOk={save} onCancel={onClose} okText="저장" cancelText="닫기" forceRender>
      <Form form={form} labelCol={{ span: 8 }} size="small">
        <Form.Item name="orgCodeId" hidden><Input /></Form.Item>
        <Row gutter={12}>
          <Col span={8}><Form.Item name="startDate" label="시작일자" rules={[{ required: true, message: '겸직시작일은 필수입력 항목입니다' }]}><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
          <Col span={10}>
            <Form.Item name="orgNm" label="조직" rules={[{ required: true, message: '조직은 필수입력 항목입니다' }]}>
              <Input readOnly suffix={<SearchOutlined style={{ cursor: 'pointer' }} onClick={() => {
                if (!form.getFieldValue('startDate')) { message.warning('발령일을 먼저 등록해야 합니다.'); return; }
                setOrgOpen(true);
              }} />} />
            </Form.Item>
          </Col>
          <Col span={6}><Form.Item name="orgHeadYn" label="조직장" valuePropName="checked"><Checkbox /></Form.Item></Col>
          <Col span={8}><Form.Item name="closeDate" label="종료일자"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
          <Col span={8}><Form.Item name="titleCd" label="직책" rules={[{ required: true, message: '직책은 필수입력 항목입니다' }]}><CodeSelect kindCd="EmpTitleCode" /></Form.Item></Col>
          <Col span={8}><Form.Item name="posCd" label="직위" rules={[{ required: true, message: '직위는 필수입력 항목입니다' }]}><CodeSelect kindCd="EmpPosCode" /></Form.Item></Col>
          <Col span={24}><Form.Item name="transReason" label="겸직사유" labelCol={{ span: 3 }}><Input.TextArea rows={3} maxLength={400} /></Form.Item></Col>
        </Row>
      </Form>
      <OrgLookup
        open={orgOpen}
        baseDate={form.getFieldValue('startDate')?.format?.('YYYY-MM-DD')}
        onCancel={() => setOrgOpen(false)}
        onOk={org => { form.setFieldsValue({ orgCodeId: org.orgCodeId, orgNm: org.korNm }); setOrgOpen(false); }}
      />
    </Modal>
  );
};
