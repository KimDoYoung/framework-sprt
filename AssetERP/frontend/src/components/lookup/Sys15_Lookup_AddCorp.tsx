/**
 * 거래처추가 편집창 — Sys15_Lookup_Corp의 [거래처추가](regYn)가 연다 (여러 도메인이 쓰는 공통 창).
 * AS-IS: myApp/client/vi/sys/Sys15_Lookup_AddCorp.java (232줄) — 메서드 이름·줄 번호는 원본(IDMS-IC)
 * open(callback) L65-82: 모달 420×460 "거래처추가", 첫 포커스 거래처명(setFocusWidget), 거래처구분(콤보 CorpType)·거래처명·사업자번호·거래처코드·전화번호·주소·비고 + 안내 글 + [저장][닫기]
 * setting() L84-159: 거래처코드 빈 칸 안내 "미입력시 사업자번호로 등록.", Enter로 항목 이동(Tab은 다중 팝업에서 팝업간 이동이라 안 쓴다), insertRow() = 새 행(구분 "0" 일반, 사용 true)
 * update() L200-221: sys.Sys15_Corp.update → 성공 "저장이 완료되었습니다." + callback(목록 다시 조회) + hide(), 실패는 서버 문구
 * EditModal 규격(03 원칙 16, 11 §4a): 머리말·푸터 선, 라벨 오른쪽 정렬
 */
import React, { useRef, useState } from 'react';
import { Input, Modal, message } from 'antd';
import type { InputRef } from 'antd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

const LABEL_WIDTH = 110;  // form.setLabelWidth(110) L178

interface Props {
  open: boolean;
  /** callback.execute() L213: 저장이 끝난 뒤 (거래처 조회창이 다시 조회한다) */
  onSaved: () => void;
  /** 닫기: hide()만 */
  onClose: () => void;
}

/** 라벨 한 줄 — requiredBlue는 필수 항목(거래처구분·거래처명)의 파란 라벨 "0069B4" */
const Row: React.FC<{ label: string; blue?: boolean; children: React.ReactNode }> = ({ label, blue, children }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div style={{ width: LABEL_WIDTH, textAlign: 'right', paddingRight: 10, flex: 'none', color: blue ? '#0069B4' : undefined }}>{label}</div>
    {children}
  </div>
);

export const Sys15_Lookup_AddCorp: React.FC<Props> = ({ open, onSaved, onClose }) => {
  const corpNameRef = useRef<InputRef>(null);
  const bizNoRef = useRef<InputRef>(null);
  const corpCodeRef = useRef<InputRef>(null);
  const telRef = useRef<InputRef>(null);
  const addrRef = useRef<InputRef>(null);
  const noteRef = useRef<InputRef>(null);

  // insertRow() L183-198: 새 행 — 구분 "0"(일반), 사용 true
  const [corpType, setCorpType] = useState('0');
  const [corpName, setCorpName] = useState('');
  const [bizNo, setBizNo] = useState('');
  const [corpCode, setCorpCode] = useState('');
  const [tel, setTel] = useState('');
  const [addr, setAddr] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  // [E0] 화면 열림 (open L65-82) → setting() → insertRow() + 거래처명에 포커스(setFocusWidget)
  const afterOpenChange = (opened: boolean) => {
    if (!opened) return;
    setCorpType('0');
    setCorpName('');
    setBizNo('');
    setCorpCode('');
    setTel('');
    setAddr('');
    setNote('');
    corpNameRef.current?.focus();
  };

  // [E7] updateButton[저장].Select (L145) → update() L200-221: sys.Sys15_Corp.update(새 행 1건)
  const update = async () => {
    setSaving(true);
    try {
      await sysApi.updateCorps([{
        corpId: 0, companyId: null, corpType, corpTypeName: null, corpName, bizNo, corpCode,
        seq: null, useYn: 'true', note, tel, addr, issCorpCode: null, corpAccountCnt: null,
      }]);
      message.success('저장이 완료되었습니다.');
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  /** Enter 키로 다음 칸 이동 (L96-143) */
  const moveOnEnter = (next: React.RefObject<InputRef | null>) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') next.current?.focus();
  };

  return (
    <Modal open={open} title="거래처추가" width={420} maskClosable={false} onCancel={onClose} destroyOnHidden afterOpenChange={afterOpenChange}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 8 }}>
          <Button type="save" loading={saving} onClick={update}>저장</Button>
          {/* [E8] closeButton[닫기].Select (L151) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ padding: '12px 2px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Row label="거래처구분" blue>
          <SystemCodeComboBox kindCd="CorpType" style={{ width: 200 }} value={corpType} onChange={code => setCorpType(code ?? '0')} />
        </Row>
        <Row label="거래처명" blue>
          {/* [E1] corpName[거래처명].KeyPress [Enter] (L96) → bizNo.focus() */}
          <Input ref={corpNameRef} style={{ width: 200 }} value={corpName} onChange={e => setCorpName(e.target.value)} onKeyDown={moveOnEnter(bizNoRef)} />
        </Row>
        <Row label="사업자번호">
          {/* [E2] bizNo[사업자번호].KeyPress [Enter] (L104) → corpCode.focus() */}
          <Input ref={bizNoRef} style={{ width: 200 }} value={bizNo} onChange={e => setBizNo(e.target.value)} onKeyDown={moveOnEnter(corpCodeRef)} />
        </Row>
        <Row label="거래처코드">
          {/* [E3] corpCode[거래처코드].KeyPress [Enter] (L112) → tel.focus() */}
          <Input ref={corpCodeRef} style={{ width: 200 }} placeholder="미입력시 사업자번호로 등록." value={corpCode} onChange={e => setCorpCode(e.target.value)} onKeyDown={moveOnEnter(telRef)} />
        </Row>
        <Row label="전화번호">
          {/* [E4] tel[전화번호].KeyPress [Enter] (L120) → addr.focus() */}
          <Input ref={telRef} style={{ width: 200 }} value={tel} onChange={e => setTel(e.target.value)} onKeyDown={moveOnEnter(addrRef)} />
        </Row>
        <Row label="주소">
          {/* [E5] addr[주소].KeyPress [Enter] (L128) → note.focus() */}
          <Input ref={addrRef} style={{ width: 250 }} value={addr} onChange={e => setAddr(e.target.value)} onKeyDown={moveOnEnter(noteRef)} />
        </Row>
        <Row label="비고">
          {/* [E6] note[비고].KeyPress [Enter] (L136) → corpName.focus() */}
          <Input ref={noteRef} style={{ width: 250 }} value={note} onChange={e => setNote(e.target.value)} onKeyDown={moveOnEnter(corpNameRef)} />
        </Row>
        {/* L172 안내 글 */}
        <div style={{ color: '#DD5E5E', fontSize: 13, fontWeight: 'bold', paddingLeft: 25, marginTop: 10 }}>
          ※ 키보드로 항목간의 이동시 Enter키를 사용하세요.<br />&nbsp;&nbsp;&nbsp;(다중 팝업창에선 Tab키는 팝업간의 이동으로 사용됨)
        </div>
      </div>
    </Modal>
  );
};
