import React, { useEffect } from 'react';
import { Button, Form, Input, Modal, Select, Space, message } from 'antd';
import { sysApi } from '../../../api/sys';
import { errorMessage } from '../../../api/client';
import { MenuItem, MenuItemSave } from '../../../types/sys';

interface MenuEditModalProps {
  /** 수정할 메뉴. 신규면 { parentId }만 */
  target?: Partial<MenuItem> & { parentId: number };
  onClose: () => void;
  /** 저장·삭제 후 (저장: 저장된 메뉴, 삭제: 상위 메뉴 ID) */
  onSaved: (focusMenuId: number) => void;
}

/** 메뉴 편집 팝업 (AS-IS Sys06_Edit_Menu). 신규는 POST, 수정은 PUT, 삭제는 기존 메뉴만 */
export const MenuEditModal: React.FC<MenuEditModalProps> = ({ target, onClose, onSaved }) => {
  const [form] = Form.useForm<MenuItemSave>();
  const isNew = target?.menuId == null;

  useEffect(() => {
    if (target) {
      form.setFieldsValue({
        menuNm: target.menuNm ?? '',
        classNm: target.classNm ?? '',
        menuNo: target.menuNo ?? '',
        seq: target.seq ?? '',
        useYn: target.useYn ?? true,
        // AS-IS insertMenu: 신규 메뉴 비고 기본값
        note: target.note ?? (isNew ? 'insert menu' : ''),
      });
    }
  }, [target, form, isNew]);

  const save = async () => {
    if (!target) return;
    const values = await form.validateFields();
    const body: MenuItemSave = { ...values, parentId: target.parentId };
    try {
      const saved = isNew ? await sysApi.createMenuItem(body) : await sysApi.updateMenuItem(target.menuId!, body);
      message.success('저장되었습니다.');
      onSaved(saved.menuId);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  const remove = () => {
    Modal.confirm({
      title: '삭제',
      content: '선택한 메뉴를 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await sysApi.deleteMenuItem(target!.menuId!);
          message.success('삭제되었습니다.');
          onSaved(target!.parentId);
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  return (
    <Modal
      open={!!target}
      title={isNew ? '메뉴 등록' : '메뉴 편집'}
      width={550}
      onCancel={onClose}
      destroyOnClose
      footer={
        <Space>
          {!isNew && <Button danger onClick={remove}>삭제</Button>}
          <Button type="primary" onClick={save}>저장</Button>
          <Button onClick={onClose}>닫기</Button>
        </Space>
      }
    >
      <Form form={form} labelCol={{ span: 5 }} preserve={false}>
        <Form.Item name="menuNm" label="메뉴명" rules={[{ required: true, whitespace: true, message: '메뉴명을 입력하세요.' }]}>
          <Input maxLength={100} />
        </Form.Item>
        <Form.Item name="classNm" label="클래스명">
          <Input maxLength={400} />
        </Form.Item>
        <Space.Compact block>
          <Form.Item name="menuNo" label="화면번호" labelCol={{ span: 10 }} style={{ flex: 1 }}>
            <Input maxLength={4} />
          </Form.Item>
          <Form.Item name="seq" label="정렬순서" labelCol={{ span: 10 }} style={{ flex: 1 }}>
            <Input maxLength={100} />
          </Form.Item>
        </Space.Compact>
        <Form.Item name="useYn" label="사용여부">
          <Select style={{ width: 140 }} options={[{ label: '사용함', value: true }, { label: '사용안함', value: false }]} />
        </Form.Item>
        <Form.Item name="note" label="비고">
          <Input.TextArea rows={6} maxLength={400} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
