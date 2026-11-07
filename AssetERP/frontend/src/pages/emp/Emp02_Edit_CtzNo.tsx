/**
 * 주민등록번호 수정창 — 사원정보 관리 #1029 기타정보 탭(Emp02_TabPage_Others) 주민번호 옆 아이콘이 연다
 * AS-IS: myApp/client/vi/emp/Emp02_Edit_CtzNo.java (247줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본 IDMS-IC)
 * 생성자 L40-54: 500×160 모달 "주민등록번호", makeLayout() L79-103: 한 글자 칸 6개 - 칸 1개 + 안내 "뒷자리는 첫 자리만 입력해 주세요", 아래 [확인][닫기]
 * 서버를 부르지 않는다. [확인]은 "앞6자리-뒷첫자리" + "000000"을 돌려주고, 저장은 기타정보 탭 [저장]이 한다
 * 모달 규격: EditModal(11 §4a)
 * 스타일: MF (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useRef, useState } from 'react';
import { Input, InputRef, Modal, Space, Typography } from 'antd';
import { Button } from '@/components/button';

const COUNT = 7;

interface Props {
  /** edit(ctzNo, …)의 지금 주민번호(마스킹 전 값) */
  ctzNo: string | null | undefined;
  /** callback.execute(result) — "YYMMDD-G000000" */
  onResult: (ctzNo: string) => void;
  onClose: () => void;
}

export const Emp02_Edit_CtzNo: React.FC<Props> = ({ ctzNo, onResult, onClose }) => {
  // edit() L56-77: 칸을 비우고 '-'를 뺀 값을 한 글자씩 넣는다 → 첫 칸 포커스
  const [values, setValues] = useState<string[]>(() => {
    const v = (ctzNo ?? '').replaceAll('-', '');
    return Array.from({ length: COUNT }, (_, i) => (i < v.length ? v.charAt(i) : ''));
  });
  const refs = useRef<(InputRef | null)[]>([]);
  const focus = (i: number) => refs.current[i]?.focus();

  // [E0] 화면 열림 (생성자 L40-54) → settings(), makeLayout(), show() — 첫 칸 포커스
  useEffect(() => { setTimeout(() => focus(0), 0); }, []);

  const setAt = (i: number, v: string) => setValues(prev => prev.map((x, j) => (j === i ? v : x)));
  const isDigit = (c: string) => c >= '0' && c <= '9';

  // [E1] field.KeyPress (L111-143): 숫자면 기존 값을 선택(덮어쓰기), 지우기·Tab·좌우 화살표 말고는 막는다
  const onKeyDown = (i: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key.length === 1 && isDigit(e.key)) {
      if (values[i].length === 1) e.currentTarget.select();
      return;
    }
    if (['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    if (e.ctrlKey || e.metaKey || e.altKey || e.key.length > 1) return;  // 단축키·기능키는 브라우저 기본 동작
    e.preventDefault();
  };

  // [E2] field.KeyUp (L144-179): 지우기로 비면 앞 칸, 숫자가 아니면 비우고, 숫자면 다음 칸
  const onKeyUp = (i: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (e.key === 'Backspace') {
      if (value.length === 0 && i > 0) focus(i - 1);
      return;
    }
    if (value.length === 0) return;
    if (!isDigit(value.charAt(0))) { setAt(i, ''); return; }
    if (i < COUNT - 1 && e.key.length === 1) focus(i + 1);
  };

  // confirm() L199-212 / getCtzNo() L214-239: 빈 칸·숫자 아닌 칸이 있으면 그 칸으로 가고 멈춘다(메시지 없음)
  const confirm = () => {
    let s = '';
    for (let i = 0; i < COUNT; i++) {
      const v = values[i];
      if (v.length !== 1) { focus(i); return; }
      if (!isDigit(v)) { setAt(i, ''); focus(i); return; }
      if (i === 6) s += '-';
      s += v;
    }
    onResult(s + '000000');
    onClose();
  };

  const field = (i: number) => (
    <Input
      key={i}
      ref={el => { refs.current[i] = el; }}
      value={values[i]}
      maxLength={1}
      style={{ width: 35, height: 30, textAlign: 'center', padding: 0 }}
      onChange={e => setAt(i, e.target.value)}
      onKeyDown={onKeyDown(i)}
      onKeyUp={onKeyUp(i)}
    />
  );

  return (
    <Modal
      open
      title="주민등록번호"
      width={500}
      maskClosable={false}
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E3] confirmButton[확인].Select (L185) → confirm() */}
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E4] closeButton[닫기].Select (L191) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '12px 2px' }}>
        {[0, 1, 2, 3, 4, 5].map(field)}
        <span style={{ width: 15, textAlign: 'center' }}>-</span>
        {field(6)}
        <Typography.Text style={{ marginLeft: 11 }}>뒷자리는 첫 자리만 입력해 주세요</Typography.Text>
      </div>
    </Modal>
  );
};
