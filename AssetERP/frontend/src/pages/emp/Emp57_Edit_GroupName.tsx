/**
 * 그룹 등록·수정 창 — Emp57_Lookup_Insert의 [등록]·수정 아이콘이 연다 (G11)
 * AS-IS: myApp/client/vi/emp/Emp57_Edit_GroupName.java (169줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 insert() L46-72 / edit() L74-93 / getEditor() L110-119: 모달 450×200 "신규등록"/"수정"(닫기 X 없음), 그룹명 [글자 칸] · 전체공개 [체크], 아래 가운데 [저장][닫기]
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, Input, Modal, message } from 'antd';
import { empAddrBookApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { EmpAddrBookGroup } from '@/types/emp';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useLoginUser } from '@/hooks/useLoginUser';

interface Props {
  open: boolean;
  /** edit(model, callback) L74 — 고칠 그룹. null이면 insert(callback) L46 새 그룹 */
  group: EmpAddrBookGroup | null;
  /** callback.execute() — 저장에 성공하면 부른다 (그룹 목록 다시 조회) */
  onSaved: () => void;
  onClose: () => void;
}

export const Emp57_Edit_GroupName: React.FC<Props> = ({ open, group, onSaved, onClose }) => {
  const user = useLoginUser();
  const [groupName, setGroupName] = useState('');
  const [publicYn, setPublicYn] = useState(false);

  // insert() L58-65: 새 그룹은 전체공개 false / edit() L88: 고칠 그룹의 값
  useEffect(() => {
    if (!open) return;
    setGroupName(group?.groupName ?? '');
    setPublicYn(group?.publicYn === 'true');
  }, [open, group]);

  // [E3] msgBox.DialogHide [YES] (L127) / updateChk() L121-146 → update() L148-160: 서비스 emp.Emp57_AddrBookGroup.modelUpdate
  const update = async () => {
    try {
      if (group) await empAddrBookApi.updateGroup(group.addrBookGroupId, groupName, String(publicYn));
      else await empAddrBookApi.createGroup(groupName, String(publicYn));
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E1] updateButton[저장].Select (L96) → updateChk() L121-146: 등록자가 내가 아니면 확인 후 저장
  const updateChk = () => {
    if (group && group.personId !== user.userId) {
      Modal.confirm({
        title: '확인',
        content: '본인이 등록하지 않은 공용주소록입니다. 수정하시겠습니까?',
        okText: '예',
        cancelText: '아니오',
        width: 470,
        onOk: update,
      });
      return;
    }
    return update();
  };

  return (
    <LookupModal
      open={open}
      title={group ? '수정' : '신규등록'}
      width={450}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Button type="save" onClick={updateChk}>저장</Button>
          {/* [E2] closeButton[닫기].Select (L102) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ padding: '15px 15px 5px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: 80 }}>그룹명</span>
          <Input style={{ width: 320 }} value={groupName} onChange={e => setGroupName(e.target.value)} onPressEnter={updateChk} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: 80 }}>전체공개</span>
          <Checkbox checked={publicYn} onChange={e => setPublicYn(e.target.checked)} />
        </div>
      </div>
    </LookupModal>
  );
};
