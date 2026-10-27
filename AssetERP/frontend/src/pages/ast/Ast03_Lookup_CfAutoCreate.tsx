/**
 * 현금흐름표 일괄생성 모달 (R09) — Ast03_Lookup_CfAutoCreate
 * AS-IS: myApp/client/vi/ast/Ast03_Lookup_CfAutoCreate.java (292줄)
 */
import React, { useEffect, useState } from 'react';
import { Col, Form, Input, InputNumber, message, Modal, Row, Select } from 'antd';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { AstCf, AstCfBatchCreateReq, AstCfInfo } from '@/types/ast';

interface Ast03LookupCfAutoCreateProps {
  open: boolean;
  cfInfo: AstCfInfo | null;
  onClose: () => void;
  onSuccess: (cfs: AstCf[]) => void;
}

export const Ast03_Lookup_CfAutoCreate: React.FC<Ast03LookupCfAutoCreateProps> = ({
  open,
  cfInfo,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // [E0] 화면 열림 (생성자 L84-109) → setting(), getEditor(), show()
  useEffect(() => {
    if (open && cfInfo) {
      form.setFieldsValue({
        dateCode: cfInfo.dateCd || '31',
        holidaySettleCode: cfInfo.holidaySettleCd || '0',
        cycle: cfInfo.cycle || 1,
        contAmt: cfInfo.contAmt || 0,
        tax: cfInfo.tax || 0,
        amt: cfInfo.amt || 0,
        round: cfInfo.round || 1,
        startYm: cfInfo.startYm || '',
        closeYm: cfInfo.closeYm || '',
      });
    }
  }, [open, cfInfo, form]);

  // [E1] contAmt[금액].ValueChange (L119) & [E2] tax[세금].ValueChange (L126) → setAmt()
  const handleAmtChange = () => {
    const contAmt = form.getFieldValue('contAmt') || 0;
    const tax = form.getFieldValue('tax') || 0;
    form.setFieldsValue({ amt: contAmt - tax });
  };

  // [E4] cancleButton[닫기].Select (L139) → hide()
  const hide = () => {
    onClose();
  };

  // [E3] updateButton[생성].Select (L133) → update()
  const update = async () => {
    try {
      const values = await form.validateFields();
      if (!cfInfo) return;

      // [E7] msgBox.DialogHide [YES] (L247) → callback(), hide()
      Modal.confirm({
        title: '현금흐름 일괄생성',
        content: '현금흐름을 일괄 생성하시겠습니까? (기존 일정 데이터는 삭제됩니다)',
        onOk: async () => {
          setLoading(true);
          try {
            const req: AstCfBatchCreateReq = {
              cfInfoId: cfInfo.cfInfoId,
              dateCode: values.dateCode,
              holidaySettleCode: values.holidaySettleCode,
              startYm: values.startYm,
              closeYm: values.closeYm,
              amt: values.amt,
              contAmt: values.contAmt,
              tax: values.tax,
              cycle: values.cycle,
              round: values.round,
            };
            const res = await astApi.batchCreateCf(req);
            message.success('현금흐름 일정이 생성되었습니다.');
            onSuccess(res);
            hide();
          } catch (e) {
            message.error(errorMessage(e));
          } finally {
            setLoading(false);
          }
        },
      });
    } catch {
      // 검증 실패
    }
  };

  return (
    <Modal
      open={open}
      title="현금흐름 일괄생성"
      onCancel={hide}
      width={520}
      confirmLoading={loading}
      footer={[
        // [E3] updateButton[생성].Select
        <Button key="generate" type="generate" onClick={update}>
          생성
        </Button>,
        // [E4] cancleButton[닫기].Select
        <Button key="close" type="close" onClick={hide}>
          닫기
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={{ dateCode: '31', holidaySettleCode: '0', cycle: 1, round: 1 }}>
        <Row gutter={16}>
          <Col span={12}>
            {/* [E5] dateName[발생일].Collapse */}
            <Form.Item name="dateCode" label="발생일" rules={[{ required: true }]}>
              <Select
                options={[
                  ...Array.from({ length: 30 }, (_, i) => {
                    const d = String(i + 1).padStart(2, '0');
                    return { label: `${d}일`, value: d };
                  }),
                  { label: '말일', value: '31' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            {/* [E6] holidaySettleName[휴일설정].Collapse */}
            <Form.Item name="holidaySettleCode" label="휴일설정" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: '해당없음', value: '0' },
                  { label: '직전영업일', value: '1' },
                  { label: '직후영업일', value: '2' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="startYm" label="계산시작월" rules={[{ required: true, message: 'ex) 2021-01' }]}>
              <Input placeholder="ex) 2021-01" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="closeYm" label="계산종료월" rules={[{ required: true, message: 'ex) 2021-01' }]}>
              <Input placeholder="ex) 2021-01" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="cycle" label="주기(개월)" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="round" label="시작회차" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="contAmt" label="약정금액">
              <InputNumber min={0} style={{ width: '100%' }} onChange={handleAmtChange} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="tax" label="세금">
              <InputNumber min={0} style={{ width: '100%' }} onChange={handleAmtChange} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="amt" label="결제금액">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
