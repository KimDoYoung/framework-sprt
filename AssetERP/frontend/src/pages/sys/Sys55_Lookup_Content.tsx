/**
 * 화면안내 창 (EE103) — 회사가 메뉴마다 써 둔 화면안내를 보여 주거나(view) 작성한다(open)
 * AS-IS: myApp/client/vi/sys/Sys55_Lookup_Content.java (292줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, IDMS-IC)
 * view(model, checkBoxYn) L68-157: 700×700 "화면안내", HTML 읽기 전용, 아래 가운데 [닫기]
 *   ※ [다시 표시하지 않음] 체크(checkBox L99-120)는 원본 2026-11-05에 다시 켜졌지만(view(…, true) — 메뉴를 열 때 자동으로 띄울 때만) TOBE에는 그 자동 표시(MenuOpener·MenuInfoNotice)가 없어
 *   13-누락대장으로 넘겼다 — 만들지 않았다(E2·setMenuInfo L233-263 도달 불가)
 * open(menuModel, callback) L159-200: 700×700 "화면안내 작성", HTML 편집기, 아래 가운데 [저장][닫기]
 * 호출처: view = Emp91_Lookup_List(보기 아이콘), MenuOpener(메뉴 열 때 자동) / open = Sys55_Tab_MenuGuideCompany(TOBE 미변환 — 연결 없음)
 * 스타일: MH (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { Space, message } from 'antd';
import { sysMenuGuideContentApi } from '@/api/sys';
import { empMenuInfoNoticeApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { HtmlView } from '@/components/form/HtmlView';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';

interface Props {
  open: boolean;
  /** 'view' = view(model, checkBoxYn) 읽기 / 'edit' = open(menuModel, callback) 작성 */
  mode: 'view' | 'edit';
  /** menuModel.getMenuGuideCompanyId() — 없으면 새로 넣는다 (edit) */
  menuGuideCompanyId?: number | null;
  /** menuModel.getMenuId() (edit) */
  menuId?: number | null;
  /** 보여 줄(view)·고칠(edit) HTML */
  content: string | null;
  /** callback.execute() — 작성 창 [닫기] (edit) */
  onCallback?: () => void;
  onClose: () => void;
}

export const Sys55_Lookup_Content: React.FC<Props> = ({ open, mode, menuGuideCompanyId, menuId, content, onCallback, onClose }) => {
  const [html, setHtml] = useState('');
  const [guideId, setGuideId] = useState<number | null>(null);
  const [editorKey, setEditorKey] = useState(0);

  // [E0] 화면 열림 — view() L68-157 / open() L159-200 → setHtmlText(content) → show()
  useEffect(() => {
    if (!open) return;
    setHtml(content ?? '');
    setGuideId(menuGuideCompanyId ?? null);
    setEditorKey(k => k + 1);
  }, [open, content, menuGuideCompanyId]);

  // [E3] updateButton[저장].Select (L183) → update() L202-217: 서비스 sys.Sys55_MenuGuideCompany.upsertContent(updateModel, companyId, content)
  //      → deleteEmp91() L219-231: 서비스 emp.Emp91_MenuInfoNotice.deleteMenuId(companyId, menuId) → SimpleMessage("저장이 완료되었습니다.")
  const update = async () => {
    try {
      const saved = await sysMenuGuideContentApi.save(guideId, menuId ?? null, html);
      // L213 menuModel.setMenuGuideCompanyId(menuGuideCompanyModel.getMenuGuideCompanyId()) — 원본 2026-11-05(CH-0205)에 회사 ID → 화면안내 ID로 고쳐짐
      setGuideId(saved.menuGuideCompanyId);
      if (menuId != null) await empMenuInfoNoticeApi.removeByMenu(menuId);
      message.success('저장이 완료되었습니다.');
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <LookupModal
      open={open}
      title={mode === 'view' ? '화면안내' : '화면안내 작성'}
      width={700}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          {mode === 'view' ? (
            /* [E1] closeButton[닫기].Select (L92) → hide() */
            <Button type="close" onClick={onClose}>닫기</Button>
          ) : (
            <Space>
              {/* [E3] updateButton[저장].Select (L183) → update() */}
              <Button type="save" onClick={() => void update()}>저장</Button>
              {/* [E4] closeButton[닫기].Select (L189) → callback.execute(), hide() */}
              <Button type="close" onClick={() => { onCallback?.(); onClose(); }}>닫기</Button>
            </Space>
          )}
        </div>
      }
    >
      {mode === 'view'
        ? <HtmlView html={content} height={560} />
        : <HtmlEditor toolbar="client" key={editorKey} value={content} onChange={setHtml} height={520} />}
    </LookupModal>
  );
};
