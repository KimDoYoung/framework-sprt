/**
 * 기타 입사일 정보 창 — 사원정보 관리 #1029 인사정보 탭(Emp01_TabPage_Person) 입사일 옆 아이콘(L325-332)이 연다. 메뉴 없는 창(13-누락대장 4-2).
 * AS-IS: myApp/client/vi/emp/Emp02_Lookup_HireDate.java (122줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, IDMS-IC)
 * 생성자(personId) L35-60: 모달 350×230 "기타 입사일 정보", 라벨 폭 150 — 그룹사 입사일 · 휴가계산용 입사일, 아래 [저장][닫기]. 편집창 규격(11 §4a)
 * 저장해도 창은 닫지 않고, 부른 화면도 다시 읽지 않는다(원본 그대로).
 * 스타일: MF (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, message, Modal, Space, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { empApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';

const FORMAT = 'YYYY-MM-DD';
const toDay = (v?: string | null) => (v ? dayjs(v.slice(0, 10)) : null);

interface Props {
  /** new Emp02_Lookup_HireDate(personId) — 값이 있으면 열린다 */
  personId: number | null;
  onClose: () => void;
}

/** 라벨 폭 150 (form.setLabelWidth(150)) */
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Typography.Text style={{ width: 150, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10 }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

export const Emp02_Lookup_HireDate: React.FC<Props> = ({ personId, onClose }) => {
  const [othersId, setOthersId] = useState<number | null | undefined>(null);
  const [groupHireDate, setGroupHireDate] = useState<Dayjs | null>(null);
  const [leaveCalcHireDate, setLeaveCalcHireDate] = useState<Dayjs | null>(null);
  const [saving, setSaving] = useState(false);

  // [E0] 화면 열림 (생성자 L35-60) → setDate() L62-77: emp.Emp02_Others.selectByPersonId(personId) → 두 입사일
  useEffect(() => {
    setOthersId(null);
    setGroupHireDate(null);
    setLeaveCalcHireDate(null);
    if (personId == null) return;
    empApi.getOthers(personId)
      .then(o => {
        setOthersId(o.othersId);
        setGroupHireDate(toDay(o.hireDateGroup));
        setLeaveCalcHireDate(toDay(o.hireDateLeaveCalc));
      })
      .catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [personId]);

  if (personId == null) return null;

  // [E1] updateButton[저장].Select (L80) → update() L95-113: emp.Emp02_Others.updateHireDate(othersId, 그룹사 입사일, 휴가계산용 입사일)
  const update = async () => {
    setSaving(true);
    try {
      await empApi.updateHireDate(personId, othersId, groupHireDate?.format(FORMAT) ?? null, leaveCalcHireDate?.format(FORMAT) ?? null);
      message.success('저장이 완료되었습니다.');
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      title="기타 입사일 정보"
      width={380}
      maskClosable={false}
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L87) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        <Field label="그룹사 입사일">
          <DatePicker style={{ width: '100%' }} format={FORMAT} value={groupHireDate} onChange={setGroupHireDate} />
        </Field>
        <Field label="휴가계산용 입사일">
          <DatePicker style={{ width: '100%' }} format={FORMAT} value={leaveCalcHireDate} onChange={setLeaveCalcHireDate} />
        </Field>
      </div>
    </Modal>
  );
};
