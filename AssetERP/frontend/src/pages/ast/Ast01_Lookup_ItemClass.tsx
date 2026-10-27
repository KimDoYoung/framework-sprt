/**
 * 자산분류 추가정보 설정 모달 (R08)
 * AS-IS: myApp/client/vi/ast/Ast01_Lookup_ItemClass.java (387줄)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Form, Input, message, Modal, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { astApi } from '@/api/ast';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { AstClassTree } from '@/types/ast';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';

interface Props {
  open: boolean;
  data: AstClassTree | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const Ast01_Lookup_ItemClass: React.FC<Props> = ({ open, data, onClose, onSuccess }) => {
  const [form] = Form.useForm();

  const [lClassCodes, setLClassCodes] = useState<Code[]>([]);
  const [mClassCodes, setMClassCodes] = useState<Code[]>([]);
  const [sClassCodes, setSClassCodes] = useState<Code[]>([]);
  const [dClassCodes, setDClassCodes] = useState<Code[]>([]);

  // [E0] 화면 열림 (생성자 L99-177) → show()
  useEffect(() => {
    if (open && data) {
      loadCodes();
      form.setFieldsValue({
        content: data.content,
        accountType: data.accountType,
        itemLClassCode: data.itemLClassCode,
        itemMClassCode: data.itemMClassCode,
        itemSClassCode: data.itemSClassCode,
        itemDClassCode: data.itemDClassCode,
        trUnit: data.trUnit,
        issueDate: data.issueDate ? dayjs(data.issueDate) : null,
        matDate: data.matDate ? dayjs(data.matDate) : null,
        corpId: data.corpId,
        curCode: data.curCode,
        depnYear: data.depnYear,
        depnRate: data.depnRate,
        depnType: data.depnType,
        evalType: data.evalType,
      });
    }
  }, [open, data]);

  const loadCodes = async () => {
    try {
      const list = await sysApi.searchCodes('ItemLClassCode');
      setLClassCodes(list);
    } catch {
      // ignore
    }
  };

  // [E4, E5, E6, E11, E12, E13] refreshCode()
  const refreshCode = async (kind: string) => {
    try {
      const list = await sysApi.searchCodes(kind);
      if (kind === 'ItemMClassCode') setMClassCodes(list);
      else if (kind === 'ItemSClassCode') setSClassCodes(list);
      else if (kind === 'ItemDClassCode') setDClassCodes(list);
    } catch {
      // ignore
    }
  };

  // [E3] accountName[계정구분].Collapse (L199)
  const handleAccountCollapse = () => {};

  // [E7] itemLClassName[ItemLClassCode].Collapse (L244)
  const handleLClassCollapse = () => {};

  // [E8] itemMClassName[sys.Sys09_Code.selectByKindCode].Collapse (L250)
  const handleMClassCollapse = () => {};

  // [E9] itemSClassName[sys.Sys09_Code.selectByKindCode].Collapse (L256)
  const handleSClassCollapse = () => {};

  // [E10] itemDClassName[sys.Sys09_Code.selectByKindCode].Collapse (L262)
  const handleDClassCollapse = () => {};

  // [E14] depnTypeName[감가상각방식].Collapse (L287) → setDepn()
  const setDepn = () => {};

  // [E15] corpName[보관처].TriggerClick (L295)
  const handleCorpTriggerClick = () => {};

  // [E1] updateButton[저장].Select (L106) → update()
  const update = async () => {
    if (!data) return;
    try {
      const v = await form.validateFields();
      await astApi.updateItemClass(data.classTreeId, {
        classTreeId: data.classTreeId,
        content: v.content,
        itemLClassCode: v.itemLClassCode,
        itemMClassCode: v.itemMClassCode,
        itemSClassCode: v.itemSClassCode,
        itemDClassCode: v.itemDClassCode,
        accountType: v.accountType,
        trUnit: v.trUnit,
        issueDate: v.issueDate ? (v.issueDate as Dayjs).format('YYYY-MM-DD') : null,
        matDate: v.matDate ? (v.matDate as Dayjs).format('YYYY-MM-DD') : null,
        corpId: v.corpId,
        curCode: v.curCode,
        depnYear: v.depnYear,
        depnRate: v.depnRate,
        depnType: v.depnType,
        evalType: v.evalType,
      });
      message.success('추가정보가 저장되었습니다.');
      onSuccess();
      onClose();
    } catch (e) {
      message.error(errorMessage(e));
    }
  };

  // [E2] closeButton[닫기].Select (L112) → hide()
  const hide = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      title="추가정보 등록/수정"
      onCancel={hide}
      width={680}
      footer={[
        <Button key="save" type="save" onClick={update}>
          저장
        </Button>,
        <Button key="close" type="close" onClick={hide}>
          닫기
        </Button>,
      ]}
    >
      <Form form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} style={{ marginTop: 16 }}>
        <Form.Item name="accountType" label="계정구분">
          {/* [E3] accountName[계정구분].Collapse */}
          <Select
            allowClear
            onDropdownVisibleChange={handleAccountCollapse}
            options={[
              { value: '1', label: '단기매매증권' },
              { value: '2', label: '매도가능증권' },
              { value: '3', label: '만기보유증권' },
            ]}
          />
        </Form.Item>

        <Form.Item name="itemLClassCode" label="대분류">
          {/* [E4] itemLClassName[ItemLClassCode].ValueChange */}
          {/* [E7] itemLClassName[ItemLClassCode].Collapse */}
          <Select
            allowClear
            onChange={() => refreshCode('ItemMClassCode')}
            onDropdownVisibleChange={handleLClassCollapse}
            options={lClassCodes.map((c) => ({ value: c.code, label: c.name }))}
          />
        </Form.Item>

        <Form.Item name="itemMClassCode" label="중분류">
          {/* [E5] itemMClassName[sys.Sys09_Code.selectByKindCode].ValueChange */}
          {/* [E8] itemMClassName[sys.Sys09_Code.selectByKindCode].Collapse */}
          {/* [E11] itemMClassName[sys.Sys09_Code.selectByKindCode].TriggerClick */}
          <Select
            allowClear
            onChange={() => refreshCode('ItemSClassCode')}
            onDropdownVisibleChange={handleMClassCollapse}
            onClick={() => refreshCode('ItemMClassCode')}
            options={mClassCodes.map((c) => ({ value: c.code, label: c.name }))}
          />
        </Form.Item>

        <Form.Item name="itemSClassCode" label="소분류">
          {/* [E6] itemSClassName[sys.Sys09_Code.selectByKindCode].ValueChange */}
          {/* [E9] itemSClassName[sys.Sys09_Code.selectByKindCode].Collapse */}
          {/* [E12] itemSClassName[sys.Sys09_Code.selectByKindCode].TriggerClick */}
          <Select
            allowClear
            onChange={() => refreshCode('ItemDClassCode')}
            onDropdownVisibleChange={handleSClassCollapse}
            onClick={() => refreshCode('ItemSClassCode')}
            options={sClassCodes.map((c) => ({ value: c.code, label: c.name }))}
          />
        </Form.Item>

        <Form.Item name="itemDClassCode" label="세분류">
          {/* [E10] itemDClassName[sys.Sys09_Code.selectByKindCode].Collapse */}
          {/* [E13] itemDClassName[sys.Sys09_Code.selectByKindCode].TriggerClick */}
          <Select
            allowClear
            onDropdownVisibleChange={handleDClassCollapse}
            onClick={() => refreshCode('ItemDClassCode')}
            options={dClassCodes.map((c) => ({ value: c.code, label: c.name }))}
          />
        </Form.Item>

        <Form.Item name="depnType" label="감가상각방식">
          {/* [E14] depnTypeName[감가상각방식].Collapse */}
          <Select
            allowClear
            onDropdownVisibleChange={setDepn}
            options={[
              { value: '1', label: '정액법' },
              { value: '2', label: '정률법' },
            ]}
          />
        </Form.Item>

        <Form.Item name="corpId" label="보관처">
          {/* [E15] corpName[보관처].TriggerClick */}
          <Input onClick={handleCorpTriggerClick} placeholder="보관처 선택" readOnly />
        </Form.Item>

        <Form.Item name="issueDate" label="발행일자">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="matDate" label="만기일자">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="content" label="내용">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
