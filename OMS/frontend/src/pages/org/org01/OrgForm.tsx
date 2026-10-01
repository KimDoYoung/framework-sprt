import React, { useState } from 'react';
import { Button, Col, DatePicker, Form, FormInstance, Input, Row, Space, Typography } from 'antd';
import { Dayjs } from 'dayjs';
import { CodeSelect } from '../../../components/common/CodeSelect';
import { OrgCode } from '../../../types/org';
import { OrgParentModal } from './OrgParentModal';

export interface OrgFormValues {
  parentCodeId: number;
  parentNm: string;
  orgCd: string;
  korNm: string;
  engNm?: string;
  levelCd: string;
  sortOrder?: string;
  modDate?: Dayjs;
  modReason?: string;
  openDate: Dayjs;
  openReason: string;
  closeDate?: Dayjs | null;
  closeReason?: string;
  note?: string;
}

interface OrgFormProps {
  form: FormInstance<OrgFormValues>;
  /** create: 신규(개설일·사유 입력, 종료 비활성) / edit: 이력 편집(변경일·사유 입력, 조직코드·개설 비활성) */
  mode: 'create' | 'edit';
  /** 상위조직 선택용 전체 조직 */
  orgs: OrgCode[];
  /** 편집 중인 조직 (자기 자신 아래로는 옮길 수 없다) */
  codeId?: number;
}

const req = (msg: string) => [{ required: true, whitespace: true, message: msg }];

/** 조직 상세 입력 (AS-IS Org01_Edit_OrgCode 신규 / Org02_Edit_Info 편집 공통) */
export const OrgForm: React.FC<OrgFormProps> = ({ form, mode, orgs, codeId }) => {
  const [parentOpen, setParentOpen] = useState(false);
  const edit = mode === 'edit';

  return (
    <Form form={form} labelCol={{ span: 7 }} size="small">
      <Form.Item name="parentCodeId" hidden><Input /></Form.Item>
      <Form.Item label="상위조직">
        <Space.Compact style={{ width: '100%' }}>
          <Form.Item name="parentNm" noStyle><Input readOnly /></Form.Item>
          {edit && <Button onClick={() => setParentOpen(true)}>상위조직변경</Button>}
        </Space.Compact>
      </Form.Item>
      <Row gutter={8}>
        {edit ? (
          <>
            <Col span={12}><Form.Item name="modDate" label={<Typography.Text type="danger">변경일</Typography.Text>} rules={[{ required: true, message: '변경일은 필수입력 항목입니다' }]}><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={12}><Form.Item name="modReason" label="변경사유"><Input /></Form.Item></Col>
          </>
        ) : (
          <>
            <Col span={12}><Form.Item name="openDate" label="개설일" rules={[{ required: true, message: '개설일은 필수입력 항목입니다' }]}><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={12}><Form.Item name="openReason" label="개설사유" rules={req('개설사유는 필수입력 항목입니다')}><Input /></Form.Item></Col>
          </>
        )}
        <Col span={12}><Form.Item name="orgCd" label="조직코드" rules={req('조직코드는 필수입력 항목입니다')}><Input maxLength={10} disabled={edit} /></Form.Item></Col>
        <Col span={12}><Form.Item name="korNm" label="조직명" rules={req('조직명은 필수입력 항목입니다')}><Input maxLength={100} /></Form.Item></Col>
        <Col span={12}><Form.Item name="levelCd" label="조직레벨" rules={[{ required: true, message: '조직레벨은 필수입력 항목입니다' }]}><CodeSelect kindCd="OrgLevelCode" /></Form.Item></Col>
        <Col span={12}><Form.Item name="sortOrder" label="정렬순서"><Input maxLength={10} /></Form.Item></Col>
        {edit && (
          <>
            <Col span={12}><Form.Item name="openDate" label="개설일"><DatePicker style={{ width: '100%' }} disabled /></Form.Item></Col>
            <Col span={12}><Form.Item name="openReason" label="개설사유"><Input disabled /></Form.Item></Col>
          </>
        )}
        <Col span={12}><Form.Item name="closeDate" label="종료일"><DatePicker style={{ width: '100%' }} disabled={!edit} /></Form.Item></Col>
        <Col span={12}><Form.Item name="closeReason" label="종료사유"><Input disabled={!edit} /></Form.Item></Col>
        <Col span={24}><Form.Item name="note" label={edit ? '비고' : '주요업무'} labelCol={{ span: 3 }}><Input.TextArea rows={edit ? 3 : 2} maxLength={400} /></Form.Item></Col>
      </Row>
      <OrgParentModal
        open={parentOpen}
        orgs={orgs}
        excludeId={codeId}
        onCancel={() => setParentOpen(false)}
        onOk={parent => {
          form.setFieldsValue({ parentCodeId: parent.codeId, parentNm: parent.korNm });
          setParentOpen(false);
        }}
      />
    </Form>
  );
};

/** 폼 값 → API 요청 */
export const toOrgSave = (v: OrgFormValues, infoId: number | null) => ({
  infoId,
  parentCodeId: Number(v.parentCodeId),
  orgCd: v.orgCd,
  korNm: v.korNm,
  engNm: v.engNm ?? null,
  levelCd: v.levelCd,
  sortOrder: v.sortOrder ?? null,
  modDate: v.modDate ? v.modDate.format('YYYY-MM-DD') : null,
  modReason: v.modReason ?? null,
  openDate: v.openDate.format('YYYY-MM-DD'),
  openReason: v.openReason,
  closeDate: v.closeDate ? v.closeDate.format('YYYY-MM-DD') : null,
  closeReason: v.closeReason ?? null,
  note: v.note ?? null,
});
