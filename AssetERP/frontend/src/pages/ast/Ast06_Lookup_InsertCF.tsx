/**
 * C/F 가져오기 창 (X03) — Ast06_Tab_TrIntrinsic의 [C/F가져오기]에서 연다
 * AS-IS: myApp/client/vi/ast/Ast06_Lookup_InsertCF.java (150줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L45-81: 모달 350×180 "C/F 가져오기", 기준일자(100, 오늘) 한 줄, 아래 가운데 [가져오기][닫기]
 * update() L83-141: 확인(450) "기준일(yyyy-MM-dd)의 C/F내역을 가져오겠습니까?" → YES → 회계마감 검사(act.Act04_GenLedger.checkClose) → ast.Ast06_Tr.insertByCf
 *   → "생성이 완료되었습니다." → callback → hide(). 실패는 서버 메시지를 그대로 보여 준다
 * 편집창 규격(11 §4a): 머리말 아래 선·푸터 위 선, 본문 위아래 12, 라벨 오른쪽 정렬
 * 스타일: MF (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, message, Modal, Space, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { actApi } from '@/api/act';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';

const FORMAT = 'YYYY-MM-DD';

interface Props {
  open: boolean;
  /** open(windowClassName, …): 거래유형을 지정한 화면 (예: "Ast06_Tab_TrIntrinsic") */
  windowClassName: string;
  /** callBack.execute(): 가져온 뒤 부르는 쪽이 다시 조회한다 */
  onDone: () => void;
  onClose: () => void;
}

export const Ast06_Lookup_InsertCF: React.FC<Props> = ({ open, windowClassName, onDone, onClose }) => {
  const [stdDate, setStdDate] = useState<Dayjs>(() => dayjs());
  const [saving, setSaving] = useState(false);

  // [E0] 화면 열림 (생성자 L45-81) → show() — 기준일자는 오늘
  useEffect(() => { if (open) setStdDate(dayjs()); }, [open]);

  // [E1] updateButton[가져오기].Select (L55) → update() L83-141
  const update = () => {
    const d = stdDate.format(FORMAT);
    Modal.confirm({
      title: '확인', content: `기준일(${d})의 C/F내역을 가져오겠습니까?`, width: 450, okText: '예', cancelText: '아니오',
      // [E3] msgBox.DialogHide [YES] (L87) → 회계마감 검사 → 당일 C/F 생성
      onOk: async () => {
        setSaving(true);
        try {
          await actApi.checkLedgerClose(d);
          await astApi.insertTrByCf(d, windowClassName);
        } catch (err) {
          message.info(errorMessage(err, '생성 실패'));
          setSaving(false);
          return;
        }
        setSaving(false);
        message.info('생성이 완료되었습니다.');
        onDone();
        onClose();
      },
    });
  };

  return (
    <Modal
      open={open}
      title="C/F 가져오기"
      width={350}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>가져오기</Button>
            {/* [E2] cancleButton[닫기].Select (L61) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 2px' }}>
        <Typography.Text style={{ width: 105, flex: 'none', textAlign: 'right', paddingRight: 10 }}>기준일자</Typography.Text>
        <DatePicker style={{ width: 130 }} allowClear={false} value={stdDate} format={FORMAT} onChange={d => d && setStdDate(d)} />
      </div>
    </Modal>
  );
};
