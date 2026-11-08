/**
 * 게시물 댓글 첨부파일 조회창 (Z13) — Bbs32_TapPage_Comment의 "파일(n)" 칸에서 연다
 * AS-IS: myApp/client/vi/bbs/Bbs32_Lookup_FileList.java (255줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L76-128: 모달 "첨부파일" 650×350, 툴바 [파일업로드] + 그리드(buildFileGrid L154-208: 첨부파일 440 · 보기 50 · 받기 50 · 삭제 50), 아래 가운데 [닫기]
 * open() L63-74: 댓글 작성자 본인에게만 [파일업로드]가 보인다. 파일의 parentId는 댓글 ID.
 * 공지사항 댓글 첨부 창(Bbs07_Lookup_FileList, H01)과 클래스 본문이 글자 그대로 같다(다른 것은 모델 이름뿐 — Bbs32_CommentModel·Bbs07_CommentModel이 같은 모양)
 * → 그 창을 그대로 쓴다. 첨부는 parentId(댓글 ID)로만 찾으므로 게시물 댓글에도 같은 파일 API가 맞는다.
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import { Bbs07_Lookup_FileList } from './Bbs07_Lookup_FileList';

// 이벤트는 Bbs07_Lookup_FileList가 같은 번호로 처리한다 (그 파일의 [E0]~[E6] 주석 참조):
// [E0] 화면 열림 (생성자 L76-128) → settings(), show()
// [E1] fileUpload.Change (L91) → FileUpload?parentId=commentId
// [E2] fileUploadForm.SubmitComplete (L101) → retrieve()
// [E3] uploadFileButton[파일업로드].Select (L131) → fileUpload.click()
// [E4] fileDeleteForm.SubmitComplete (L139) → retrieve()
// [E5] closeButton[닫기].Select (L145) → callback.execute(), hide()
// [E6] msgBox.DialogHide [YES] (L173) → checkFileDelete()

export const Bbs32_Lookup_FileList = Bbs07_Lookup_FileList;
