/** 공용메일 한 행 (GET /api/v1/cmp/mail-books, AS-IS Cmp10_MailBookModel, G13). decPassword = 복호화한 비밀번호 */
export interface CmpMailBook {
  mailBookId: number;
  emailAddr?: string | null;
  note?: string | null;
  decPassword?: string | null;
}

/** 공용메일 권한자 한 행 (GET /api/v1/cmp/mail-books/{id}/roles, AS-IS Cmp11_MailRoleModel, G13). 임시 행은 mailRoleId가 음수 */
export interface CmpMailRole {
  mailRoleId: number;
  mailBookId?: number | null;
  personId?: number | null;
  orgName?: string | null;
  titleName?: string | null;
  empNo?: string | null;
  empKorName?: string | null;
}

/** 공용메일 검증 결과 (POST /api/v1/cmp/mail-books/check) */
export interface CmpMailCheck {
  ok: boolean;
  message: string;
}
