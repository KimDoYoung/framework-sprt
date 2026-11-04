/**
 * 알림 창 (EE53) — MainFrame 상단 알림(종) 아이콘이 연다. 미결재건·체크리스트·공지사항·알림함·매매승인 건수를 보여 주고 각 창으로 간다
 * AS-IS: myApp/client/vi/frm/Frm01_Lookup_CheckList.java (322줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L68-93: 머리말 "알림", 높이 180, 폭 690(메뉴 1128 사용자) / 550(그 밖은 [매매승인]을 못 누른다), 라벨(검정 굵게 18) 아래 건수(파랑 굵게 18, 10 미만은 "00건")
 * 연결: 체크리스트 → Frm01_Lookup_DailyCheckList(EE54) · 공지사항 → Frm01_Lookup_NoticeList(EE55) ·
 *       미결재건 → Frm01_Lookup_Outstanding(EE56) · 알림함 → Sms10_Lookup_AlarmList(EE57) · 매매승인 → 메뉴 1128 탭 열기
 */
import React, { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { frmApi } from '@/api/frm';
import { errorMessage } from '@/api/client';
import { FrmNoticeCnt } from '@/types/frm';
import { openMenuByNo } from '@/utils/tempData';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Frm01_Lookup_DailyCheckList } from './Frm01_Lookup_DailyCheckList';
import { Frm01_Lookup_NoticeList } from './Frm01_Lookup_NoticeList';
import { Frm01_Lookup_Outstanding } from './Frm01_Lookup_Outstanding';
import { Sms10_Lookup_AlarmList } from './Sms10_Lookup_AlarmList';

/** 건수 글자 (retrieve() L274-308): 10 이상은 "12건", 그 아래는 "05건" */
export const cntText = (n?: number | null) => `${(n ?? 0) > 9 ? n : `0${n ?? 0}`}건`;

interface Props {
  open: boolean;
  /** LoginUser.getMenuList().contains("1128") — 매매승인 메뉴를 쓸 수 있는가 */
  hasMenu1128: boolean;
  /** 건수를 다시 읽었을 때(상단 알림 아이콘 색을 맞추는 쪽이 쓴다) */
  onCount?: (cnt: FrmNoticeCnt) => void;
  onClose: () => void;
}

export const Frm01_Lookup_CheckList: React.FC<Props> = ({ open, hasMenu1128, onCount, onClose }) => {
  const [cnt, setCnt] = useState<FrmNoticeCnt | null>(null);
  const [dailyOpen, setDailyOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [outstandingOpen, setOutstandingOpen] = useState(false);
  const [alarmOpen, setAlarmOpen] = useState(false);

  // retrieve() L262-317 — frm.Frm01_List.getNoticeCnt
  const retrieve = useCallback(async () => {
    try {
      const c = await frmApi.getNoticeCnt();
      setCnt(c);
      onCount?.(c);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [onCount]);

  // [E0] 화면 열림 (생성자 L68-93, open L64-66) → settings(), getEditor(), show(), retrieve()
  useEffect(() => { if (open) void retrieve(); }, [open, retrieve]);

  const items: { label: string; value?: number; onClick?: () => void; disabled?: boolean }[] = [
    // [E1][E2] anchor01(_1).MouseDown (L110·L122) → Frm01_Lookup_Outstanding.open(callback → retrieve())
    { label: '미결재건', value: cnt?.cnt1, onClick: () => setOutstandingOpen(true) },
    // [E3][E4] anchor02(_1).MouseDown (L134·L146) → Frm01_Lookup_DailyCheckList.open(callback → retrieve())
    { label: '체크리스트', value: cnt?.cnt2, onClick: () => setDailyOpen(true) },
    // [E5][E6] anchor03(_1).MouseDown (L158·L172) → Frm01_Lookup_NoticeList.open(callback → retrieve())
    { label: '공지사항', value: cnt?.cnt3, onClick: () => setNoticeOpen(true) },
    // [E7][E8] anchor04(_1).MouseDown (L186·L193) → Sms10_Lookup_AlarmList.open()
    { label: '알림함', value: cnt?.cnt4, onClick: () => setAlarmOpen(true) },
    // [E9][E10] anchor05(_1).MouseDown (L200·L212) → MenuOpener.openTabCallback("1128") 뒤 hide(). 메뉴 1128이 없으면 감춰진다(L77-85)
    ...(hasMenu1128 ? [{
      label: '매매승인', value: cnt?.cnt5,
      onClick: () => { if (!openMenuByNo('1128')) { message.warning('열 수 없는 화면입니다.'); return; } onClose(); },
    }] : []),
  ];

  return (
    <>
      <LookupModal
        open={open}
        title="알림"
        width={hasMenu1128 ? 690 : 550}
        maskClosable={false}
        onCancel={onClose}
        footer={null}
      >
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '16px 0 8px', background: '#f5f5f5', borderRadius: 4 }}>
          {items.map(it => (
            <a key={it.label} onClick={it.onClick} style={{ textAlign: 'center', textDecoration: 'none', cursor: 'pointer', minWidth: 110 }}>
              <div style={{ color: '#000', fontWeight: 900, fontSize: 18 }}>{it.label}</div>
              <div style={{ color: '#457FD6', fontWeight: 900, fontSize: 18, marginTop: 8 }}>{cntText(it.value)}</div>
            </a>
          ))}
        </div>
      </LookupModal>
      <Frm01_Lookup_DailyCheckList open={dailyOpen} onChanged={() => void retrieve()} onClose={() => setDailyOpen(false)} />
      <Frm01_Lookup_Outstanding open={outstandingOpen} onChanged={() => void retrieve()} onClose={() => setOutstandingOpen(false)} />
      <Sms10_Lookup_AlarmList open={alarmOpen} onClose={() => setAlarmOpen(false)} />
      <Frm01_Lookup_NoticeList open={noticeOpen} onChanged={() => void retrieve()} onClose={() => setNoticeOpen(false)} />
    </>
  );
};
