/**
 * 공지사항 편집 창 (Z02) — Bbs02_Tab_NoticeManager의 [등록]·수정 칸에서 연다
 * AS-IS: myApp/client/vi/bbs/Bbs02_Edit_Notice.java (742줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L126-389: 모달 "공지사항" 1350×800, 라벨 80. 왼쪽 830 = 제목(+[불러오기] 130) / 내용(HTML 편집기),
 *   오른쪽 490 = 상태·작성자 / 공지일·종료일 / 상단고정·종료일 / 메모(100) / 공지구분·공지상세 / 댓글허용 / 개별 대상자(툴바 [등록][삭제][전체삭제][그룹] + 대상자 그리드 조직 140 · 직책 100 · 사번 80 · 성명 80),
 *   아래 가운데 [저장][삭제][닫기][첨부파일 등록(n)][예약알람설정(n)][미리보기]
 * 내용 편집기는 CKEditor(iframe) → HtmlEditor(Tiptap, 사용자 결정 2026-10-13)
 * 연결: Emp01_Lookup_PersonModel(대상자 [등록]) · Emp57_Lookup_List(대상자 [그룹]) · Bbs02_Lookup_LoadBbs · Bbs02_Lookup_File.open(관리자용 = Bbs15_Lookup_File과 같은 창) · Sch06_Lookup_AlarmSetup · Bbs02_Popup_NoticeAdmin(미리보기)
 * 스타일: MH (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, Input, Modal, Select, Space, Typography, message } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { bbsNoticeApi } from '@/api/bbs';
import { fileApi } from '@/api/file';
import { schApi } from '@/api/sch';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { BbsNoticeMng, BbsTarget } from '@/types/bbs';
import { EmpAddrBookSelect, TransPerson } from '@/types/emp';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { MultiGrid, gbFor } from '@/components/grid';
import { Emp01_Lookup_PersonModel } from '@/components/lookup/Emp01_Lookup_PersonModel';
import { Sch06_Lookup_AlarmSetup } from '@/components/lookup/Sch06_Lookup_AlarmSetup';
import { Emp57_Lookup_List } from '../emp/Emp57_Lookup_List';
import { Bbs02_Lookup_LoadBbs } from './Bbs02_Lookup_LoadBbs';
import { Bbs02_Popup_NoticeAdmin } from './Bbs02_Popup_NoticeAdmin';
import { Bbs15_Lookup_File } from './Bbs15_Lookup_File';

const gb = gbFor<BbsTarget>();
const DATE = 'YYYY-MM-DD';

/** 열 때 받는 값: isNew면 DB에 아직 없는 새 공지(noticeId는 미리 받은 새 ID) */
export type BbsNoticeEdit = BbsNoticeMng & { isNew?: boolean };

interface Props {
  /** 편집할 공지 — null이면 닫힘 */
  model: BbsNoticeEdit | null;
  onClose: () => void;
  /** 저장 뒤 저장된 한 줄 (AS-IS GridUpdate → grid.getStore().update) */
  onSaved: (saved: BbsNoticeMng) => void;
  /** 삭제 뒤 (AS-IS GridDeleteData → grid.getStore().remove) */
  onDeleted: (noticeId: number) => void;
}

/** 라벨 폭 80 (form.setLabelWidth(80)) — 11 §4a: 라벨 오른쪽 정렬 */
const Field: React.FC<{ label: string; width?: number | string; required?: boolean; children: React.ReactNode }> = ({ label, width = '100%', required, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', width }}>
    <Typography.Text style={{ width: 80, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10, color: required ? '#0069B4' : undefined }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

/** GXT TextField 빈 값 = null */
const n = (s: string | null | undefined) => (s == null || s === '' ? null : s);

export const Bbs02_Edit_Notice: React.FC<Props> = ({ model, onClose, onSaved, onDeleted }) => {
  const gridRef = useRef<AgGridReact<BbsTarget>>(null);
  const [f, setF] = useState<BbsNoticeEdit | null>(model);
  const [saving, setSaving] = useState(false);
  const [targets, setTargets] = useState<BbsTarget[]>([]);   // targetId < 0 = 이번에 더한(아직 저장 전) 대상자
  const [detailCodes, setDetailCodes] = useState<Code[]>([]);
  const [fileCount, setFileCount] = useState(0);
  const [alarmCount, setAlarmCount] = useState(0);
  const [fileOpen, setFileOpen] = useState(false);
  const [alarmOpen, setAlarmOpen] = useState(false);
  const [personOpen, setPersonOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [loadOpen, setLoadOpen] = useState(false);
  const [preview, setPreview] = useState<{ title: string | null; notice: string } | null>(null);
  const tempId = useRef(-1);
  /** HtmlEditor는 만들 때 한 번만 값을 받는다 — [불러오기]로 내용이 바뀌면 key를 바꿔 다시 만든다 */
  const [editorVer, setEditorVer] = useState(0);
  useEffect(() => setF(model), [model]);

  const noticeId = f?.noticeId;
  const isNew = !!f?.isNew;

  // setFileButtonText() L502-513: 서비스 sys.Sys10_File.selectByParentId → "첨부파일 등록(n)"
  const setFileButtonText = useCallback(async () => {
    if (noticeId == null) return;
    try { setFileCount((await fileApi.searchByParentId(noticeId)).length); } catch { setFileCount(0); }
  }, [noticeId]);
  // setAlarmButtonText() L515-526: 서비스 sch.Sch06_Alarm.selectByTargetId → "예약알람설정(n)"
  const setAlarmButtonText = useCallback(async () => {
    if (noticeId == null) return;
    try { setAlarmCount((await schApi.searchAlarms(noticeId)).length); } catch { setAlarmCount(0); }
  }, [noticeId]);

  // retrieveGrid() L570-576: 서비스 bbs.Bbs03_Target.selectByNoticeId(noticeId, companyId, fromDate)
  const retrieveGrid = useCallback(async (id: number, fromDate: string | null) => {
    try {
      setTargets(fromDate ? await bbsNoticeApi.searchNoticeTargets(id, fromDate) : []);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // 구분 코드 → 공지상세 목록 (selectByCode3: code = 구분 + "%")
  const allDetailRef = useRef<Code[]>([]);
  const loadDetails = useCallback((type: string | null) => {
    setDetailCodes(type ? allDetailRef.current.filter(c => c.code.startsWith(type)) : []);
  }, []);

  // [E0] 열림 — newNotice() L400-441 / editNotice() L443-483
  useEffect(() => {
    if (!model) return;
    setTargets([]);
    setFileCount(0);
    setAlarmCount(0);
    sysApi.searchCodes('NoticeDetailCode')
      .then(list => { allDetailRef.current = list; loadDetails(model.noticeType); })
      .catch(err => message.error(errorMessage(err, '공지구분 조회 실패')));
    if (!model.isNew) {
      void retrieveGrid(model.noticeId, model.fromDate);
      void setFileButtonText();
      void setAlarmButtonText();
    }
  }, [model]);   // eslint-disable-line react-hooks/exhaustive-deps

  // buildGrid() L528-536
  const columnDefs = useMemo(() => [
    gb.text('orgName', 140, '조직'),  // L531
    gb.text('titleName', 100, '직책'),  // L532
    gb.text('empNo', 80, '사번'),  // L533
    gb.text('empName', 80, '성명'),  // L534
  ], []);

  if (!f) return null;
  const set = <K extends keyof BbsNoticeEdit>(k: K, v: BbsNoticeEdit[K]) => setF(prev => prev && { ...prev, [k]: v });
  const allType = f.noticeType === '01';   // setGridButton() L485-500: "01"(전체공지)은 대상자 영역을 끈다

  // setTopNoticeYn() L391-398: 상단고정이 아니면 종료일 비활성·비움
  const onTopChange = (checked: boolean) => setF(prev => prev && { ...prev, topNoticeYn: checked, topNoticeCloseDate: checked ? prev.topNoticeCloseDate : null });

  // [E1] noticeTypeName[공지구분].Collapse (L149) → 공지상세를 "없음"으로, setGridButton()
  const onTypeChange = (code: string | undefined, name?: string) => {
    setF(prev => prev && { ...prev, noticeType: code ?? null, noticeTypeName: name ?? null, noticeDetailCode: null, noticeDetailName: null });
    loadDetails(code ?? null);
  };

  // insertRow() L538-568: [등록] → 사원찾기(여러 명) → 대상자 그리드에 행 추가(맨 아래)
  const addPersons = (persons: { personId: number; orgName: string | null; titleName: string | null; empNo: string | null; empName: string | null }[]) => {
    setTargets(prev => [...prev, ...persons.map(p => ({
      targetId: tempId.current--, noticeId: f.noticeId, personId: p.personId, orgName: p.orgName, titleName: p.titleName, empNo: p.empNo, empName: p.empName,
    }))]);
    setTimeout(() => {
      const api = gridRef.current?.api;
      if (api && api.getDisplayedRowCount() > 0) api.ensureIndexVisible(api.getDisplayedRowCount() - 1);
    }, 0);
  };
  const onPersons = (list: TransPerson[]) => addPersons(list.map(t => ({ personId: t.personId, orgName: t.orgNm ?? null, titleName: t.titleNm ?? null, empNo: t.empNo ?? null, empName: t.korNm ?? null })));
  const onGroup = (result: string | EmpAddrBookSelect[]) => {
    if (typeof result === 'string') return;
    addPersons(result.map(m => ({ personId: m.relateId, orgName: m.orgName, titleName: m.titleName, empNo: m.empNo, empName: m.empName })));
  };

  // [E2] insertButton[등록].Select (L177): 검사 뒤 insertRow()
  const insertTarget = () => {
    if (!f.fromDate) return void message.warning('공지일은 필수입력 항목입니다');
    if (!f.noticeType) return void message.warning('공지구분은 필수선택 항목입니다');
    if (f.noticeType === '01') return void message.warning('전체공지는 등록 할 수 없습니다');
    setPersonOpen(true);
  };

  // [E3] deleteTargetButton[삭제].Select (L195) → deleteTargetModel() L578-582: 체크한 대상자 삭제 (저장된 것은 bbs.Bbs03_Target.delete, 이번에 더한 것은 그리드에서만 뺀다)
  const deleteTargetModel = async () => {
    const checked = gridRef.current?.api.getSelectedRows() ?? [];
    if (checked.length === 0) return void message.warning('삭제할 행을 선택하세요.');
    try {
      const saved = checked.filter(r => r.targetId > 0).map(r => r.targetId);
      if (saved.length > 0) await bbsNoticeApi.deleteNoticeTargets(f.noticeId, saved);
      const gone = new Set(checked.map(r => r.targetId));
      setTargets(prev => prev.filter(r => !gone.has(r.targetId)));
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // deleteAllTarget() L584-596: bbs.Bbs03_Target.deleteAllTarget → retrieveGrid()
  const deleteAllTarget = async () => {
    try {
      await bbsNoticeApi.deleteAllNoticeTargets(f.noticeId);
      await retrieveGrid(f.noticeId, isNew ? null : f.fromDate);
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // [E4]·[E5] deleteAllButton[전체삭제].Select (L201) → "개별 대상자를 전체 삭제하시겠습니까?"(제목 "삭제", 폭 350) → [YES] deleteAllTarget()
  const confirmDeleteAll = () => Modal.confirm({ title: '삭제', content: '개별 대상자를 전체 삭제하시겠습니까?', okText: '예', cancelText: '아니오', width: 350, onOk: deleteAllTarget });

  // [E8] updateButton[저장].Select (L259) → update() L648-680
  const update = async () => {
    if (n(f.title) == null) return void message.warning('제목은 필수입력 항목입니다');
    if (f.fromDate == null) return void message.warning('공지일은 필수입력 항목입니다');
    if (f.toDate == null) return void message.warning('종료일은 필수입력 항목입니다');
    if (f.noticeType == null) return void message.warning('공지구분은 필수선택 항목입니다');
    if (f.topNoticeYn && f.topNoticeCloseDate == null) return void message.warning('상단고정을 설정하면, 종료일은 필수선택 항목입니다');
    setSaving(true);
    try {
      const saved = await bbsNoticeApi.saveNotice({
        noticeId: f.noticeId, title: f.title!, notice: n(f.notice), fromDate: f.fromDate, toDate: f.toDate, openYn: n(f.openYn), note: n(f.note),
        noticeType: f.noticeType, noticeDetailCode: n(f.noticeDetailCode), commentYn: f.commentYn, topNoticeYn: f.topNoticeYn,
        topNoticeCloseDate: f.topNoticeYn ? f.topNoticeCloseDate : null,
        newTargetPersonIds: targets.filter(t => t.targetId < 0).map(t => t.personId),
      });
      onSaved(saved);
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // [E9] deleteButton[삭제].Select (L265) → delete() L598-632: 미등록(새) 공지면 그냥 닫는다, 아니면 "해당 공지사항을 삭제하시겠습니까?"(제목 "확인", 폭 400)
  //   → [YES] bbs.Bbs02_Notice.delete → [E15] deleteAllTarget(), hide()
  const remove = () => {
    if (isNew) { onClose(); return; }
    Modal.confirm({
      title: '확인',
      content: '해당 공지사항을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 400,
      onOk: async () => {
        try {
          await bbsNoticeApi.deleteNotice(f.noticeId);
          await bbsNoticeApi.deleteAllNoticeTargets(f.noticeId);
          onDeleted(f.noticeId);
          onClose();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // loadBbs() L634-646: 고른 공지의 제목·내용을 가져온다 (제목칸 + 편집기 setHtmlText)
  const loadBbs = (picked: BbsNoticeMng) => {
    setF(prev => prev && { ...prev, title: picked.title, notice: picked.notice });
    setEditorVer(v => v + 1);
  };

  return (
    <Modal
      open
      title="공지사항"
      width={1350}
      maskClosable={false}
      onCancel={onClose}
      styles={{ content: { padding: 20 }, header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 }, footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 } }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            <Button type="delete" onClick={remove}>삭제</Button>
            {/* [E10] closeButton[닫기].Select ["NEW".equals(actionName)] (L271) → hide() (새 공지는 그리드에서도 뺀다 — 저장 전에는 그리드에 넣지 않으므로 그냥 닫는다) */}
            <Button type="close" onClick={onClose}>닫기</Button>
            {/* [E11] addFileButton[첨부파일 등록(n)].Select (L280) → Bbs02_Lookup_File.open(noticeId, callback → setFileButtonText()) */}
            <Button type="upload" onClick={() => setFileOpen(true)}>{`첨부파일 등록(${fileCount})`}</Button>
            {/* [E12] alarmButton[예약알람설정(n)].Select (L292) → Sch06_Lookup_AlarmSetup.open("BBS", noticeId, callback → setAlarmButtonText()) */}
            <Button type="view" onClick={() => setAlarmOpen(true)}>{`예약알람설정(${alarmCount})`}</Button>
            {/* [E13] previewButton[미리보기].Select (L304) → Bbs02_Popup_NoticeAdmin.open(title, 편집기 내용) */}
            <Button type="view" onClick={() => setPreview({ title: f.title, notice: f.notice ?? '' })}>미리보기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', gap: 20, height: 600, padding: '12px 0', boxSizing: 'border-box' }}>
        {/* 왼쪽: 남는 폭 (모달 1350 − 좌우 여백 40 − 간격 20 − 오른쪽 490 = 800. AS-IS 830은 안쪽 폭을 넘쳐 오른쪽이 모달 밖으로 나갔다) */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <Field label="제목 " required><Input value={f.title ?? ''} onChange={e => set('title', e.target.value)} /></Field>
            {/* [E7] copyButton[불러오기].Select (L253) → loadBbs() */}
            <Button type="register" onClick={() => setLoadOpen(true)}>불러오기</Button>
          </div>
          <Field label="내용 ">
            <HtmlEditor key={`${f.noticeId}-${isNew ? 'n' : 'e'}-${editorVer}`} value={f.notice} onChange={html => set('notice', html)} height={470} />
          </Field>
        </div>
        {/* 오른쪽 490 */}
        <div style={{ width: 490, flex: 'none', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
          <div style={{ display: 'flex' }}>
            <Field label="상태 " width={245} required>
              <Select style={{ width: '100%' }} value={f.openYn ?? undefined} onChange={v => set('openYn', v)} options={[{ value: '알림', label: '알림' }, { value: '대기', label: '대기' }]} />
            </Field>
            <Field label="작성자 " width={245} required><Input readOnly value={f.userName ?? ''} /></Field>
          </div>
          <div style={{ display: 'flex' }}>
            <Field label="공지일 " width={245} required>
              <DatePicker style={{ width: '100%' }} value={f.fromDate ? dayjs(f.fromDate) : null} onChange={d => set('fromDate', d ? d.format(DATE) : null)} />
            </Field>
            <Field label="종료일 " width={245} required>
              <DatePicker style={{ width: '100%' }} value={f.toDate ? dayjs(f.toDate) : null} onChange={d => set('toDate', d ? d.format(DATE) : null)} />
            </Field>
          </div>
          <div style={{ display: 'flex' }}>
            {/* [E14] topNoticeYn[상단고정].ValueChange (L313) → setTopNoticeYn() */}
            <Field label="상단고정 " width={245}><Checkbox style={{ marginTop: 8 }} checked={f.topNoticeYn} onChange={e => onTopChange(e.target.checked)} /></Field>
            <Field label="종료일 " width={245}>
              <DatePicker style={{ width: '100%' }} disabled={!f.topNoticeYn} value={f.topNoticeCloseDate ? dayjs(f.topNoticeCloseDate) : null}
                onChange={d => set('topNoticeCloseDate', d ? d.format(DATE) : null)} />
            </Field>
          </div>
          <Field label="메모 "><Input.TextArea rows={3} value={f.note ?? ''} onChange={e => set('note', e.target.value)} /></Field>
          <div style={{ display: 'flex' }}>
            <Field label="공지구분 " width={245} required>
              <SystemCodeComboBox kindGroupCd="NoticeType001" style={{ width: '100%' }} value={f.noticeType ?? undefined} onChange={onTypeChange} />
            </Field>
            <Field label="공지상세 " width={245}>
              <Select
                style={{ width: '100%' }}
                value={f.noticeDetailCode ?? ''}
                onChange={v => setF(prev => prev && { ...prev, noticeDetailCode: v === '' ? null : v })}
                options={[{ value: '', label: '없음' }, ...detailCodes.map(c => ({ value: c.code, label: c.name }))]}
              />
            </Field>
          </div>
          <Field label="댓글허용 " width={245}><Checkbox style={{ marginTop: 8 }} checked={f.commentYn} onChange={e => set('commentYn', e.target.checked)} /></Field>
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9', boxSizing: 'border-box', marginLeft: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 8px' }}>
              <span>개별 대상자</span>
              <Button type="register" disabled={allType} onClick={insertTarget}>등록</Button>
              <Button type="delete" disabled={allType} onClick={() => void deleteTargetModel()}>삭제</Button>
              <Button type="delete" disabled={allType} onClick={confirmDeleteAll}>전체삭제</Button>
              {/* [E6] groupButton[그룹].Select [result != null] (L218) → Emp57_Lookup_List.open("emp03model", …): 사내 담당자만 대상자로 더한다 */}
              <Button type="group" disabled={allType} onClick={() => setGroupOpen(true)}>그룹</Button>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <MultiGrid<BbsTarget> gridRef={gridRef} rowData={targets} columnDefs={columnDefs} getRowId={p => String(p.data.targetId)} />
            </div>
          </div>
        </div>
      </div>
      <Emp01_Lookup_PersonModel open={personOpen} onClose={() => setPersonOpen(false)} onSelect={onPersons} />
      <Emp57_Lookup_List open={groupOpen} actionCode="emp03model" onSelect={onGroup} onClose={() => setGroupOpen(false)} />
      <Bbs02_Lookup_LoadBbs open={loadOpen} onSelect={loadBbs} onClose={() => setLoadOpen(false)} />
      <Bbs15_Lookup_File open={fileOpen} parentId={f.noticeId} onClose={() => { setFileOpen(false); void setFileButtonText(); }} />
      <Sch06_Lookup_AlarmSetup target={alarmOpen ? { targetCode: 'BBS', targetId: f.noticeId } : null} onClosed={() => void setAlarmButtonText()} onClose={() => setAlarmOpen(false)} />
      <Bbs02_Popup_NoticeAdmin
        notice={preview ? { noticeId: f.noticeId, title: preview.title ?? '', notice: preview.notice, commentYn: false, preview: true } : null}
        onClose={() => setPreview(null)}
      />
    </Modal>
  );
};
