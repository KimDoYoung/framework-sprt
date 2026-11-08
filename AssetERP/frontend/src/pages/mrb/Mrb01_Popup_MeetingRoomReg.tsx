/**
 * 회의실 예약정보 팝업 (EE14) — Mrb01_Tab_DayofMonth([예약하기]·상세보기)와 Mrb01_Tab_List(상세보기)가 연다
 * AS-IS: myApp/client/vi/mrb/Mrb01_Popup_MeetingRoomReg.java (433줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L91-152: 모달 880×610 "회의실 예약정보", 줄 = 일시(시작일 ~ 종료일 시:분 ~ 시:분) + 예약자(오른쪽) / 장소 + 참석자 / 제목 / 메모(높이 85) + 시간막대 300, 아래 가운데 [저장][변경][닫기][첨부파일(n)]
 * 열기 3가지: open(date) L247-277 [저장]만 / retrieve(model, checkYn) L292-302 [저장]은 checkYn일 때 / getList(model, checkYn) L304-314 [변경]은 checkYn일 때
 * userCheckYn: open은 true, retrieve·getList는 checkYn — false면 예약자 조회창과 첨부파일 올리기·삭제가 막힌다(E4·E5)
 * EditModal 규격(11 §4a). 저장은 이 창이 한다(update() L316-391)
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useRef, useState } from 'react';
import { DatePicker, Input, message, Modal, Space } from 'antd';
import dayjs from 'dayjs';
import { mrbApi } from '@/api/mrb';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { MrbBooking, MrbBookingTimeline } from '@/types/mrb';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { Bbs02_Lookup_File } from '@/pages/bbs/Bbs02_Lookup_File';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Mrb01_TimelineChart } from './Mrb01_TimelineChart';

const FORMAT = 'YYYY-MM-DD';

export type MrbBookingRegTarget =
  /** open(bookingDate, cb): 새 예약 (로그인 사원, 08:00 ~ 12:00) */
  | { mode: 'open'; date: string }
  /** retrieve(model, checkYn): 날짜별 그리드의 상세보기 — [저장]은 checkYn(관리자·예약자)일 때만 */
  | { mode: 'retrieve'; row: MrbBooking; checkYn: boolean }
  /** getList(model, checkYn): 예약현황 그리드의 상세보기 — [변경]은 checkYn일 때만 */
  | { mode: 'list'; row: MrbBooking; checkYn: boolean };

interface Props {
  target: MrbBookingRegTarget | null;
  /** callback.execute() — 저장이 끝나면(창을 닫기 전) */
  onSaved: () => void;
  onClose: () => void;
}

const Field: React.FC<{ label: string; children: React.ReactNode; top?: boolean }> = ({ label, children, top }) => (
  <div style={{ display: 'flex', alignItems: top ? 'flex-start' : 'center', gap: 0 }}>
    <label style={{ width: 80, flexShrink: 0, textAlign: 'right', paddingRight: 10, paddingTop: top ? 4 : 0 }}>{label}</label>
    <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 4 }}>{children}</div>
  </div>
);

export const Mrb01_Popup_MeetingRoomReg: React.FC<Props> = ({ target, onSaved, onClose }) => {
  const user = useLoginUser();
  const [draft, setDraft] = useState<MrbBooking>({});
  const [timeline, setTimeline] = useState<MrbBookingTimeline[]>([]);
  const [fileCount, setFileCount] = useState(0);
  const [filesOpen, setFilesOpen] = useState(false);
  const [personOpen, setPersonOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const timelineSeq = useRef(0);

  // userCheckYn: open은 true(필드 초기값), retrieve·getList는 checkYn
  const userCheckYn = target == null || target.mode === 'open' ? true : target.checkYn;

  // retrieveTimeChart() L216-232: 예약일 기준 mrb.Mrb01_Booking.selectByDateUnion → 차트를 다시 그린다
  const retrieveTimeChart = async (date: string | null | undefined) => {
    if (!date) return;
    const my = ++timelineSeq.current;
    try {
      const list = await mrbApi.searchBookingTimeline(date);
      if (my === timelineSeq.current) setTimeline(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // setFileButtonText() L234-245: sys.Sys10_File.selectByParentId(parentId) → "첨부파일(n)"
  const setFileButtonText = async (bookingId: number | null | undefined) => {
    if (bookingId == null) return;
    try {
      setFileCount((await fileApi.searchByParentId(bookingId)).length);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L91-152) → settings() — 열릴 때마다 모델을 새로 만든다. open()은 getSeq로 새 번호를 먼저 받는다
  useEffect(() => {
    if (!target) return;
    setTimeline([]);
    setFileCount(0);
    if (target.mode === 'open') {
      let alive = true;
      void (async () => {
        try {
          const bookingId = await mrbApi.nextBookingId();
          if (!alive) return;
          setDraft({
            bookingId, empId: user.userId, empNm: user.name, bookingDate: target.date, bookingCloseDate: target.date,
            startHour: '08', startMin: '00', closeHour: '12', closeMin: '00', parentId: 0,
          });
          void retrieveTimeChart(target.date);
          void setFileButtonText(bookingId);
        } catch (err) {
          message.error(errorMessage(err, '조회 실패'));
        }
      })();
      return () => { alive = false; };
    }
    setDraft({ ...target.row });
    void retrieveTimeChart(target.row.bookingDate);
    void setFileButtonText(target.row.bookingId);
  }, [target]);  // eslint-disable-line react-hooks/exhaustive-deps

  const set = (patch: Partial<MrbBooking>) => setDraft(prev => ({ ...prev, ...patch }));

  /** update() L316-391: 필수 검사 → mrb.Mrb01_Booking.update(종료일 = 시작일) / updateList(다르면) → 겹침이면 서버 메시지, 아니면 callback + hide() */
  const update = async (changeUpdate: boolean) => {
    if (!draft.startHour) { message.warning('시작시를 입력해주세요'); return; }
    if (!draft.startMin) { message.warning('시작분을 입력해주세요'); return; }
    if (!draft.closeHour) { message.warning('종료시를 입력해주세요'); return; }
    if (!draft.closeMin) { message.warning('종료분을 입력해주세요'); return; }
    if (!draft.subject) { message.warning('제목을 입력해주세요'); return; }
    if (!draft.roomCd) { message.warning('회의실을 선택해주세요'); return; }
    // 원본 그대로: 시가 같거나 시작시가 크면 분을 비교한다(L337-342)
    if (+draft.startHour >= +draft.closeHour && +draft.startMin >= +draft.closeMin) { message.warning('종료시간을 다시 설정해주세요.'); return; }
    if (draft.bookingCloseDate && draft.bookingDate && dayjs(draft.bookingCloseDate).isBefore(dayjs(draft.bookingDate))) { message.warning('예약종료일자를 다시 선택해주세요'); return; }
    setSaving(true);
    try {
      await mrbApi.saveBooking({ ...draft, bookingCloseDate: draft.bookingCloseDate ?? draft.bookingDate }, changeUpdate);
      onSaved();
      onClose();
    } catch (err) {
      message.warning(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // [E3] changeButton[변경].Select (L182) → changeCheck() L393-412: 확인창 → [E6] 예 → update()
  const changeCheck = () => {
    Modal.confirm({
      title: '확인',
      content: '이미 생성된 회의실 예약정보는 삭제됩니다. 진행하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 400,
      onOk: () => update(true),
    });
  };

  const saveVisible = target?.mode === 'open' || (target?.mode === 'retrieve' && target.checkYn);
  const changeVisible = target?.mode === 'list' && target.checkYn;

  return (
    <>
      <Modal
        open={target != null}
        title="회의실 예약정보"
        width={880}
        maskClosable={false}
        destroyOnHidden
        onCancel={onClose}
        styles={{
          header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
          footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
        }}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              {/* [E1] updateButton[저장].Select (L169) → changeUpdateYn=false, update() */}
              {saveVisible && <Button type="save" loading={saving} onClick={() => update(false)}>저장</Button>}
              {changeVisible && <Button type="change" onClick={changeCheck}>변경</Button>}
              {/* [E2] closeButton[닫기].Select (L176) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
              {/* [E5] addFileButton[첨부파일(n)].Select (L197) → Bbs02_Lookup_File.open(bookingId, cb → setFileButtonText()) / userCheckYn이 false면 openUser(bookingId) */}
              <Button type="view" onClick={() => setFilesOpen(true)}>{`첨부파일(${fileCount})`}</Button>
            </Space>
          </div>
        }
      >
        <div style={{ padding: '12px 2px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
            <Field label="일  시">
              {/* bookingDate 변경 시 시간막대는 다시 그리지 않는다(AS-IS는 열 때만 retrieveTimeChart) */}
              <DatePicker style={{ width: 120 }} format={FORMAT} allowClear={false} value={draft.bookingDate ? dayjs(draft.bookingDate) : null}
                onChange={(_, s) => set({ bookingDate: (s as string) || null })} />
              <span> ~ </span>
              <DatePicker style={{ width: 120 }} format={FORMAT} allowClear={false} value={draft.bookingCloseDate ? dayjs(draft.bookingCloseDate) : null}
                onChange={(_, s) => set({ bookingCloseDate: (s as string) || null })} />
              <span style={{ width: 6 }} />
              <SystemCodeComboBox kindCd="HourCode" style={{ width: 62 }} value={draft.startHour ?? undefined} onChange={c => set({ startHour: c ?? null })} />
              <SystemCodeComboBox kindCd="MinuteCode" style={{ width: 62 }} value={draft.startMin ?? undefined} onChange={c => set({ startMin: c ?? null })} />
              <span> ~ </span>
              <SystemCodeComboBox kindCd="HourCode" style={{ width: 62 }} value={draft.closeHour ?? undefined} onChange={c => set({ closeHour: c ?? null })} />
              <SystemCodeComboBox kindCd="MinuteCode" style={{ width: 62 }} value={draft.closeMin ?? undefined} onChange={c => set({ closeMin: c ?? null })} />
            </Field>
            {/* [E4] empName[예약자].TriggerClick [userCheckYn == true] (L189) → openLookupPerson() L414-424: Emp00_Lookup_SelectSingle.open(오늘, true, cb) → empId·empName */}
            <Field label="예약자">
              <LookupInput width={100} value={draft.empNm ?? ''} onOpen={() => { if (userCheckYn) setPersonOpen(true); }} />
            </Field>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Field label="장  소">
              <SystemCodeComboBox kindCd="MeetingRoomCode" style={{ width: 140 }} value={draft.roomCd ?? undefined}
                onChange={(c, n) => set({ roomCd: c ?? null, roomNm: n ?? null })} />
            </Field>
            <Field label="참석자"><Input maxLength={100} value={draft.attendance ?? ''} onChange={e => set({ attendance: e.target.value })} /></Field>
          </div>
          <Field label="제  목"><Input maxLength={100} value={draft.subject ?? ''} onChange={e => set({ subject: e.target.value })} /></Field>
          <Field label="메 모" top>
            <Input.TextArea style={{ height: 85, resize: 'none' }} maxLength={400} value={draft.forwarding ?? ''} onChange={e => set({ forwarding: e.target.value })} />
          </Field>
          <div style={{ height: 300, margin: '10px 20px 0 20px' }}>
            <Mrb01_TimelineChart rows={timeline} />
          </div>
        </div>
      </Modal>
      <Bbs02_Lookup_File
        open={filesOpen}
        parentId={draft.bookingId}
        admin={userCheckYn}
        onClose={() => { setFilesOpen(false); void setFileButtonText(draft.bookingId); }}
      />
      <Emp00_Lookup_SelectSingle
        open={personOpen}
        noneLabel={null}
        separateAddTitle
        transDate={dayjs().format(FORMAT)}
        onResult={r => {
          setPersonOpen(false);
          if (r) set({ empId: r.personId, empNm: r.korNm ?? null });
        }}
        onClose={() => setPersonOpen(false)}
      />
    </>
  );
};
