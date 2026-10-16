/**
 * 개선사항 및 오류 통보 편집 폼 (A30) — Sys90_Tab_AfterServiceAdmin 아래쪽
 * AS-IS: myApp/client/vi/sys/Sys90_Edit_BoardAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor() L222-353: 위 줄(배경 #F7F8FC, 높이 180) = 발생일자·구분·요청자·확인여부(250) | 본문내용(보기 전용 HTML, 550) | 첨부파일 그리드(600) | 파일등록·파일관리 단추(120),
 *   아래 줄(높이 160) = 담당자명·완료예정·완료여부(250) | 처리방안(HTML 편집, 550) | 비고내용(글상자, 600), 하단 저장.
 *   "본문내용 :"·"처리방안 :"·"비고내용 :" 글자를 누르면 각각 조회창이 열린다.
 * [E6]·[E11] deleteButton[삭제] — 원본은 만들기만 하고 버튼 줄에 붙이지 않는다(L205 주석) → 화면에 없다. 서버 delete도 옮기지 않았다(작업기록)
 * 처리방안 편집기는 CKEditor(iframe) → HtmlEditor(Tiptap, 사용자 결정 2026-10-13). 형식을 바꾸는 확인은 key로 편집기를 다시 만든다.
 * 부르는 쪽은 key={선택 ID-조회 횟수}로 다시 만든다 (AS-IS retrieve()의 editDriver.edit(model)).
 */
import React, { useRef, useState } from 'react';
import { Checkbox, DatePicker, Input, message, Typography } from 'antd';
import dayjs from 'dayjs';
import { fileApi } from '@/api/file';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { AfterService } from '@/types/sys';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { HtmlView } from '@/components/form/HtmlView';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Sys10_Lookup_ListFileViewer } from './Sys10_Lookup_ListFileViewer';
import { Sys90_Grid_ApprFile, Sys90_Grid_ApprFileHandle } from './Sys90_Grid_ApprFile';
import { Sys90_Lookup_HappenReason } from './Sys90_Lookup_HappenReason';
import { Sys90_Lookup_HappenRemedy } from './Sys90_Lookup_HappenRemedy';
import { Sys90_Lookup_Remarks } from './Sys90_Lookup_Remarks';

const FIELD_W = 250;
const ROW: React.CSSProperties = { display: 'flex', alignItems: 'center', marginBottom: 10 };

const Label: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => (
  <Typography.Text strong style={{ width: 100, flex: 'none', cursor: onClick ? 'pointer' : undefined }} onMouseDown={onClick}>{children}</Typography.Text>
);

interface Props {
  /** 선택한 개선사항 — 없으면 비활성(AS-IS editBoard.setEnabled(false)) */
  model: AfterService | null;
  /** 저장·비고 저장 뒤 그리드 행을 바꾼다 (AS-IS grid.getStore().update(model)) */
  onSaved: (row: AfterService) => void;
}

export const Sys90_Edit_BoardAdmin: React.FC<Props> = ({ model, onSaved }) => {
  const disabled = !model;
  const gridRef = useRef<Sys90_Grid_ApprFileHandle>(null);
  const fileForm = useRef<FileUpdownFormHandle>(null);
  const [worker, setWorker] = useState(model?.worker ?? '');
  const [dueDate, setDueDate] = useState(model?.dueDate ?? null);
  const [stateCd, setStateCd] = useState<string | undefined>(model?.stateCd ?? undefined);
  const [remedy, setRemedy] = useState(model?.happenRemedy ?? '');
  const [remedyKey, setRemedyKey] = useState(0);
  const [remarks, setRemarks] = useState(model?.remarks ?? '');
  const [reasonHtml, setReasonHtml] = useState<string | null>(null);
  const [remedyHtml, setRemedyHtml] = useState<string | null>(null);
  const [remarksModel, setRemarksModel] = useState<AfterService | null>(null);
  const [fileViewId, setFileViewId] = useState<number | null>(null);

  // [E5] updateButton[저장].Select (L197) → updateRow() L374-394: 서비스 sys.Sys90_AfterService.adminUpdate → updateEnd() L396-410(selectById) → 그리드 행 갱신
  const updateRow = async () => {
    if (!model) return;
    try {
      const saved = await sysApi.updateAfterServiceAdmin({ ...model, worker, dueDate, stateCd, happenRemedy: remedy, remarks });
      message.success('저장이 완료되었습니다.');
      onSaved(saved);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E1]·[E2]·[E12] 파일 고르기 → FileUpload?parentId=afterServiceId → SubmitComplete → resetFileUpload(), apprFileList.retrieve(model, true)
  const upload = async (file?: File) => {
    if (!file || !model) return;
    try {
      await fileApi.upload(model.afterServiceId, file);
      await gridRef.current?.retrieve();
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
    }
  };

  return (
    <div style={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : undefined, background: '#fff', overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', background: '#F7F8FC', padding: '20px 20px 0 20px', height: 180, flex: 'none', boxSizing: 'border-box', minWidth: 1560 }}>
        <div style={{ width: FIELD_W, marginRight: 40 }}>
          <div style={ROW}><Label>발생일자</Label><Input readOnly value={model?.happenDate ?? ''} /></div>
          <div style={ROW}><Label>구분</Label><Input readOnly value={model?.afterServiceNm ?? ''} /></div>
          <div style={ROW}><Label>요청자</Label><Input readOnly value={model?.regEmpNm ?? ''} /></div>
          <div style={ROW}>
            <Label>확인여부</Label>
            {/* [E7] confirmYn[확인여부].Change (L209) → 메시지 "변경불가", 값은 그대로 */}
            <Checkbox checked={model?.confirmYn === 'true'} onChange={() => message.info('변경불가')} />
          </div>
        </div>
        <div style={{ width: 550, marginRight: 40, display: 'flex' }}>
          {/* [E8] anchor3.MouseDown (L230) → Sys90_Lookup_HappenReason.open(happenReason) */}
          <Label onClick={() => setReasonHtml(model?.happenReason ?? '')}>본문내용 :</Label>
          <div style={{ flex: 1, minWidth: 0 }}><HtmlView html={model?.happenReason} height={135} /></div>
        </div>
        <div style={{ width: 600, display: 'flex' }}>
          <Label>첨부파일</Label>
          <div style={{ flex: 1, height: 142 }}>
            <Sys90_Grid_ApprFile ref={gridRef} parentId={model?.afterServiceId} />
          </div>
        </div>
        <div style={{ width: 120, marginLeft: 40, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {/* [E3] uploadFileButton[파일등록].Select (L185) → fileUpload.click() */}
          <Button type="upload" onClick={() => fileForm.current?.click()}>파일등록</Button>
          <FileUpdownForm ref={fileForm} onChange={upload} />
          {/* [E4] fileViewButton[파일관리].Select (L191) → fileViewLookup() L459-467 */}
          <Button type="view" onClick={() => model && setFileViewId(model.afterServiceId)}>파일관리</Button>
        </div>
      </div>
      <div style={{ display: 'flex', padding: '20px 20px 0 20px', height: 160, flex: 'none', boxSizing: 'border-box', minWidth: 1560 }}>
        <div style={{ width: FIELD_W, marginRight: 45 }}>
          <div style={ROW}><Label>담당자명</Label><Input value={worker} onChange={e => setWorker(e.target.value)} /></div>
          <div style={ROW}>
            <Label>완료예정</Label>
            <DatePicker style={{ width: 140 }} value={dueDate ? dayjs(dueDate) : null} format="YYYY-MM-DD"
              onChange={d => setDueDate(d ? d.format('YYYY-MM-DD') : null)} />
          </div>
          <div style={ROW}>
            <Label>완료여부</Label>
            <SystemCodeComboBox kindCd="AfterStateCode" style={{ width: 140 }} value={stateCd} onChange={code => setStateCd(code)} />
          </div>
        </div>
        <div style={{ width: 550, marginRight: 45, display: 'flex' }}>
          {/* [E9] anchor.MouseDown (L278) → Sys90_Lookup_HappenRemedy.open(처리방안, callback → 편집기에 넣기) */}
          <Label onClick={() => setRemedyHtml(remedy)}>처리방안 :</Label>
          <div style={{ flex: 1, minWidth: 0 }}>
            <HtmlEditor key={remedyKey} value={remedy} onChange={setRemedy} height={135} />
          </div>
        </div>
        <div style={{ width: 600, display: 'flex' }}>
          {/* [E10] anchor2.MouseDown (L293) → Sys90_Lookup_Remarks.open(model, callback → 비고 칸·그리드 갱신) */}
          <Label onClick={() => model && setRemarksModel({ ...model, remarks })}>비고내용 :</Label>
          <Input.TextArea style={{ width: 495, height: 135, resize: 'none' }} value={remarks} onChange={e => setRemarks(e.target.value)} />
        </div>
      </div>
      <div style={{ flex: 'none', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button type="save" onClick={updateRow}>저장</Button>
      </div>
      <Sys90_Lookup_HappenReason html={reasonHtml} onClose={() => setReasonHtml(null)} />
      <Sys90_Lookup_HappenRemedy html={remedyHtml} onClose={() => setRemedyHtml(null)}
        onConfirm={html => { setRemedy(html); setRemedyKey(k => k + 1); }} />
      <Sys90_Lookup_Remarks model={remarksModel} onClose={() => setRemarksModel(null)}
        onSaved={row => { setRemarks(row.remarks ?? ''); onSaved(row); }} />
      <Sys10_Lookup_ListFileViewer parentId={fileViewId} onClose={() => { setFileViewId(null); gridRef.current?.retrieve(); }} />
    </div>
  );
};
