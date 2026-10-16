/**
 * 개선사항 및 오류 통보 편집 폼 (A29) — Sys90_Tab_AfterService 아래쪽
 * AS-IS: myApp/client/vi/sys/Sys90_Edit_Board.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor() L206-309: 위 줄(배경 #F7F8FC, 높이 190) = 발생일자·구분·요청자·확인여부(250) | 본문내용(HTML 편집, 550) | 첨부파일 그리드(600) | 파일등록 단추(120),
 *   아래 줄(높이 160) = 담당자명·완료예정·완료여부(읽기 전용, 250) | 처리방안(보기 전용 HTML, 550). 비고내용은 원본이 주석 처리(L284)라 없다.
 *   버튼 줄(L127-129, 높이 60) = 저장·삭제. "본문내용 :"·"처리방안 :" 글자를 누르면 각각 조회창이 열린다.
 * 본문내용 편집기는 CKEditor(iframe) → HtmlEditor(Tiptap, 사용자 결정 2026-10-13). 부르는 쪽은 key={선택 ID-조회 횟수}로 다시 만든다 (AS-IS retrieve()의 editDriver.edit(model)).
 * 등록한 행은 DB에 아직 없다(AS-IS GridInsertRow) — 파일은 새 ID로 바로 올릴 수 있고, 저장하면 DB에 들어간다.
 */
import React, { useRef, useState } from 'react';
import { Checkbox, DatePicker, Input, message, Modal, Typography } from 'antd';
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
import { Sys90_Grid_ApprFile, Sys90_Grid_ApprFileHandle } from './Sys90_Grid_ApprFile';
import { Sys90_Lookup_HappenReason } from './Sys90_Lookup_HappenReason';
import { Sys90_Lookup_HappenRemedy } from './Sys90_Lookup_HappenRemedy';

const FIELD_W = 250;
const ROW: React.CSSProperties = { display: 'flex', alignItems: 'center', marginBottom: 10 };

const Label: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => (
  <Typography.Text strong style={{ width: 100, flex: 'none', cursor: onClick ? 'pointer' : undefined }} onMouseDown={onClick}>{children}</Typography.Text>
);

interface Props {
  /** 선택한 개선사항 — 없으면 비활성(AS-IS editBoard.setEnabled(false)) */
  model: AfterService | null;
  /** 저장 뒤 그리드 행을 바꾼다 (AS-IS updateEnd() grid.getStore().update(model)) */
  onSaved: (row: AfterService) => void;
  /** 삭제 뒤 그리드에서 뺀다 (AS-IS delete() 콜백 grid.getStore().remove(model)) */
  onDeleted: (afterServiceId: number) => void;
}

export const Sys90_Edit_Board: React.FC<Props> = ({ model, onSaved, onDeleted }) => {
  const disabled = !model;
  const gridRef = useRef<Sys90_Grid_ApprFileHandle>(null);
  const fileForm = useRef<FileUpdownFormHandle>(null);
  const [happenDate, setHappenDate] = useState<string | null>(model?.happenDate ?? null);
  const [typeYn, setTypeYn] = useState<string | undefined>(model?.typeYn ?? undefined);
  const [confirmYn, setConfirmYn] = useState(model?.confirmYn === 'true');
  const [reason, setReason] = useState(model?.happenReason ?? '');
  const [reasonKey, setReasonKey] = useState(0);
  const [reasonHtml, setReasonHtml] = useState<string | null>(null);
  const [remedyHtml, setRemedyHtml] = useState<string | null>(null);

  // [E4] updateButton[저장].Select (L192) → updateRow() L333-357: 발생일자 검사 → 서비스 sys.Sys90_AfterService.userUpdate → updateEnd() L359-373(selectById) → 그리드 행 갱신
  const updateRow = async () => {
    if (!model) return;
    if (!happenDate) {
      message.warning('발생일자를 입력해주세요');
      return;
    }
    try {
      const saved = await sysApi.updateAfterService({
        ...model, happenDate, typeYn, happenReason: reason, confirmYn: confirmYn ? 'true' : 'false',
      });
      message.success('저장이 완료되었습니다.');
      onSaved(saved);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E5] deleteButton[삭제].Select (L198) → deleteRow() L375-392: 완료여부(afterStateName)가 있으면 "접수된 내용은 삭제불가능합니다", 없으면 확인창 → [E8] YES → delete() L394-415
  const deleteRow = () => {
    if (!model) return;
    if (model.afterStateNm) {
      message.warning('접수된 내용은 삭제불가능합니다');
      return;
    }
    Modal.confirm({
      title: '삭제',
      content: '선택한 게시물을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await sysApi.deleteAfterService(model.afterServiceId);
          onDeleted(model.afterServiceId);
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E1]·[E9] fileUpload.Change (L136·L428) → FileUpload?parentId=afterServiceId → [E2] SubmitComplete (L146) → resetFileUpload(), apprFileList.retrieve(model, true)
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
      <div style={{ display: 'flex', background: '#F7F8FC', padding: '20px 20px 0 20px', height: 190, flex: 'none', boxSizing: 'border-box', minWidth: 1560 }}>
        <div style={{ width: FIELD_W, marginRight: 40 }}>
          <div style={ROW}>
            <Label>발생일자</Label>
            <DatePicker style={{ width: 140 }} allowClear={false} value={happenDate ? dayjs(happenDate) : null} format="YYYY-MM-DD"
              onChange={d => setHappenDate(d ? d.format('YYYY-MM-DD') : null)} />
          </div>
          <div style={ROW}>
            <Label>구분</Label>
            <SystemCodeComboBox kindCd="AfterServiceCode" style={{ width: 140 }} value={typeYn} onChange={code => setTypeYn(code)} />
          </div>
          <div style={ROW}><Label>요청자</Label><Input readOnly value={model?.regEmpNm ?? ''} /></div>
          <div style={ROW}>
            <Label>확인여부</Label>
            <Checkbox checked={confirmYn} onChange={e => setConfirmYn(e.target.checked)} />
          </div>
        </div>
        <div style={{ width: 550, marginRight: 40, display: 'flex' }}>
          {/* [E6] anchor.MouseDown (L214) → Sys90_Lookup_HappenReason.open(getHtmlText(), callback → setHtmlText) */}
          <Label onClick={() => setReasonHtml(reason)}>본문내용 :</Label>
          <div style={{ flex: 1, minWidth: 0 }}>
            <HtmlEditor key={reasonKey} value={reason} onChange={setReason} height={135} />
          </div>
        </div>
        <div style={{ width: 600, display: 'flex' }}>
          <Label>첨부파일</Label>
          <div style={{ flex: 1, height: 142 }}>
            <Sys90_Grid_ApprFile ref={gridRef} parentId={model?.afterServiceId} />
          </div>
        </div>
        <div style={{ width: 120, marginLeft: 40 }}>
          {/* [E3] uploadFileButton[파일등록].Select (L186) → fileUpload.click() */}
          <Button type="upload" onClick={() => fileForm.current?.click()}>파일등록</Button>
          <FileUpdownForm ref={fileForm} onChange={upload} />
        </div>
      </div>
      <div style={{ display: 'flex', padding: '20px 20px 0 20px', height: 160, flex: 'none', boxSizing: 'border-box', minWidth: 1560 }}>
        <div style={{ width: FIELD_W, marginRight: 45 }}>
          <div style={ROW}><Label>담당자명</Label><Input readOnly value={model?.worker ?? ''} /></div>
          <div style={ROW}><Label>완료예정</Label><Input readOnly style={{ width: 140 }} value={model?.dueDate ?? ''} /></div>
          <div style={ROW}><Label>완료여부</Label><Input readOnly style={{ width: 140 }} value={model?.afterStateNm ?? ''} /></div>
        </div>
        <div style={{ width: 1150, display: 'flex' }}>
          {/* [E7] anchor2.MouseDown (L231) → Sys90_Lookup_HappenRemedy.open(happenRemedy) */}
          <Label onClick={() => setRemedyHtml(model?.happenRemedy ?? '')}>처리방안 :</Label>
          <div style={{ flex: 1, minWidth: 0 }}><HtmlView html={model?.happenRemedy ?? ''} height={135} /></div>
        </div>
      </div>
      <div style={{ flex: 'none', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Button type="save" onClick={updateRow}>저장</Button>
        <Button type="delete" onClick={deleteRow}>삭제</Button>
      </div>
      <Sys90_Lookup_HappenReason html={reasonHtml} onClose={() => setReasonHtml(null)}
        onConfirm={html => { setReason(html); setReasonKey(k => k + 1); }} />
      <Sys90_Lookup_HappenRemedy html={remedyHtml} onClose={() => setRemedyHtml(null)} />
    </div>
  );
};
