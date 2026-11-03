/** 메일 발송창 (EE35: Dcr10_Lookup_MailSender_20261027) */
import { FileInfo } from './sys';

/** 열 때 받는 값 (AS-IS retrieve()·checkSender2()·selectApprRelateDoc) */
export interface DcrMailSenderInit {
  senderEmail?: string | null;
  /** 로그인 회사의 메일서버정보 (AS-IS LoginUser.getMailInfo — 일괄 발송 이력의 보낸이 칸에 들어간다) */
  mailInfo?: string | null;
  officeTelno?: string | null;
  mobileTelno?: string | null;
  publicMailAllowed: boolean;
  files: FileInfo[];
}

/** AS-IS sendMailSession(Test) 파라미터 */
export interface DcrMailSendReq {
  apprId?: number | null;
  receptor: string;
  ccReceptor: string;
  header: string;
  content: string;
  publicCheck?: string | null;
  privacyInfo: boolean;
  testYn: boolean;
  fileIds: number[];
}

/** ok=false면 message를 띄운다 (AS-IS ServiceResult status -1) */
export interface DcrMailSendRes {
  ok: boolean;
  message?: string | null;
}

/** AS-IS dcr.Dcr10_MailHistory.insertMailHistory */
export interface DcrMailHistorySaveReq {
  apprId?: number | null;
  senderEmail: string;
  receiverEmail: string;
  referencerEmail: string;
  titleText: string;
  bodyText: string;
  fileIds: number[];
}

/** 공용메일 조회창 한 행 (AS-IS Cmp10_Lookup_MailBookList) */
export interface DcrPublicMail {
  mailBookId: number;
  emailAddr: string;
  note?: string | null;
}

/** 본인 메일 계정 (AS-IS Emp10_Lookup_MailRetrieve) */
export interface EmpPersonMail {
  mailAddress?: string | null;
  password?: string | null;
}

export interface EmpMailCheck {
  ok: boolean;
  message?: string | null;
}
