/**
 * I/F 설정 편집 폼 (D01) — Ifi90_Tab_Config 아래쪽
 * AS-IS: myApp/client/vi/ifi/Ifi90_Edit_Config.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor() L95-166: 왼쪽(490) = I/F코드(290)·방식(180) / I/F명(470) / 비고(470×115)
 *   | 가운데 [Local](540, 배경 #F7F8FC, 테두리) = Host(370)·Port(130) / 계정ID(250)·계정PW(250) / Path / Key
 *   | 오른쪽 [Target](540, 같은 모양). 라벨 폭 70. 버튼 줄(L84, 높이 50) = 저장.
 * 선택한 행이 없으면 비활성(AS-IS editConfig.setEnabled(false)). 부르는 쪽은 key={선택 ID-조회 횟수}로 다시 만든다 (AS-IS retrieve()의 editDriver.edit(model)).
 * 계정PW(localPwDec·targetPwDec)는 원본처럼 입력은 되지만 서버가 저장하지 않는다 — 원본 UpdateDataModel이 *_pw_dec 컬럼을 쓰지 않는다 (D01 작업기록 제안)
 */
import React, { useState } from 'react';
import { Input, message, Typography } from 'antd';
import { ifiApi } from '@/api/ifi';
import { errorMessage } from '@/api/client';
import { IfiConfig } from '@/types/ifi';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

const ROW: React.CSSProperties = { display: 'flex', alignItems: 'center', marginBottom: 10 };
const BOX: React.CSSProperties = { width: 540, background: '#F7F8FC', border: '1px solid #d9d9d9', padding: '5px 10px 0 5px', boxSizing: 'border-box', flex: 'none' };

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography.Text strong style={{ width: 70, flex: 'none' }}>{children}</Typography.Text>
);

interface Props {
  /** 선택한 설정 — 없으면 비활성 */
  model: IfiConfig | null;
  /** 저장 뒤 그리드 행을 바꾼다 (AS-IS GridUpdate가 store를 갱신). 신규 행은 임시 ID(oldId)가 실제 ID로 바뀐다 */
  onSaved: (oldId: number, row: IfiConfig) => void;
}

export const Ifi90_Edit_Config: React.FC<Props> = ({ model, onSaved }) => {
  const disabled = !model;
  const [form, setForm] = useState<IfiConfig>(model ?? { configId: 0 });
  const set = (patch: Partial<IfiConfig>) => setForm(prev => ({ ...prev, ...patch }));
  const text = (key: keyof IfiConfig) => ({
    value: (form[key] as string | null | undefined) ?? '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set({ [key]: e.target.value }),
  });

  // [E1] updateButton[저장].Select (L87) → update() L181-210: I/F코드·I/F명·방식 검사 → 서비스 ifi.Ifi90_Config.update → "저장이 완료되었습니다."
  const update = async () => {
    if (!model) return;
    if (!form.ifCode) { message.warning('I/F코드를 입력하세요'); return; }
    if (!form.ifName) { message.warning('I/F명을 입력하세요'); return; }
    if (!form.ifType) { message.warning('방식을 선택하세요'); return; }
    try {
      const saved = await ifiApi.updateConfig(form);
      message.success('저장이 완료되었습니다.');
      onSaved(model.configId, saved);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L68-93) → getEditor() L95-166
  return (
    <div style={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : undefined, background: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', alignItems: 'flex-start', gap: 10, padding: '20px 10px 0' }}>
        <div style={{ width: 490, flex: 'none' }}>
          <div style={ROW}>
            <Label>I/F코드</Label>
            <Input style={{ width: 200 }} {...text('ifCode')} />
            <span style={{ width: 20 }} />
            <Label>방식</Label>
            <SystemCodeComboBox kindCd="InterfaceType" style={{ width: 100 }} value={form.ifType ?? undefined}
              onChange={(code, name) => set({ ifType: code ?? null, ifTypeName: name ?? null })} />
          </div>
          <div style={ROW}><Label>I/F명</Label><Input style={{ width: 400 }} {...text('ifName')} /></div>
          <div style={{ ...ROW, alignItems: 'flex-start' }}>
            <Label>비고</Label>
            <Input.TextArea style={{ width: 400, height: 115, resize: 'none' }} {...text('note')} />
          </div>
        </div>
        <div style={BOX}>
          <Typography.Text strong>[Local]</Typography.Text>
          <div style={{ ...ROW, marginTop: 10 }}>
            <Label>Host</Label><Input style={{ width: 290 }} {...text('localHost')} />
            <span style={{ width: 10 }} />
            <Label>Port</Label><Input style={{ width: 60 }} {...text('localPort')} />
          </div>
          <div style={ROW}>
            <Label>계정ID</Label><Input style={{ width: 150 }} {...text('localAccount')} />
            <span style={{ width: 10 }} />
            <Label>계정PW</Label><Input style={{ width: 150 }} {...text('localPwDec')} />
          </div>
          <div style={ROW}><Label>Path</Label><Input style={{ width: 400 }} {...text('localPath')} /></div>
          <div style={ROW}><Label>Key</Label><Input style={{ width: 400 }} {...text('localKey')} /></div>
        </div>
        <div style={BOX}>
          <Typography.Text strong>[Target]</Typography.Text>
          <div style={{ ...ROW, marginTop: 10 }}>
            <Label>Host</Label><Input style={{ width: 290 }} {...text('targetHost')} />
            <span style={{ width: 10 }} />
            <Label>Port</Label><Input style={{ width: 60 }} {...text('targetPort')} />
          </div>
          <div style={ROW}>
            <Label>계정ID</Label><Input style={{ width: 150 }} {...text('targetAccount')} />
            <span style={{ width: 10 }} />
            <Label>계정PW</Label><Input style={{ width: 150 }} {...text('targetPwDec')} />
          </div>
          <div style={ROW}><Label>Path</Label><Input style={{ width: 400 }} {...text('targetPath')} /></div>
          <div style={ROW}><Label>Key</Label><Input style={{ width: 400 }} {...text('targetKey')} /></div>
        </div>
      </div>
      <div style={{ flex: 'none', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button type="save" onClick={update}>저장</Button>
      </div>
    </div>
  );
};
