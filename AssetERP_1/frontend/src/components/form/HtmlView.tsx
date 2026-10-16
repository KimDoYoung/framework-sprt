import React from 'react';

/**
 * HTML 보기 전용 (AS-IS 읽기 전용 CKEditor/iframe — setHtmlTextView). 스크립트는 막고(sandbox) 글자만 보여 준다.
 *   <HtmlView html={reason} height={160} />
 */
interface Props {
  html?: string | null;
  height?: number | string;
}

export const HtmlView: React.FC<Props> = ({ html, height = 160 }) => (
  <iframe
    title="html-view"
    sandbox=""
    srcDoc={`<html><body style="margin:8px;font:14px/1.5 sans-serif;word-break:break-all">${html ?? ''}</body></html>`}
    style={{ width: '100%', height, border: '1px solid #d9d9d9', borderRadius: 4, background: '#fff', display: 'block' }}
  />
);
