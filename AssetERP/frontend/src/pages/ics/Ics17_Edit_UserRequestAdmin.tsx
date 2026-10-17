/**
 * 법규등록요청 편집 영역 (E09) — Ics17_Tab_UserRequestAdmin 아래쪽(62%)
 * AS-IS: myApp/client/vi/ics/Ics17_Edit_UserRequestAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor() L170-267: 라벨 100, 위 270(배경 #F7F8FC) = 요청일자·요청자·확인여부 / 법규명·법규내용(누르면 팝업)·보고주기 / 보고처·법규조항·서식파일 / [파일등록],
 *   아래 200 = 진행상태·완료일 / 처리내용·비고. 요청일자·요청자·법규명·법규내용·보고주기·보고처·법규조항은 읽기 전용(buttonSetting L147-154). 하단 가운데 [저장]
 * 행을 고르지 않으면 비활성(AS-IS editBoard.setEnabled(false))
 */
import React, { useEffect, useRef, useState } from 'react';
import { Checkbox, DatePicker, Input, message, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { icsApi } from '@/api/ics';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { IcsUserRequest } from '@/types/ics';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
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
  /** 위 그리드에서 고른 행. 없으면 비활성 (AS-IS retrieve(param)·init()) */
  model: IcsUserRequest | null;
  /** 저장한 행을 위 그리드에 반영 (AS-IS grid.getStore().update(model)) */
  onSaved: (row: IcsUserRequest) => void;
}

export const Ics17_Edit_UserRequestAdmin: React.FC<Props> = ({ model, onSaved }) => {
  const [confirmYn, setConfirmYn] = useState(false);
  const [stateCode, setStateCode] = useState<string | undefined>();
  const [closeDate, setCloseDate] = useState<string | null>(null);
  const [result, setResult] = useState('');
  const [note, setNote] = useState('');
  const [lawModel, setLawModel] = useState<IcsUserRequest | null>(null);
  const fileList = useRef<Ics17_Grid_FileListHandle>(null);
  const fileUpload = useRef<FileUpdownFormHandle>(null);
  const enabled = !!model;

  // [E0] 화면 열림 (생성자 L92-145) → buttonSetting(), getEditor(), show(): 읽기 전용 칸·버튼 연결은 아래 JSX에서, 처음에는 행이 없어 비활성

  // retrieve(param) L269-280: 고른 행의 값을 편집 칸에 채우고 서식파일을 읽는다(서식파일 그리드는 parentId가 바뀌면 스스로 읽음)
  useEffect(() => {
    setConfirmYn(model?.confirmYn === 'true');
    setStateCode(model?.stateCode ?? undefined);
    setCloseDate(model?.closeDate ?? null);
    setResult(model?.result ?? '');
    setNote(model?.note ?? '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model?.userRequestId]);

  // [E4] updateButton[저장].Select (L162) → updateRow() L282-302: 요청일자 없으면 "요청일자를 입력해주세요", ics.Ics17_UserRequest.update
  const updateRow = async () => {
    if (!model) return;
    if (!model.regDate) {
      message.warning('요청일자를 입력해주세요');
      return;
    }
    try {
      onSaved(await icsApi.updateUserRequest(model.userRequestId, {
        regDate: model.regDate, confirmYn: String(confirmYn), stateCode: stateCode ?? null, closeDate, result, note,
      }));
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E1] fileUpload.Change (L105) → FileUpload?parentId={요청ID} (여러 파일), [E2] fileUploadForm.SubmitComplete (L115) → resetFileUpload() L313-328 + fileList.retrieve(), [E6] fileUpload.Change (L320)
  const onFilesChange = async (files: File[]) => {
    if (!model || files.length === 0) return;
    try {
      for (const file of files) await fileApi.upload(model.userRequestId, file);
    } catch (err) {
      message.error(errorMessage(err, '파일 올리기 실패'));
    }
    await fileList.current?.retrieve();
  };

  const area = (h: number, v: string, set?: (s: string) => void) => (
    <Input.TextArea style={{ height: h, resize: 'none' }} value={v} readOnly={!set} disabled={!enabled}
      onChange={set ? e => set(e.target.value) : undefined} />
  );
  const text = (v?: string | null) => <Input readOnly disabled={!enabled} value={v ?? ''} />;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', background: '#F7F8FC', minHeight: 270 }}>
          <div style={{ width: 250, padding: 20, boxSizing: 'content-box' }}>
            <Field label="요청일자" width={120}>{text(model?.regDate)}</Field>
            <Field label="요청자" width={120}>{text(model?.personName)}</Field>
            {/* confirmYn: 요청자확인여부 체크박스 */}
            <Field label="확인여부" width={120}>
              <Checkbox disabled={!enabled} checked={confirmYn} onChange={e => setConfirmYn(e.target.checked)} />
            </Field>
          </div>
          <div style={{ width: 550, padding: 20, boxSizing: 'content-box' }}>
            <Field label="법규명" width={450}>{text(model?.lawTitle)}</Field>
            <div style={{ display: 'flex', marginBottom: 10 }}>
              {/* [E5] anchor.MouseDown (L176) → Ics17_Lookup_LawContent.open(userRequestModel, "admin", callback) L176-189: 돌려받은 행으로 법규내용·그리드 행을 바꾼다 */}
              <Tooltip title="클릭 시, 팝업으로 보기" placement="right">
                <a style={{ width: LABEL_W, flex: 'none', lineHeight: '32px', fontWeight: 'bold', color: '#000', textDecoration: 'none' }}
                  onMouseDown={() => model && setLawModel(model)}>법규내용 :</a>
              </Tooltip>
              <div style={{ width: 450 }}>{area(165, model?.lawContent ?? '')}</div>
            </div>
            <Field label="보고주기" width={450}>{text(model?.reportCycle)}</Field>
          </div>
          <div style={{ width: 600, padding: 20, boxSizing: 'content-box' }}>
            <Field label="보고처" width={500}>{text(model?.submitTo)}</Field>
            <Field label="법규조항" width={500}>{text(model?.relatedLaw)}</Field>
            <Field label="서식파일" width={500} bottom={25}>
              <Ics17_Grid_FileList ref={fileList} parentId={model?.userRequestId} />
            </Field>
          </div>
          <div style={{ width: 120, padding: 20, boxSizing: 'content-box', display: 'flex', alignItems: 'flex-end' }}>
            {/* [E3] uploadFileButton[파일등록].Select (L156) → fileUpload.click() */}
            <Button type="upload" disabled={!enabled} onClick={() => fileUpload.current?.click()}>파일등록</Button>
            <FileUpdownForm ref={fileUpload} onChange={() => undefined} onChangeFiles={onFilesChange} />
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ width: 250, padding: 20, boxSizing: 'content-box' }}>
            <Field label="진행상태" width={120} bottom={10}>
              <SystemCodeComboBox kindCd="AfterStateCode" style={{ width: 120 }} disabled={!enabled} value={stateCode}
                onChange={code => setStateCode(code)} />
            </Field>
            <Field label="완료일" width={120}>
              <DatePicker style={{ width: 140 }} disabled={!enabled} value={closeDate ? dayjs(closeDate) : null}
                onChange={d => setCloseDate(d ? d.format('YYYY-MM-DD') : null)} />
            </Field>
          </div>
          <div style={{ width: 550, padding: 20, boxSizing: 'content-box' }}>
            <Field label="처리내용" width={450} bottom={25}>{area(160, result, setResult)}</Field>
          </div>
          <div style={{ width: 600, padding: 20, boxSizing: 'content-box' }}>
            <Field label="비고" width={500} bottom={25}>{area(160, note, setNote)}</Field>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', padding: '12px 0', flex: 'none' }}>
        <Button type="save" disabled={!enabled} onClick={updateRow}>저장</Button>
      </div>
      <Ics17_Lookup_LawContent model={lawModel} userType="admin" onSaved={onSaved} onClose={() => setLawModel(null)} />
    </div>
  );
};
