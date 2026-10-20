/**
 * 법규등록신청 편집 영역 (H11) — Ics17_Tab_UserRequest 아래쪽(62%)
 * AS-IS: myApp/client/vi/ics/Ics17_Edit_UserRequest.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor() L186-278: 라벨 100, 위 270(배경 #F7F8FC) = 요청일자·요청자·확인여부 / 법규명·법규내용(누르면 팝업)·보고주기 / 보고처·법규조항·서식파일 / [파일등록],
 *   아래 200 = 진행상태·완료일 / 처리내용. 요청자·진행상태·완료일·처리내용은 읽기 전용(buttonSetting L160-164). 하단 가운데 [저장]·[삭제]
 *   행을 고르지 않으면 비활성(AS-IS editBoard.setEnabled(false)). 관리자용(Ics17_Edit_UserRequestAdmin)과 반대로 신청 내용을 고치고 비고 칸이 없다
 */
import React, { useEffect, useRef, useState } from 'react';
import { Checkbox, DatePicker, Input, message, Modal, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { icsApi } from '@/api/ics';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { IcsUserRequest } from '@/types/ics';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { Ics17_Grid_FileList, Ics17_Grid_FileListHandle } from './Ics17_Grid_FileList';
import { Ics17_Lookup_LawContent } from './Ics17_Lookup_LawContent';

const LABEL_W = 100;

/** 라벨(폭 100) + 칸 한 줄 (AS-IS FieldLabel) */
const Field: React.FC<{ label: React.ReactNode; children: React.ReactNode; width: number; bottom?: number }> = ({ label, children, width, bottom = 10 }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', width: width + LABEL_W, marginBottom: bottom }}>
    <div style={{ width: LABEL_W, flex: 'none', lineHeight: '32px', fontWeight: 'bold', color: '#1F4D83' }}>{label}</div>
    <div style={{ width }}>{children}</div>
  </div>
);

interface Props {
  /** 위 그리드에서 고른 행(새 신청은 임시 ID ≤ 0). 없으면 비활성 (AS-IS retrieve(param)·init()) */
  model: IcsUserRequest | null;
  /** 저장·법규내용 팝업 저장한 행을 위 그리드에 반영 (AS-IS grid.getStore().update(model)). previousId = 저장 전 행 ID(새 신청이면 임시 ID) */
  onSaved: (row: IcsUserRequest, previousId: number) => void;
  /** 삭제 끝 (AS-IS callback.execute() → 위 화면이 다시 조회) */
  onDeleted: () => void;
}

export const Ics17_Edit_UserRequest: React.FC<Props> = ({ model, onSaved, onDeleted }) => {
  const [regDate, setRegDate] = useState<string | null>(null);
  const [confirmYn, setConfirmYn] = useState(false);
  const [lawTitle, setLawTitle] = useState('');
  const [lawContent, setLawContent] = useState('');
  const [reportCycle, setReportCycle] = useState('');
  const [submitTo, setSubmitTo] = useState('');
  const [relatedLaw, setRelatedLaw] = useState('');
  const [lawModel, setLawModel] = useState<IcsUserRequest | null>(null);
  const fileList = useRef<Ics17_Grid_FileListHandle>(null);
  const fileUpload = useRef<FileUpdownFormHandle>(null);
  const enabled = !!model;

  // [E0] 화면 열림 (생성자 L104-158) → buttonSetting(), getEditor(), show(): 읽기 전용 칸·버튼 연결은 아래 JSX에서, 처음에는 행이 없어 비활성

  // retrieve(param) L280-293: 고른 행의 값을 편집 칸에 채우고 서식파일을 읽는다(서식파일 그리드는 parentId가 바뀌면 스스로 읽음)
  useEffect(() => {
    setRegDate(model?.regDate ?? null);
    setConfirmYn(model?.confirmYn === 'true');
    setLawTitle(model?.lawTitle ?? '');
    setLawContent(model?.lawContent ?? '');
    setReportCycle(model?.reportCycle ?? '');
    setSubmitTo(model?.submitTo ?? '');
    setRelatedLaw(model?.relatedLaw ?? '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model?.userRequestId]);

  // [E4] updateButton[저장].Select (L172) → updateRow() L295-315: 요청일자 없으면 "요청일자를 입력해주세요", ics.Ics17_UserRequest.update (새 신청은 등록)
  const updateRow = async () => {
    if (!model) return;
    if (!regDate) {
      message.warning('요청일자를 입력해주세요');
      return;
    }
    const req = { regDate, confirmYn: String(confirmYn), lawTitle, lawContent, reportCycle, submitTo, relatedLaw };
    try {
      const saved = model.userRequestId > 0
        ? await icsApi.updateMyUserRequest(model.userRequestId, req)
        : await icsApi.createUserRequest(req);
      onSaved(saved, model.userRequestId);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // delete() L336-361: ics.Ics17_UserRequest.delete → 편집 칸을 비우고 위 화면이 다시 조회 (저장 전 새 신청은 서버에 지울 것이 없다)
  const remove = async () => {
    if (!model) return;
    try {
      if (model.userRequestId > 0) await icsApi.deleteUserRequest(model.userRequestId);
      onDeleted();
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // [E5] deleteButton[삭제].Select (L178) → deleteRow() L317-334: 접수된(진행상태 있는) 신청은 안내, 확인 창 [YES] → [E7] delete()
  const deleteRow = () => {
    if (!model) return;
    if (model.stateName) {
      message.warning('접수된 내용은 삭제불가능합니다');
      return;
    }
    Modal.confirm({
      title: '삭제',
      content: '선택한 게시물을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: remove,
    });
  };

  // [E1] fileUpload.Change (L118) → FileUpload?parentId={요청ID} (여러 파일), [E2] fileUploadForm.SubmitComplete (L128) → resetFileUpload() L373-388 + fileList.retrieve(), [E8] fileUpload.Change (L380)
  const onFilesChange = async (files: File[]) => {
    if (!model || files.length === 0) return;
    if (model.userRequestId <= 0) {
      message.warning('저장 후 파일을 등록해주세요');
      return;
    }
    try {
      for (const file of files) await fileApi.upload(model.userRequestId, file);
    } catch (err) {
      message.error(errorMessage(err, '파일 올리기 실패'));
    }
    await fileList.current?.retrieve();
  };

  // [E6] anchor.MouseDown (L192) → Ics17_Lookup_LawContent.open(userRequestModel, "user", callback) L192-205: 돌려받은 행으로 법규내용·그리드 행을 바꾼다
  const onLawContentSaved = (row: IcsUserRequest) => {
    setLawContent(row.lawContent ?? '');
    onSaved(row, row.userRequestId);
  };

  const area = (h: number, v: string, set?: (s: string) => void) => (
    <Input.TextArea style={{ height: h, resize: 'none' }} value={v} readOnly={!set} disabled={!enabled}
      onChange={set ? e => set(e.target.value) : undefined} />
  );
  const input = (v: string, set: (s: string) => void) => <Input disabled={!enabled} value={v} onChange={e => set(e.target.value)} />;
  const readOnly = (v?: string | null) => <Input readOnly disabled={!enabled} value={v ?? ''} />;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', background: '#F7F8FC', minHeight: 270 }}>
          <div style={{ width: 250, padding: 20, boxSizing: 'content-box' }}>
            <Field label="요청일자" width={120}>
              <DatePicker style={{ width: 140 }} disabled={!enabled} value={regDate ? dayjs(regDate) : null}
                onChange={d => setRegDate(d ? d.format('YYYY-MM-DD') : null)} />
            </Field>
            <Field label="요청자" width={120}>{readOnly(model?.personName)}</Field>
            {/* confirmYn: 요청자확인여부 체크박스 */}
            <Field label="확인여부" width={120}>
              <Checkbox disabled={!enabled} checked={confirmYn} onChange={e => setConfirmYn(e.target.checked)} />
            </Field>
          </div>
          <div style={{ width: 550, padding: 20, boxSizing: 'content-box' }}>
            <Field label="법규명" width={450}>{input(lawTitle, setLawTitle)}</Field>
            <div style={{ display: 'flex', marginBottom: 10 }}>
              <Tooltip title="클릭 시, 팝업으로 보기" placement="right">
                <a style={{ width: LABEL_W, flex: 'none', lineHeight: '32px', fontWeight: 'bold', color: '#000', textDecoration: 'none' }}
                  onMouseDown={() => model && setLawModel(model)}>법규내용 :</a>
              </Tooltip>
              <div style={{ width: 450 }}>
                <Input.TextArea style={{ height: 165, resize: 'none' }} disabled={!enabled} value={lawContent} onChange={e => setLawContent(e.target.value)} />
              </div>
            </div>
            <Field label="보고주기" width={450}>{input(reportCycle, setReportCycle)}</Field>
          </div>
          <div style={{ width: 600, padding: 20, boxSizing: 'content-box' }}>
            <Field label="보고처" width={500}>{input(submitTo, setSubmitTo)}</Field>
            <Field label="법규조항" width={500}>{input(relatedLaw, setRelatedLaw)}</Field>
            <Field label="서식파일" width={500} bottom={25}>
              <Ics17_Grid_FileList ref={fileList} parentId={model?.userRequestId} />
            </Field>
          </div>
          <div style={{ width: 120, padding: 20, boxSizing: 'content-box', display: 'flex', alignItems: 'flex-end' }}>
            {/* [E3] uploadFileButton[파일등록].Select (L166) → fileUpload.click() */}
            <Button type="upload" disabled={!enabled} onClick={() => fileUpload.current?.click()}>파일등록</Button>
            <FileUpdownForm ref={fileUpload} onChange={() => undefined} onChangeFiles={onFilesChange} />
          </div>
        </div>
        {/* downLayout: down01(진행상태 위, 처리내용 1400×160 아래) + down02(완료일, 진행상태와 같은 줄) */}
        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: 250 }}>
              <Field label="진행상태" width={120} bottom={10}>{readOnly(model?.stateName)}</Field>
            </div>
            <Field label="완료일" width={120} bottom={10}>{readOnly(model?.closeDate)}</Field>
          </div>
          <Field label="처리내용" width={1400} bottom={25}>{area(160, model?.result ?? '')}</Field>
        </div>
      </div>
      <div style={{ textAlign: 'center', padding: '12px 0', flex: 'none' }}>
        <Button type="save" disabled={!enabled} onClick={updateRow}>저장</Button>
        <Button type="delete" disabled={!enabled} onClick={deleteRow}>삭제</Button>
      </div>
      <Ics17_Lookup_LawContent model={lawModel} userType="user" onSaved={onLawContentSaved} onClose={() => setLawModel(null)} />
    </div>
  );
};
