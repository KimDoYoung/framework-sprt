/**
 * 자산분류 등록/수정 모달 (R08)
 * AS-IS: myApp/client/vi/ast/Ast01_Edit_ClassTree.java (268줄)
 * EditModal 규격 (11 §4a)
 */
import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, message, Modal, Select } from 'antd';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstClassTree } from '@/types/ast';
import { Button } from '@/components/button';
import { Ast01_Lookup_ItemClass } from './Ast01_Lookup_ItemClass';

interface Props {
  open: boolean;
  mode: 'insert' | 'update';
  parentId: number | null;
  data: AstClassTree | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const Ast01_Edit_ClassTree: React.FC<Props> = ({
  open,
  mode,
  parentId,
  data,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [addInfoOpen, setAddInfoOpen] = useState(false);

  useEffect(() => {
    if (open) {
      if (mode === 'insert') {
        form.resetFields();
        form.setFieldsValue({
          parentTreeId: parentId ?? 0,
          useYn: 'true',
          seq: 1,
          typeCode: 'IC',
          assetType: '2',
        });
        astApi.createCode(parentId, 'IC').then((code) => {
          form.setFieldValue('classTreeCode', code);
        });
      } else if (data) {
        form.setFieldsValue({
          classTreeId: data.classTreeId,
          parentTreeId: data.parentTreeId,
          classTreeCode: data.classTreeCode,
          classTreeName: data.classTreeName,
          seq: data.seq,
          note: data.note,
          useYn: data.useYn,
          typeCode: data.typeCode,
          isin: data.isin,
          assetType: data.assetType,
        });
      }
    }
  }, [open, mode, parentId, data]);

  // [E4] addInfoButton[추가정보].Select (L174) → lookupAddInfo()
  const lookupAddInfo = () => {
    if (mode === 'insert' || !data) {
      message.warning('분류를 먼저 저장한 후 추가정보를 설정하세요.');
      return;
    }
    setAddInfoOpen(true);
  };

  // [E1] deleteButton[삭제].Select (L156) → deleteRow()
  const deleteRow = () => {
    if (!data || mode === 'insert') return;
    Modal.confirm({
      title: '삭제 확인',
      content: '삭제하시겠습니까?',
      // [E5] msgBox.DialogHide [YES] (L216) → delete()
      onOk: async () => {
        try {
          await astApi.deleteClassTree(data.classTreeId);
          message.success('삭제되었습니다.');
          onSuccess();
          onClose();
        } catch (e) {
          message.error(errorMessage(e));
        }
      },
    });
  };

  // [E2] updateButton[저장].Select (L162) → update()
  const update = async () => {
    try {
      const v = await form.validateFields();
      if (mode === 'insert') {
        await astApi.createClassTree({
          parentTreeId: parentId ?? 0,
          classTreeCode: v.classTreeCode,
          classTreeName: v.classTreeName,
          seq: v.seq,
          typeCode: 'IC',
          isin: v.isin,
          note: v.note,
          useYn: v.useYn,
          assetType: v.assetType,
        });
        message.success('등록되었습니다.');
      } else if (data) {
        await astApi.updateClassTree(data.classTreeId, {
          classTreeId: data.classTreeId,
          parentTreeId: data.parentTreeId,
          classTreeCode: data.classTreeCode,
          classTreeName: v.classTreeName,
          seq: v.seq,
          typeCode: data.typeCode,
          isin: v.isin,
          note: v.note,
          useYn: v.useYn,
          assetType: v.assetType,
        });
        message.success('저장되었습니다.');
      }
      onSuccess();
      onClose();
    } catch (e) {
      message.error(errorMessage(e));
    }
  };

  // [E3] closeButton[닫기].Select (L168) → hide()
  const hide = () => {
    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        title={mode === 'insert' ? '자산분류 등록' : '자산분류 상세'}
        onCancel={hide}
        width={560}
        footer={[
          <Button key="addInfo" type="default" onClick={lookupAddInfo}>
            추가정보
          </Button>,
          mode === 'update' && (
            <Button key="delete" type="delete" onClick={deleteRow}>
              삭제
            </Button>
          ),
          <Button key="save" type="save" onClick={update}>
            저장
          </Button>,
          <Button key="close" type="close" onClick={hide}>
            닫기
          </Button>,
        ].filter(Boolean)}
      >
        <Form form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} style={{ marginTop: 16 }}>
          <Form.Item name="classTreeCode" label="분류코드">
            <Input disabled />
          </Form.Item>

          <Form.Item name="classTreeName" label="분류명" rules={[{ required: true, message: '분류명을 입력하세요.' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="seq" label="순서" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: 120 }} />
          </Form.Item>

          <Form.Item name="useYn" label="사용여부">
            <Select
              options={[
                { value: 'true', label: '사용' },
                { value: 'false', label: '미사용' },
              ]}
            />
          </Form.Item>

          <Form.Item name="assetType" label="자산구분">
            <Select
              options={[
                { value: '1', label: '고유자산' },
                { value: '2', label: '운용자산' },
              ]}
            />
          </Form.Item>

          <Form.Item name="note" label="비고">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <Ast01_Lookup_ItemClass
        open={addInfoOpen}
        data={data}
        onClose={() => setAddInfoOpen(false)}
        onSuccess={onSuccess}
      />
    </>
  );
};
