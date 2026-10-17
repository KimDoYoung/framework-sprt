/**
 * 법규개정내역 편집 폼 (E03) — Ics20_Tab_RevisionHistoryAdmin 아래쪽
 * AS-IS: myApp/client/vi/ics/Ics20_Edit_RevisionHistoryAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor() L202-287: 라벨 폭 90, 네 칸 = 등록일·소관부처·의견제출일·시행일·법규반영일(200) | 법규명·조문(540×55)·[행 추가][행 삭제]·연결법규 그리드(540×120)
 *   | "내용 :" 글자(누르면 팝업)+내용 입력(545×140)·첨부파일 그리드(640×145) | [파일등록](120), 아래 가운데 [저장][삭제]
 * 부르는 쪽은 key={선택 ID-조회 횟수}로 다시 만든다 (AS-IS retrieve()의 editDriver.edit(model)).
 */
import React, { useCallback, useRef, useState } from 'react';
import { DatePicker, Input, message, Modal, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import { fileApi } from '@/api/file';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsLawLookup, IcsRevisionHistory, IcsRevisionHistoryAdmin, IcsRevisionLaw } from '@/types/ics';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Ics01_Lookup_ClassTreeDetail } from '@/components/lookup/Ics01_Lookup_ClassTreeDetail';
import { Ics01_Lookup_SelectMulti } from './Ics01_Lookup_SelectMulti';
import { Ics19_Grid_IcsList, Ics19_Grid_IcsListHandle } from './Ics19_Grid_IcsList';
import { Ics20_Grid_FileList, Ics20_Grid_FileListHandle } from './Ics20_Grid_FileList';
import { Ics20_Lookup_Content } from './Ics20_Lookup_Content';

const LABEL_W = 90;
const ROW: React.CSSProperties = { display: 'flex', alignItems: 'center', marginBottom: 10 };

const Label: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => (
  <Typography.Text strong style={{ width: LABEL_W, flex: 'none', cursor: onClick ? 'pointer' : undefined }} onMouseDown={onClick}>{children}</Typography.Text>
);

/** MyDateField: 'YYYY-MM-DD' 칸 (비우면 null) */
const DateField: React.FC<{ value?: string | null; onChange: (v: string | null) => void }> = ({ value, onChange }) => (
  <DatePicker style={{ width: 140 }} value={value ? dayjs(value) : null} format="YYYY-MM-DD" onChange={d => onChange(d ? d.format('YYYY-MM-DD') : null)} />
);

const ymd = (v?: string | null) => (v ? v.slice(0, 10) : null);

interface Props {
  /** 선택한 개정내역 — 없으면 비활성. revisionHistoryId가 0 이하면 등록 전의 새 행 */
  model: IcsRevisionHistoryAdmin | null;
  /** 저장 뒤 그리드 행을 바꾼다 (AS-IS GridUpdate가 grid.getStore()를 갱신). prevId = 저장 전 행 ID (새 행은 임시 음수) */
  onSaved: (row: IcsRevisionHistoryAdmin, prevId: number) => void;
  /** 삭제 뒤 그리드에서 행을 뺀다 (AS-IS grid.getStore().remove) */
  onDeleted: (revisionHistoryId: number) => void;
  /** 내용 팝업에서 저장한 뒤 그리드 행을 바꾼다 (AS-IS grid.getStore().update(model)) */
  onNoteSaved: (revisionHistoryId: number, note: string) => void;
}

export const Ics20_Edit_RevisionHistoryAdmin: React.FC<Props> = ({ model, onSaved, onDeleted, onNoteSaved }) => {
  // [E0] 화면 열림 (생성자 L103-166) → settings(), getEditor(), show(): 폼에 선택한 개정내역 값을 채운다. 선택이 없으면 비활성
  const disabled = !model;
  const id = model?.revisionHistoryId ?? 0;
  const icsRef = useRef<Ics19_Grid_IcsListHandle>(null);
  const fileRef = useRef<Ics20_Grid_FileListHandle>(null);
  const fileForm = useRef<FileUpdownFormHandle>(null);
  const [regDate, setRegDate] = useState(ymd(model?.regDate));
  const [financeAgencyCode, setFinanceAgencyCode] = useState<string | undefined>(model?.financeAgencyCode ?? undefined);
  const [submissionDate, setSubmissionDate] = useState(ymd(model?.submissionDate));
  const [effectDate, setEffectDate] = useState(ymd(model?.effectDate));
  const [reflectionDate, setReflectionDate] = useState(ymd(model?.reflectionDate));
  const [title, setTitle] = useState(model?.title ?? '');
  const [relatedLaw, setRelatedLaw] = useState(model?.relatedLaw ?? '');
  const [note, setNote] = useState(model?.note ?? '');
  const [lawLookupOpen, setLawLookupOpen] = useState(false);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [contentRevision, setContentRevision] = useState<IcsRevisionHistory | null>(null);

  // [E4] updateButton[저장].Select (L175) → updateRow() L292-307: 서비스 ics.Ics20_RevisionHistory.update → 실패면 "확인" 창, 성공이면 ics.Ics19_RevisionRelateIcs.update(연결법규 새 행)
  const updateRow = async () => {
    if (!model) return;
    try {
      const saved = await icsApi.saveRevisionHistoryAdmin({
        revisionHistoryId: id > 0 ? id : null,
        regDate, submissionDate, effectDate, reflectionDate, financeAgencyCode,
        title, relatedLaw, note,
      });
      const newLaws = icsRef.current?.getNewRows() ?? [];
      if (newLaws.length > 0) {
        icsRef.current?.replaceNewRows(await icsApi.addRevisionLaws(saved.revisionHistoryId, newLaws.map(l => l.classTreeId)));
      }
      onSaved(saved, id);
    } catch (err) {
      Modal.warning({ title: '확인', content: errorMessage(err, '저장 실패') });
    }
  };

  // [E5] deleteButton[삭제].Select (L181) → deleteRow() L309-325: "선택한 게시물을 삭제하시겠습니까?" → [E9] messageBox.DialogHide [YES] (L326) → delete()
  // 원본은 서비스 결과와 상관없이 폼을 비우고 행을 뺀다. 여기서는 서버가 지운 뒤에 뺀다(등록 전 새 행은 서버를 부르지 않는다)
  const deleteRow = () => {
    if (!model) return;
    Modal.confirm({
      title: '삭제',
      content: '선택한 게시물을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          if (id > 0) await icsApi.deleteRevisionHistoryAdmin(id);
          onDeleted(id);
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E6] icsInsertButton[행 추가].Select (L187) → icsInsertRow() L376-401: 상단 법규를 고르지 않았으면 안내, 아니면 Ics01_Lookup_SelectMulti("classTree")
  const icsInsertRow = () => {
    if (!model) {
      message.warning('상단 법규를 선택하셔야합니다.');
      return;
    }
    setLawLookupOpen(true);
  };

  // Ics01_Lookup_SelectMulti 콜백: 고른 법규마다 GridInsertRow (저장 전 새 행)
  const addLaws = (list: IcsLawLookup[]) => icsRef.current?.addRows(list);

  // [E7] icsDeleteButton[행 삭제].Select (L193) → icsDeleteRow() L403-422: 고른 연결법규가 없으면 안내, "n건의 연결법규를 삭제하시겠습니까?" → [E10] messageBox.DialogHide [YES] (L405) → 서비스 ics.Ics19_RevisionRelateIcs.delete
  const icsDeleteRow = () => {
    const checked: IcsRevisionLaw[] = icsRef.current?.getChecked() ?? [];
    if (checked.length <= 0) {
      message.warning('삭제할 연결법규를 선택바랍니다.');
      return;
    }
    Modal.confirm({
      title: '삭제',
      content: `${checked.length}건의 연결법규를 삭제하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 350,
      onOk: async () => {
        try {
          const saved = checked.filter(r => r.revisionRelateIcsId > 0).map(r => r.revisionRelateIcsId);
          if (saved.length > 0) await icsApi.deleteRevisionLaws(saved);
          icsRef.current?.removeRows(checked.map(r => r.revisionRelateIcsId));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E1]·[E2]·[E11] fileUpload.Change (L114·L429) → FileUpload?parentId=revisionHistoryId → fileUploadForm.SubmitComplete (L126) → resetFileUpload(), fileList.retrieve(model, "admin")
  // 원본은 새 행에도 getSeq ID로 올리지만 여기서는 저장된 개정내역에만 올린다(임시 ID로는 첨부를 붙일 수 없다)
  const upload = useCallback(async (files: File[]) => {
    if (!model || files.length === 0) return;
    if (id <= 0) {
      message.warning('저장한 뒤에 파일을 등록할 수 있습니다.');
      return;
    }
    try {
      for (const file of files) await fileApi.upload(id, file);
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
    }
    await fileRef.current?.retrieve();
  }, [model, id]);

  return (
    <div style={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : undefined, background: '#fff', overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', padding: '20px 20px 0 20px', flex: 1, minHeight: 0, minWidth: 1780 }}>
        <div style={{ flex: 'none', width: 240, marginRight: 30 }}>
          <div style={ROW}><Label>등록일</Label><DateField value={regDate} onChange={setRegDate} /></div>
          <div style={ROW}>
            <Label>소관부처</Label>
            <SystemCodeComboBox kindCd="FinanceAgencyCode" style={{ width: 140 }} value={financeAgencyCode} onChange={code => setFinanceAgencyCode(code)} />
          </div>
          <div style={ROW}><Label>의견제출일</Label><DateField value={submissionDate} onChange={setSubmissionDate} /></div>
          <div style={ROW}><Label>시행일</Label><DateField value={effectDate} onChange={setEffectDate} /></div>
          <div style={ROW}><Label>법규반영일</Label><DateField value={reflectionDate} onChange={setReflectionDate} /></div>
        </div>
        <div style={{ flex: 'none', width: 640, marginRight: 30, display: 'flex', flexDirection: 'column' }}>
          <div style={ROW}><Label>법규명</Label><Input.TextArea style={{ width: 540, height: 55, resize: 'none' }} value={title} onChange={e => setTitle(e.target.value)} /></div>
          <div style={ROW}><Label>조문</Label><Input.TextArea style={{ width: 540, height: 55, resize: 'none' }} value={relatedLaw} onChange={e => setRelatedLaw(e.target.value)} /></div>
          <div style={{ ...ROW, marginLeft: 98, gap: 10, marginBottom: 5 }}>
            <Button type="addRow" onClick={icsInsertRow}>행 추가</Button>
            <Button type="removeRow" onClick={icsDeleteRow}>행 삭제</Button>
          </div>
          <div style={{ display: 'flex' }}>
            <Label>연결법규</Label>
            <div style={{ width: 540, height: 120 }}><Ics19_Grid_IcsList ref={icsRef} revisionHistoryId={id} onDetail={row => setDetailId(row.classTreeId)} /></div>
          </div>
        </div>
        <div style={{ flex: 'none', width: 640, marginRight: 50, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', marginBottom: 10 }}>
            {/* [E8] anchor.MouseDown (L209) → Ics20_Lookup_Content.open(revisionHistoryModel, "admin", callback → 내용 칸·그리드 갱신) */}
            <Tooltip title="클릭 시, 팝업으로 보기" placement="right">
              <span style={{ display: 'inline-block', width: 95, flex: 'none' }}>
                <Label onClick={() => model && setContentRevision({ revisionHistoryId: id, note: model.note })}>내용 :</Label>
              </span>
            </Tooltip>
            <Input.TextArea style={{ width: 545, height: 140, resize: 'none' }} value={note} onChange={e => setNote(e.target.value)} />
          </div>
          <div style={{ display: 'flex' }}>
            <Label>첨부파일</Label>
            <div style={{ width: 545, height: 145 }}><Ics20_Grid_FileList ref={fileRef} parentId={id} /></div>
          </div>
        </div>
        <div style={{ flex: 'none', width: 120, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 5 }}>
          {/* [E3] uploadFileButton[파일등록].Select (L169) → fileUpload.click() */}
          <Button type="upload" onClick={() => fileForm.current?.click()}>파일등록</Button>
          <FileUpdownForm ref={fileForm} onChange={f => f && upload([f])} onChangeFiles={upload} />
        </div>
      </div>
      <div style={{ flex: 'none', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Button type="save" onClick={updateRow}>저장</Button>
        <Button type="delete" onClick={deleteRow}>삭제</Button>
      </div>
      <Ics01_Lookup_SelectMulti open={lawLookupOpen} onResult={addLaws} onClose={() => setLawLookupOpen(false)} />
      <Ics01_Lookup_ClassTreeDetail classTreeId={detailId} onClose={() => setDetailId(null)} />
      <Ics20_Lookup_Content
        revision={contentRevision}
        userType="admin"
        onSaved={r => { setNote(r.note ?? ''); onNoteSaved(r.revisionHistoryId, r.note ?? ''); }}
        onClose={() => setContentRevision(null)}
      />
    </div>
  );
};
