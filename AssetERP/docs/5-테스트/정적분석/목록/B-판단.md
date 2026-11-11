# B 판단 (2026-11-11, 14건)
원인을 보고 고친다. 동작이 바뀌면 AS-IS 동작과 맞는지 확인(`yunhee api`)하고, 애매하면 사용자에게 묻는다.

| ID | 우선 | 도구 | 규칙 | 위치 | 내용 |
|:---|:---|:---|:---|:---|:---|
| CH-pmd-74b8981d | 보통 | PMD | `PreserveStackTrace` | `backend/src/main/java/kr/co/kfs/asseterp/common/mail/AssetMailClient.java:89` | Thrown exception does not preserve the stack trace of exception 'e' on all code paths |
| CH-pmd-e4f44962 | 보통 | PMD | `PreserveStackTrace` | `backend/src/main/java/kr/co/kfs/asseterp/common/mail/AssetMailClient.java:91` | Thrown exception does not preserve the stack trace of exception 'e' on all code paths |
| CH-pmd-adbe0ce3 | 보통 | PMD | `PreserveStackTrace` | `backend/src/main/java/kr/co/kfs/asseterp/common/mail/AssetMailClient.java:104` | Thrown exception does not preserve the stack trace of exception 'e' on all code paths |
| CH-pmd-02c437ed | 보통 | PMD | `PreserveStackTrace` | `backend/src/main/java/kr/co/kfs/asseterp/common/mail/AssetMailClient.java:119` | Thrown exception does not preserve the stack trace of exception 'e' on all code paths |
| CH-pmd-30382d71 | 보통 | PMD | `PreserveStackTrace` | `backend/src/main/java/kr/co/kfs/asseterp/common/mail/AssetMailClient.java:121` | Thrown exception does not preserve the stack trace of exception 'e' on all code paths |
| CH-pmd-1db9e394 | 보통 | PMD | `PreserveStackTrace` | `backend/src/main/java/kr/co/kfs/asseterp/common/mail/AssetMailClient.java:123` | Thrown exception does not preserve the stack trace of exception 'e' on all code paths |
| CH-pmd-72e7aa4c | 보통 | PMD | `PreserveStackTrace` | `backend/src/main/java/kr/co/kfs/asseterp/common/mail/AssetMailClient.java:125` | Thrown exception does not preserve the stack trace of exception 'e' on all code paths |
| CH-pmd-4ce0d7a5 | 보통 | PMD | `PreserveStackTrace` | `backend/src/main/java/kr/co/kfs/asseterp/common/mail/AssetMailClient.java:127` | Thrown exception does not preserve the stack trace of exception 'e' on all code paths |
| CH-pmd-2ecaf306 | 보통 | PMD | `PreserveStackTrace` | `backend/src/main/java/kr/co/kfs/asseterp/common/mail/AssetMailClient.java:130` | Thrown exception does not preserve the stack trace of exception 'e' on all code paths |
| CH-pmd-c38956f8 | 보통 | PMD | `PreserveStackTrace` | `backend/src/main/java/kr/co/kfs/asseterp/common/mail/AssetMailClient.java:133` | Thrown exception does not preserve the stack trace of exception 'e' on all code paths |
| CH-spotbugs-c7634999 | 보통 | SpotBugs | `BX_UNBOXING_IMMEDIATELY_REBOXED` | `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/dto/UnLeaveLinkRow.java:15` | [PERFORMANCE] Boxed value is unboxed and then immediately reboxed |
| CH-spotbugs-826313c8 | 보통 | SpotBugs | `BX_UNBOXING_IMMEDIATELY_REBOXED` | `backend/src/main/java/kr/co/kfs/asseterp/biz/emp/dto/UnLeaveNoticeRow.java:19` | [PERFORMANCE] Boxed value is unboxed and then immediately reboxed |
| CH-spotbugs-d97c91d6 | 보통 | SpotBugs | `POTENTIAL_XML_INJECTION` | `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/AprPdfService.java:89` | [SECURITY] An unsafe string is potentially injected into an XML string — 12곳: 89, 94, 96, 98, 99, 101, 104, 112, 116, 120, 122, 124 |
| CH-spotbugs-86c8d951 | 보통 | SpotBugs | `REC_CATCH_EXCEPTION` | `backend/src/main/java/kr/co/kfs/asseterp/common/mail/AssetMailClient.java:87` | [STYLE] Exception is caught when Exception is not thrown |
