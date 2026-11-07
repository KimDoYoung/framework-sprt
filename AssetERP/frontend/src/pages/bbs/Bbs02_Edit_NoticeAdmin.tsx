/**
 * KFS공지 편집 창 (Z04) — Bbs02_Tab_NoticeAdmin의 [등록]·"상세보기" 아이콘에서 연다
 * AS-IS: myApp/client/vi/bbs/Bbs02_Edit_NoticeAdmin.java (750줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L178-395: 모달 "공지사항 [기록]" 1400×800, 라벨 100. 왼쪽 830 = 제목 / 내용(HTML 편집기),
 *   오른쪽 510 = 상태·작성자 / 공지일·종료일 / 메모(100) / 공지구분·구분상세 / 전체공지(+안내) / 전체고객사 / 개별 고객별(툴바 [등록][삭제][전체삭제] + 고객사명 400 그리드),
 *   아래 가운데 [저장][삭제][닫기][첨부파일 등록(n)][예약알람설정(n)][미리보기]. 머리글을 누르면 기록 창(Bbs09_Lookup_History)
 * 내용 편집기는 CKEditor(iframe) → HtmlEditor(Tiptap, 사용자 결정 2026-10-13)
 * 연결: Sys01_Lookup_SelectMulti([등록]) · Bbs09_Lookup_History · Bbs02_Lookup_File.open(관리자용 = Bbs15_Lookup_File과 같은 창) · Sch06_Lookup_AlarmSetup · Bbs02_Popup_NoticeAdmin(미리보기)
 * 스타일: MH (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, Input, Modal, Select, Space, Typography, message } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { bbsNoticeAdminApi } from '@/api/bbs';
import { fileApi } from '@/api/file';
import { schApi } from '@/api/sch';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { BbsNoticeAdmin, BbsTargetCompany } from '@/types/bbs';
import { Company, Code } from '@/types/sys';
import { Button } from '@/components/button';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { MultiGrid, gbFor } from '@/components/grid';
import { Sch06_Lookup_AlarmSetup } from '@/components/lookup/Sch06_Lookup_AlarmSetup';
import { Sys01_Lookup_SelectMulti } from '../sys/Sys01_Lookup_SelectMulti';
import { Bbs02_Popup_NoticeAdmin } from './Bbs02_Popup_NoticeAdmin';
import { Bbs09_Lookup_History } from './Bbs09_Lookup_History';
import { Bbs15_Lookup_File } from './Bbs15_Lookup_File';

const gb = gbFor<BbsTargetCompany>();
const DATE = 'YYYY-MM-DD';

/** 열 때 받는 값: isNew면 DB에 아직 없는 새 공지(noticeId는 미리 받은 새 ID) */
export type BbsNoticeAdminEdit = BbsNoticeAdmin & { isNew?: boolean };

interface Props {
  /** 편집할 공지 — null이면 닫힘 */
  model: BbsNoticeAdminEdit | null;
  onClose: () => void;
  /** 저장 뒤 저장된 한 줄 (AS-IS는 그리드를 안 고쳤지만 여기서는 목록의 그 줄을 바꾼다) */
  onSaved: (saved: BbsNoticeAdmin) => void;
  /** 삭제 뒤 (AS-IS GridDeleteData → grid.getStore().remove) */
  onDeleted: (noticeId: number) => void;
}

/** 라벨 폭 100 (form.setLabelWidth(100)) — 11 §4a: 라벨 오른쪽 정렬 */
const Field: React.FC<{ label: string; width?: number | string; required?: boolean; children: React.ReactNode }> = ({ label, width = '100%', required, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', width }}>
    <Typography.Text style={{ width: 100, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10, color: required ? '#0069B4' : undefined }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

/** GXT TextField 빈 값 = null */
const n = (s: string | null | undefined) => (s == null || s === '' ? null : s);

export const Bbs02_Edit_NoticeAdmin: React.FC<Props> = ({ model, onClose, onSaved, onDeleted }) => {
  const gridRef = useRef<AgGridReact<BbsTargetCompany>>(null);
  const [f, setF] = useState<BbsNoticeAdminEdit | null>(model);
  const [saving, setSaving] = useState(false);
  const [targets, setTargets] = useState<BbsTargetCompany[]>([]);   // targetCompanyId < 0 = 이번에 더한(아직 저장 전) 고객사
  const [detailCodes, setDetailCodes] = useState<Code[]>([]);
  const [fileCount, setFileCount] = useState(0);
  const [alarmCount, setAlarmCount] = useState(0);
  const [fileOpen, setFileOpen] = useState(false);
  const [alarmOpen, setAlarmOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [preview, setPreview] = useState<{ title: string | null; notice: string } | null>(null);
  /** latestOpenYn·latestNotice L139-140: 창을 열 때 읽은 상태·본문 — 저장 뒤에도 바꾸지 않는다(AS-IS 그대로) */
  const latest = useRef<{ openYn: string | null; notice: string | null }>({ openYn: null, notice: null });
  const tempId = useRef(-1);
  useEffect(() => setF(model), [model]);

  const noticeId = f?.noticeId;

  // setFileButtonText() L530-541: 서비스 sys.Sys10_File.selectByParentId → "첨부파일 등록(n)"
  const setFileButtonText = useCallback(async () => {
    if (noticeId == null) return;
    try { setFileCount((await fileApi.searchByParentId(noticeId)).length); } catch { setFileCount(0); }
  }, [noticeId]);
  // setAlarmButton() L543-554: 서비스 sch.Sch06_Alarm.selectByTargetId → "예약알람설정(n)"
  const setAlarmButton = useCallback(async () => {
    if (noticeId == null) return;
    try { setAlarmCount((await schApi.searchAlarms(noticeId)).length); } catch { setAlarmCount(0); }
  }, [noticeId]);

  // retrieveGrid() L556-560: 서비스 bbs.Bbs04_TargetCompany.selectByNoticeId(noticeId)
  const retrieveGrid = useCallback(async (id: number) => {
    try {
      setTargets(await bbsNoticeAdminApi.searchTargetCompanies(id));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // 구분 코드 → 구분상세 목록 (selectByKindCode: code = 구분 + "%")
  const allDetailRef = useRef<Code[]>([]);
  const loadDetails = useCallback((type: string | null) => {
    setDetailCodes(type ? allDetailRef.current.filter(c => c.code.startsWith(type)) : []);
  }, []);

  // [E0] 열림 — newNotice() L454-483 / editNotice() L485-528
  useEffect(() => {
    if (!model) return;
    latest.current = { openYn: model.isNew ? null : model.openYn, notice: model.isNew ? null : model.notice };
    setTargets([]);
    setFileCount(0);
    setAlarmCount(0);
    sysApi.searchCodes('NoticeDetailCode')
      .then(list => { allDetailRef.current = list; loadDetails(model.noticeType); })
      .catch(err => message.error(errorMessage(err, '공지구분 조회 실패')));
    if (!model.isNew) {
      void retrieveGrid(model.noticeId);
      void setFileButtonText();
      void setAlarmButton();
    }
  }, [model]);   // eslint-disable-line react-hooks/exhaustive-deps

  /** HtmlEditor는 만들 때 한 번만 값을 받는다 — 창을 열 때마다 새로 만든다 */
  const columnDefs = useMemo(() => [
    gb.text('companyName', 400, '고객사명'),  // L410 (SQL 계산 열: sys01_company_nm)
  ], []);

  if (!f) return null;
  const set = <K extends keyof BbsNoticeAdminEdit>(k: K, v: BbsNoticeAdminEdit[K]) => setF(prev => prev && { ...prev, [k]: v });

  // [E9] noticeTypeName[공지구분].ValueChange (L272) → refreshCode() L159-176: 구분상세 목록을 다시 읽고 첫 항목을 고른다
  const onTypeChange = (code: string | undefined, name?: string) => {
    const list = code ? allDetailRef.current.filter(c => c.code.startsWith(code)) : [];
    setDetailCodes(list);
    setF(prev => prev && { ...prev, noticeType: code ?? null, noticeTypeName: name ?? null,
      noticeDetailCode: list.length > 0 ? list[0].code : prev.noticeDetailCode, noticeDetailName: list.length > 0 ? list[0].name : prev.noticeDetailName });
  };

  // [E10] insertButton[등록].Select (L288): 검사 뒤 insertRow() L414-442 — 고객사 다중 선택 → 대상 그리드 맨 아래에 행 추가
  const insertTarget = () => {
    if (!f.fromDate) return void message.warning('공지일은 필수입력 항목입니다');
    if (!f.noticeType) return void message.warning('공지구분은 필수선택 항목입니다');
    setCompanyOpen(true);
  };
  const onCompanies = (list: Company[]) => {
    setTargets(prev => [...prev, ...list.map(c => ({ targetCompanyId: tempId.current--, noticeId: f.noticeId, companyId: c.companyId, companyName: c.companyNm }))]);
    setTimeout(() => {
      const api = gridRef.current?.api;
      if (api && api.getDisplayedRowCount() > 0) api.ensureIndexVisible(api.getDisplayedRowCount() - 1);
    }, 0);
  };

  // [E11] deleteTargetButton[삭제].Select (L302) → deleteTargetModel() L562-566: 저장된 고객사는 bbs.Bbs04_TargetCompany.delete, 이번에 더한 것은 그리드에서만 뺀다
  const deleteTargetModel = async () => {
    const checked = gridRef.current?.api.getSelectedRows() ?? [];
    if (checked.length === 0) return void message.warning('삭제할 행을 선택하세요.');
    try {
      const saved = checked.filter(r => r.targetCompanyId > 0).map(r => r.targetCompanyId);
      if (saved.length > 0) await bbsNoticeAdminApi.deleteTargetCompanies(f.noticeId, saved);
      const gone = new Set(checked.map(r => r.targetCompanyId));
      setTargets(prev => prev.filter(r => !gone.has(r.targetCompanyId)));
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // deleteAllTarget() L568-579: bbs.Bbs04_TargetCompany.deleteAllTarget → retrieveGrid()
  const deleteAllTarget = async () => {
    try {
      await bbsNoticeAdminApi.deleteAllTargetCompanies(f.noticeId);
      await retrieveGrid(f.noticeId);
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // [E12]·[E13] deleteAllButton[전체삭제].Select (L308) → "전체 삭제하시겠습니까?"(제목 "삭제", 폭 350) → [YES] deleteAllTarget()
  const confirmDeleteAll = () => Modal.confirm({ title: '삭제', content: '전체 삭제하시겠습니까?', okText: '예', cancelText: '아니오', width: 350, onOk: deleteAllTarget });

  // [E2] updateButton[저장].Select (L199) → update() L617-656: 검사 → (상태·본문이 열 때와 다르면 기록) → 저장 → 대상 고객사 저장 → "저장이 완료되었습니다."(창은 그대로)
  const update = async () => {
    if (n(f.title) == null) return void message.warning('제목은 필수입력 항목입니다');
    if (f.fromDate == null) return void message.warning('공지일은 필수입력 항목입니다');
    if (f.toDate == null) return void message.warning('종료일은 필수입력 항목입니다');
    if (f.noticeType == null) return void message.warning('공지구분은 필수선택 항목입니다');
    setSaving(true);
    try {
      const saved = await bbsNoticeAdminApi.saveNotice({
        noticeId: f.noticeId, title: f.title!, notice: f.notice ?? '', fromDate: f.fromDate, toDate: f.toDate, openYn: n(f.openYn), note: n(f.note),
        noticeType: f.noticeType, noticeDetailCode: n(f.noticeDetailCode), publicYn: f.publicYn, publicCompanyYn: f.publicCompanyYn,
        latestOpenYn: latest.current.openYn, latestNotice: latest.current.notice,
        newTargetCompanyIds: targets.filter(t => t.targetCompanyId < 0).map(t => t.companyId),
      });
      message.success('저장이 완료되었습니다.');
      onSaved(saved);
      setF(prev => prev && { ...prev, noticeNo: saved.noticeNo, isNew: false });
      await retrieveGrid(f.noticeId);   // 새 고객사의 저장된 ID를 받는다
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // [E3] deleteButton[삭제].Select (L205) → delete() L581-615: "해당 공지사항을 삭제하시겠습니까?"(제목 "확인", 폭 400) → [YES] bbs.Bbs02_Notice.delete → [E14] deleteAllTarget(), hide()
  const remove = () => Modal.confirm({
    title: '확인',
    content: '해당 공지사항을 삭제하시겠습니까?',
    okText: '예',
    cancelText: '아니오',
    width: 400,
    onOk: async () => {
      try {
        await bbsNoticeAdminApi.deleteNotice(f.noticeId);
        await bbsNoticeAdminApi.deleteAllTargetCompanies(f.noticeId);
        onDeleted(f.noticeId);
        onClose();
      } catch (err) {
        message.error(errorMessage(err, '삭제 실패'));
      }
    },
  });

  const allCompany = f.publicCompanyYn;   // setPublicCompanyYn() L444-452: 전체고객사면 개별 고객별 영역을 끈다

  return (
    <Modal
      open
      title={
        // [E1] header.Dom (L189) → Bbs09_Lookup_History.open(noticeId)
        <span style={{ cursor: 'pointer' }} onClick={() => setHistoryOpen(true)}>
          공지사항 <span style={{ color: '#4472C4', fontSize: 12, marginLeft: 8 }}>[ 기록 ]</span>
        </span>
      }
      width={1400}
      maskClosable={false}
      onCancel={onClose}
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 }, footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 } }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            <Button type="delete" onClick={remove}>삭제</Button>
            {/* [E4] closeButton[닫기].Select (L211) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
            {/* [E5] addFileButton[첨부파일 등록(n)].Select (L217) → Bbs02_Lookup_File.open(noticeId, callback → setFileButtonText()) */}
            <Button type="upload" onClick={() => setFileOpen(true)}>{`첨부파일 등록(${fileCount})`}</Button>
            {/* [E7] alarmButton[예약알람설정(n)].Select (L236) → Sch06_Lookup_AlarmSetup.open("BBS", noticeId, callback → setAlarmButton()) */}
            <Button type="view" onClick={() => setAlarmOpen(true)}>{`예약알람설정(${alarmCount})`}</Button>
            {/* [E8] previewButton[미리보기].Select (L248) → Bbs02_Popup_NoticeAdmin.open(title, 편집기 내용) */}
            <Button type="view" onClick={() => setPreview({ title: f.title, notice: f.notice ?? '' })}>미리보기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', gap: 20, height: 600, padding: '12px 2px', boxSizing: 'border-box' }}>
        {/* 왼쪽 830 */}
        <div style={{ width: 830, flex: 'none', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
          <Field label="제목 " required><Input value={f.title ?? ''} onChange={e => set('title', e.target.value)} /></Field>
          <Field label="내용 ">
            <HtmlEditor key={`${f.noticeId}-${f.isNew ? 'n' : 'e'}-${model?.noticeId}`} value={f.notice} onChange={html => set('notice', html)} height={490} />
          </Field>
        </div>
        {/* 오른쪽 510 */}
        <div style={{ width: 510, flex: 'none', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
          <div style={{ display: 'flex' }}>
            <Field label="상태 " width={255} required>
              <Select style={{ width: '100%' }} value={f.openYn ?? undefined} onChange={v => set('openYn', v)} options={[{ value: '알림', label: '알림' }, { value: '대기', label: '대기' }]} />
            </Field>
            <Field label="작성자 " width={255} required><Input value={f.userName ?? ''} onChange={e => set('userName', e.target.value)} /></Field>
          </div>
          <div style={{ display: 'flex' }}>
            <Field label="공지일 " width={255} required>
              <DatePicker style={{ width: '100%' }} value={f.fromDate ? dayjs(f.fromDate) : null} onChange={d => set('fromDate', d ? d.format(DATE) : null)} />
            </Field>
            <Field label="종료일 " width={255} required>
              <DatePicker style={{ width: '100%' }} value={f.toDate ? dayjs(f.toDate) : null} onChange={d => set('toDate', d ? d.format(DATE) : null)} />
            </Field>
          </div>
          <Field label="메모 "><Input.TextArea rows={3} value={f.note ?? ''} onChange={e => set('note', e.target.value)} /></Field>
          <div style={{ display: 'flex' }}>
            <Field label="공지구분 " width={255} required>
              <SystemCodeComboBox kindGroupCd="NoticeType002" placeholder="선택하세요" style={{ width: '100%' }} value={f.noticeType ?? undefined} onChange={onTypeChange} />
            </Field>
            <Field label="구분상세 " width={255}>
              <Select
                style={{ width: '100%' }}
                placeholder="선택하세요"
                value={f.noticeDetailCode ?? undefined}
                onChange={v => setF(prev => prev && { ...prev, noticeDetailCode: v })}
                options={detailCodes.map(c => ({ value: c.code, label: c.name }))}
              />
            </Field>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Field label="전체공지 " width={130} required><Checkbox checked={f.publicYn} onChange={e => set('publicYn', e.target.checked)} /></Field>
            <span style={{ fontSize: 12, color: '#666' }}>(미체크시 업무 담당자 전용화면에만 조회됩니다.)</span>
          </div>
          {/* [E6] publicCompanyYn[전체고객사].ValueChange (L230) → setPublicCompanyYn() */}
          <Field label="전체고객사 " required><Checkbox checked={f.publicCompanyYn} onChange={e => set('publicCompanyYn', e.target.checked)} /></Field>
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9', boxSizing: 'border-box', marginLeft: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 8px' }}>
              <span>개별 고객별</span>
              <Button type="register" disabled={allCompany} onClick={insertTarget}>등록</Button>
              <Button type="delete" disabled={allCompany} onClick={() => void deleteTargetModel()}>삭제</Button>
              <Button type="delete" disabled={allCompany} onClick={confirmDeleteAll}>전체삭제</Button>
            </div>
            <div style={{ flex: 1, minHeight: 0, pointerEvents: allCompany ? 'none' : undefined, opacity: allCompany ? 0.6 : 1 }}>
              <MultiGrid<BbsTargetCompany> gridRef={gridRef} rowData={targets} columnDefs={columnDefs} getRowId={p => String(p.data.targetCompanyId)} />
            </div>
          </div>
        </div>
      </div>
      <Sys01_Lookup_SelectMulti open={companyOpen} onResult={onCompanies} onClose={() => setCompanyOpen(false)} />
      <Bbs15_Lookup_File open={fileOpen} parentId={f.noticeId} onClose={() => { setFileOpen(false); void setFileButtonText(); }} />
      <Sch06_Lookup_AlarmSetup target={alarmOpen ? { targetCode: 'BBS', targetId: f.noticeId } : null} onClosed={() => void setAlarmButton()} onClose={() => setAlarmOpen(false)} />
      <Bbs09_Lookup_History noticeId={historyOpen ? f.noticeId : null} onClose={() => setHistoryOpen(false)} />
      <Bbs02_Popup_NoticeAdmin
        notice={preview ? { noticeId: f.noticeId, title: preview.title ?? '', notice: preview.notice, commentYn: false, preview: true } : null}
        onClose={() => setPreview(null)}
      />
    </Modal>
  );
};
