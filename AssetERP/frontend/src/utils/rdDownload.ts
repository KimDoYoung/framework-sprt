/**
 * RD(Report Designer) 내려받기 — AS-IS RDUtil.download(mode, param, rvParam, callback) (client/service/RDUtil.java L36-71).
 * 보이지 않는 form을 숨은 iframe으로 제출해 파일을 받는다(`Content-Disposition: attachment`라 화면은 그대로).
 * 주소는 `rdApi.buildUrl({kind: 'download', …})`로 발급받아 넘긴다(docs/RD-대책.md).
 * 내려받기 응답은 `load`가 안 오는 브라우저가 있어, 오지 않아도 `waitMs` 뒤에는 끝난 것으로 본다(AS-IS도 결과 글자를 못 읽으면 success로 처리).
 */
import { RdUrlRes } from '@/api/rd';

export function rdDownload({ url, method }: RdUrlRes, waitMs = 5000): Promise<void> {
  return new Promise<void>(resolve => {
    const name = `rd_download_${Date.now()}`;
    const iframe = document.createElement('iframe');
    iframe.name = name;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    let form: HTMLFormElement | null = null;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      form?.remove();
      iframe.remove();
      resolve();
    };
    const timer = window.setTimeout(finish, waitMs);
    iframe.addEventListener('load', finish);

    if (method === 'GET') {
      iframe.src = url;
      return;
    }
    form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    form.target = name;
    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
  });
}
