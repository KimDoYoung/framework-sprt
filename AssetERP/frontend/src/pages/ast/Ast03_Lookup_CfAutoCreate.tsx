/**
 * 현금흐름표 일괄생성 모달 (R09) — Ast03_Lookup_CfAutoCreate
 * AS-IS: myApp/client/vi/ast/Ast03_Lookup_CfAutoCreate.java (291줄)
 */
import React, { useEffect, useState } from 'react';
import { Col, Form, Input, InputNumber, message, Modal, Row } from 'antd';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupModal } from '@/components/lookup/LookupModal';
import { AstCf, AstCfBatchCreateReq, AstCfInfo } from '@/types/ast';

interface Ast03LookupCfAutoCreateProps {
  open: boolean;
  cfInfo: AstCfInfo | null;
  onClose: () => void;
  onSuccess: (list: AstCf[]) => void;
}

const isNumeric = (s: string): boolean => /^\d+$/.test(s);

export const Ast03_Lookup_CfAutoCreate: React.FC<Ast03LookupCfAutoCreateProps> = ({
  open,
  cfInfo,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dateCode, setDateCode] = useState<string>('');
  const [holidaySettleCode, setHolidaySettleCode] = useState<string>('');

  // [E0] 화면 열림 (생성자 L84-109) → setting(), getEditor(), show()
  useEffect(() => {
    if (open) {
      if (cfInfo) {
        form.setFieldsValue({
          round: cfInfo.round ?? undefined,
          contAmt: cfInfo.contAmt ?? undefined,
          cycle: cfInfo.cycle ?? undefined,
          tax: cfInfo.tax ?? undefined,
          startYm: cfInfo.startYm ?? '',
          amt: cfInfo.amt ?? undefined,
          closeYm: cfInfo.closeYm ?? '',
        });
        setDateCode(cfInfo.dateCode ?? '');
        setHolidaySettleCode(cfInfo.holidaySettleCode ?? '');
      } else {
        form.resetFields();
        setDateCode('');
        setHolidaySettleCode('');
      }
    }
  }, [open, cfInfo, form]);

  // [E1] contAmt[금액].ValueChange (L119) & [E2] tax[세금].ValueChange (L126) → setAmt()
  const handleAmtChange = () => {
    const contAmt = Number(form.getFieldValue('contAmt') || 0);
    const tax = Number(form.getFieldValue('tax') || 0);
    form.setFieldsValue({ amt: contAmt + tax });
  };

  // [E4] cancleButton[닫기].Select (L139) → hide()
  const hide = () => {
    onClose();
  };

  // [E3] updateButton[생성].Select (L133) → update()
  const update = () => {
    if (!cfInfo) return;
    const values = form.getFieldsValue();
    const round = values.round;
    const startYm = (values.startYm ?? '').trim();
    const closeYm = (values.closeYm ?? '').trim();
    const cycle = values.cycle;

    if (
      round == null ||
      !startYm ||
      !dateCode ||
      !closeYm ||
      cycle == null ||
      !holidaySettleCode
    ) {
      message.warning('필드 값을 확인해주세요');
      return;
    }

    if (
      startYm.length < 7 ||
      !isNumeric(startYm.substring(0, 4)) ||
      !isNumeric(startYm.substring(5, 7)) ||
      startYm.substring(4, 5) !== '-'
    ) {
      message.warning('시작년월(YYYY-MM) 형식으로 입력해주세요');
      return;
    }

    if (
      closeYm.length < 7 ||
      !isNumeric(closeYm.substring(0, 4)) ||
      !isNumeric(closeYm.substring(5, 7)) ||
      closeYm.substring(4, 5) !== '-'
    ) {
      message.warning('종료년월(YYYY-MM) 형식으로 입력해주세요');
      return;
    }

    // [E7] msgBox.DialogHide [YES] (L247) → callback(), hide()
    Modal.confirm({
      title: '일괄생성',
      content: '이전 값들이 삭제되고 생성됩니다. 진행하시겠습니까?',
      width: 300,
      onOk: async () => {
        setLoading(true);
        try {
          const req: AstCfBatchCreateReq = {
            cfInfoId: cfInfo.cfInfoId,
            dateCode,
            holidaySettleCode,
            startYm,
            closeYm,
            amt: values.amt ?? 0,
            contAmt: values.contAmt ?? 0,
            tax: values.tax ?? 0,
            cycle,
            round,
          };
          const res = await astApi.batchCreateCf(req);
          onSuccess(res);
          hide();
        } catch (e) {
          message.error(errorMessage(e));
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <LookupModal
      open={open}
      title="일괄생성"
      onCancel={hide}
      width={550}
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
      <Form form={form} layout="horizontal" labelCol={{ flex: '100px' }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="round" label="시작회차">
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            {/* [E5] dateName[발생일].Collapse */}
            <Form.Item label="발생일">
              <SystemCodeComboBox
                kindCd="DateCode"
                value={dateCode}
                onChange={(code) => setDateCode(code ?? '')}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="contAmt" label="금액">
              <InputNumber min={0} style={{ width: '100%' }} onChange={handleAmtChange} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="cycle" label="계산주기">
              <InputNumber min={1} addonAfter="개월" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="tax" label="세금">
              <InputNumber min={0} style={{ width: '100%' }} onChange={handleAmtChange} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="startYm" label="시작년월">
              <Input placeholder="ex) 2021-01" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="amt" label="결제금액">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="closeYm" label="종료년월">
              <Input placeholder="ex) 2021-01" />
            </Form.Item>
          </Col>
          <Col span={12}>
            {/* [E6] holidaySettleName[휴일설정].Collapse */}
            <Form.Item label="휴일설정">
              <SystemCodeComboBox
                kindCd="HolidaySettleCode"
                value={holidaySettleCode}
                onChange={(code) => setHolidaySettleCode(code ?? '')}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </LookupModal>
  );
};
