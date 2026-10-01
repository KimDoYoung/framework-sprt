import React, { useEffect } from 'react';
import { Form, Modal, message } from 'antd';
import dayjs from 'dayjs';
import { orgApi } from '../../../api/org';
import { errorMessage } from '../../../api/client';
import { OrgCode } from '../../../types/org';
import { OrgForm, OrgFormValues, toOrgSave } from './OrgForm';

/** 하위조직 등록 (AS-IS Org01_Edit_OrgCode, insertData) */
export const OrgCreateModal: React.FC<{ parent?: OrgCode; orgs: OrgCode[]; onClose: () => void; onSaved: (o: OrgCode) => void }> = ({ parent, orgs, onClose, onSaved }) => {
  const [form] = Form.useForm<OrgFormValues>();

  useEffect(() => {
    if (parent) {
      form.resetFields();
      // AS-IS: 개설일 기본값 오늘
      form.setFieldsValue({ parentCodeId: parent.codeId, parentNm: parent.korNm, openDate: dayjs() });
    }
  }, [parent, form]);

  const save = async () => {
    const v = await form.validateFields();
    try {
      const saved = await orgApi.createOrgCode(toOrgSave(v, null));
      message.success('등록되었습니다.');
      onSaved(saved);
    } catch (err) {
      message.error(errorMessage(err, '등록 실패'));
    }
  };

  return (
    <Modal open={!!parent} title="조직상세 정보" width={600} onOk={save} onCancel={onClose} okText="저장" cancelText="닫기" forceRender>
      <OrgForm form={form} mode="create" orgs={orgs} />
    </Modal>
  );
};
