/**
 * 준감인 사전확인대장 그리드 열 — Ics40_Tab_DcrPreConfirm(M05) buildGrid() L223-274 · Ics40_Tab_DcrReviewConfirm(M06) buildGrid() L142-192 (같은 열, 아이콘 동작만 다르다)
 * 회사 설정 dcrPreconfirmSkipYn이 true면 승인자·승인일·승인여부 3열이 없다(그만큼 "광고물 추가정보" 묶음이 앞으로 당겨진다).
 */
import { gbFor, iconCell } from '@/components/grid';
import { IcsDcrPreconfirm } from '@/types/ics';

const gb = gbFor<IcsDcrPreconfirm>();

export const ics40Columns = (opts: {
  skipYn: boolean;
  /** 문서확인 아이콘(View) → viewAppr() */
  onViewAppr: (row: IcsDcrPreconfirm) => void;
  /** 의견 아이콘: M05는 'edit'(editConfirmMsg), M06은 'view'(show) */
  msgIcon: 'edit' | 'view';
  onMsg: (row: IcsDcrPreconfirm) => void;
}) => [
  // 신청일~제공처는 가로 스크롤해도 고정(사용자 요청 2026-10-23, AS-IS에는 없음)
  gb.date('regDate', 90, '신청일', { pinned: 'left' }),  // addDate 90
  gb.text('dcrTypeName', 100, '대장분류', { pinned: 'left' }),
  gb.textCenter('apprNoPrefix', 120, '심사필번호', { pinned: 'left' }),
  gb.text('provideCo', 120, '제공처', { pinned: 'left' }),
  gb.textArea('content', 360, '내용'),
  gb.text('personName', 180, '신청자'),
  iconCell<IcsDcrPreconfirm>('view', 'actionCellView', 70, '문서확인', opts.onViewAppr),  // actionCell(View)
  ...(opts.skipYn ? [] : [
    gb.textCenter('confirmerName', 100, '승인자'),
    gb.date('confirmDate', 90, '승인일'),
    gb.textStatus('statusName', 100, '승인여부'),
  ]),
  // HeaderGroupMap(0, 12 또는 9, "광고물 추가정보", 1, 10) — 의견 열부터 10열
  gb.group('광고물 추가정보', [
    gb.textCenter('msgYnStr', 80, '의견'),
    iconCell<IcsDcrPreconfirm>(opts.msgIcon, 'actionCellMsg', 27, ' ', opts.onMsg),  // actionCell(Edit/View) → Ics40_Edit_Msg
    gb.text('adTypeName', 100, '광고종류'),
    gb.text('mediaTypeName', 100, '매체종류'),
    gb.text('adItemName', 100, '광고상품명'),
    gb.text('adContent', 100, '광고내용'),
    gb.date('startDate', 100, '최초<br>사용예정일'),
    gb.date('closeDate', 100, '최종<br>사용예정일'),
    gb.text('spec', 100, '규격'),
    gb.text('qtyCnt', 100, '수량/회수'),
  ]),
  gb.textCenter('preApprNo', 100, '과거<br>심사필번호 '),
];
