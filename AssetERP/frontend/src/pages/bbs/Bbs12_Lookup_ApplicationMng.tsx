/**
 * 신청구분 내용 양식 창 — Bbs11_Tab_ApplicationMng의 [신청구분별 내용관리]에서 연다 (T22)
 * AS-IS: myApp/client/vi/bbs/Bbs12_Lookup_ApplicationMng.java (246줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L76-135: 모달 1280×700 "신청구분 내용 양식", 위 안내문(※ 공개여부 …) + 오른쪽 새로고침 아이콘, 왼쪽 그리드 280(신청구분 155·공개여부 70, 단일 선택·공개여부 체크 편집)
 *   · 가운데 편집기 650(PC 양식) · 오른쪽 모바일 양식 350(텍스트 영역), 아래 가운데 [저장][닫기]
 * 편집창 규격(11 §4a): 머리말 아래 선·푸터 위 선·가운데 [저장][닫기]
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Modal, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { bbsApplicationFormApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import { BbsApplicationForm } from '@/types/bbs';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { HtmlEditor } from '@/components/form/HtmlEditor';

const gb = gbFor<BbsApplicationForm>();

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Bbs12_Lookup_ApplicationMng: React.FC<Props> = ({ open, onClose }) => {
  const [rows, setRows] = useState<BbsApplicationForm[]>([]);
  const [selected, setSelected] = useState<BbsApplicationForm | null>(null);
  const [mobi, setMobi] = useState('');
  const [saving, setSaving] = useState(false);
  // 편집기 내용(AS-IS getHtmlText()) — 고치지 않았으면 null, 저장 때 원래 내용을 그대로 둔다(편집기가 HTML을 다시 쓰므로)
  const html = useRef<string | null>(null);
  // 공개여부를 고친 행: id → 행 (AS-IS 그리드 변경 레코드)
  const modified = useRef<Map<number, BbsApplicationForm>>(new Map());

  // retrieve() L179-188: bbs.Bbs12_ApplicationForm.selectByCompanyId(companyId)
  const retrieve = async () => {
    try {
      const list = await bbsApplicationFormApi.search();
      modified.current = new Map();
      html.current = null;
      setSelected(null);
      setMobi('');
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L76-135, open L68-74) → settings(), show() · formCheck() L190-202 뒤 retrieve()
  useEffect(() => {
    if (open) void retrieve();
  }, [open]);

  // [E2] grid.RowClick (L140) → 편집기·모바일 칸에 선택한 양식의 내용을 넣는다
  const onSelect = (row: BbsApplicationForm | undefined) => {
    html.current = null;
    setSelected(row ?? null);
    setMobi(row?.contentMobi ?? '');
  };

  // [E3] updateButton[저장].Select (L156) → update() L204-207, modelUpdate() L209-227
  const save = async () => {
    setSaving(true);
    try {
      const changed = [...modified.current.values()];
      if (changed.length > 0) await bbsApplicationFormApi.update(changed);
      if (selected) {
        await bbsApplicationFormApi.updateContent(selected.applicationFormId, html.current ?? selected.content ?? '', mobi);
      }
      message.success('저장이 완료되었습니다.');
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // buildGrid() L172-177
  const columnDefs = useMemo(() => [
    gb.text('appTypeName', 155, '신청구분'),  // L174
    gb.boolean('publicYn', 70, '공개여부', {  // L175 addBoolean — 체크 값이 바뀌면 변경 행으로 기록
      editable: true,
      onCellValueChanged: p => { modified.current.set(p.data!.applicationFormId, p.data!); },
    }),
  ], []);

  return (
    <Modal
      open={open}
      title="신청구분 내용 양식"
      width={1280}
      maskClosable={false}
      destroyOnClose
      onCancel={onClose}
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 }, footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 } }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={save} loading={saving}>저장</Button>
            {/* [E4] cancleButton[닫기].Select (L163) → callback(), hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 560, display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 2px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #d9d9d9', padding: '0 10px', height: 45, boxSizing: 'border-box' }}>
          <span style={{ fontSize: 12, color: '#000' }}>※ 공개여부 체크 : 기타신청 화면에서 다른 임직원의 신청 내역도 조회됩니다. ( 중앙 : PC양식 / 우측 : 모바일양식 )</span>
          {/* [E1] anchor.MouseDown (L87) → retrieve() */}
          <ReloadOutlined style={{ cursor: 'pointer' }} onClick={retrieve} />
        </div>
        <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
          <div style={{ width: 280, boxSizing: 'border-box' }}>
            <SingleGrid<BbsApplicationForm> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.applicationFormId)} onSelect={onSelect} />
          </div>
          <div style={{ width: 650, boxSizing: 'border-box', border: '1px solid #d9d9d9', marginLeft: -1, position: 'relative' }}>
            {selected ? (
              <HtmlEditor key={selected.applicationFormId} value={selected.content} onChange={h => { html.current = h; }} height={500} />
            ) : null}
          </div>
          <div style={{ width: 350, boxSizing: 'border-box', marginLeft: -1 }}>
            <Input.TextArea
              style={{ height: '100%', resize: 'none' }}
              disabled={!selected}
              value={mobi}
              onChange={e => setMobi(e.target.value)}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
