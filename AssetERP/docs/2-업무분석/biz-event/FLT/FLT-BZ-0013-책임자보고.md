# FLT-BZ-0013 준법감시인이 대표이사에게 임직원매매 책임자보고를 올린다

> **한 줄 요약** — 준법감시인은 매월 #1464 임직원매매 책임자보고에서 연월·재직구분을 골라 세 탭 — **보고대상자**(월별 보고자의 신고일자), **계좌**(기준일 신고 계좌), **매매명세**(월 보고자는 그달, 분기 보고자는 3·6·9·12월에 그 분기 매매) — 을 확인하고 [결재요청]으로 **임직원매매 책임자보고**(링크코드 A72) 결재를 대표이사에게 올린다. 그달 보고가 이미 있으면 [문서보기]만 된다. 엑셀로 내려받는다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 준법감시인(kalpa 과장 301) → 대표이사(100 김사장) |
| 언제 | 매월 |
| 먼저 있어야 하는 것 | FLT-BZ-0004 계좌신고, 0008 정기보고(분기 보고자), **A72 문서분류**(kalpa·회사 0·28000 모두 비어 있었음 — 다른 링크와 겹치지 않는 분류여야 함, ⚠#230) |
| 다음 이벤트 | — |
| 실제 실행 | kalpa, 2026-11-14, API. ① 2026년 11월(재직 `100`): 보고대상자 0 · 계좌 2 · 매매명세 0 — 401은 **분기 보고자**라 11월에는 안 나옴(월 보고자 `2`만, 분기 보고자는 분기 말월). AS-IS 0 = 0 · 2 = 2 · 0 = 0. ② 2026년 12월: 매매명세 4행(계좌대체 삼성전자 20 · 무상증자 8 · 매수 SK하이닉스 10 · 매도 카카오 30, "매매없음" 표시는 12월 자체 매매가 없어서), AS-IS 4 = 4(17열). ③ A72를 A09와 같은 문서분류로 지정했더니 12월 결재 상태가 A09 정기보고를 "완료"로 보여 줌(⚠#230) → A72를 `컴플라이언스/임직원 금융투자상품 매매/…이상매매 보고(소명서 징구)`로 바꿈. ④ `yunhee biz-appr A72`는 연결 API를 몰라 멈춤 → 결재 API로 직접: 301 `GET /apr/apprs/new` → `PUT /apr/apprs/{id} {mode:request, linkCode:A72, effectDate:2026-12-01, 결재선 301→100}` → 100 `POST …/confirm` → `GET /flt/ceo-reports/apprs?startDate=2026-12-01` "완료"(`202611149150250`). 사원 401도 세 탭 API가 됨(⚠#229 보강) |
| 메뉴 | #1464 준법감시 > 11. 임직원매매(준감인) > 임직원매매 책임자보고. kalpa 메뉴 없음. 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 준감인 | #1464 | 연도·월·재직구분 → [조회] (`GET /flt/ceo-reports/report-persons·accounts·trs?stdDate=월말&startDate=월초&transCode=`, 결재 상태 `…/apprs?startDate=`) | 세 탭, 그달 보고가 있으면 [문서보기] |
| 2 | 〃 | 〃 | [결재요청] → 문서분류(A72) → 결재문서(본문·결재선 대표이사) → [상신] | A72 결재 진행 |
| 3 | 대표이사 | 결재문서 창 | [승인] | 보고 완료 |
| 4 | 준감인 | #1464 | [엑셀다운로드] (`GET …/excel`) | 보고 자료 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `apr01_appr` | A72 책임자보고(2026년 12월, 완료) | +1 |
| `dcr30_link` | kalpa A72 → `…/이상매매 보고(소명서 징구)` | 갱신(남겨 둠) |

## 업무 규칙 · 주의

- 재직구분 `100` = 퇴직(900) 빼고 전부(겸직자는 재직으로), `900` = 퇴직, `800`.
- 비상근 포함 여부는 회사 설정(`sys01_ics_non_stay_yn`), 겸직 행은 뺀다. 회사 기준 "계좌 없으면 정기보고 안 함"이면 계좌 없는 사원을 뺀다.
- 결재 여부를 문서분류·시행월로만 판단한다 → [의심 #230](../../보안_및_버그_의심.md). A72용 문서분류는 다른 링크와 따로 둬야 한다.
- `biz-appr`가 A72처럼 **업무 행과 연결하지 않는**(링크코드·시행월로만 찾는) 결재를 지원하지 않는다 — 연결 단계 없이 상신·승인만 하는 옵션이 필요하다(yunhee 수정사항 후보).

<details>
<summary>근거</summary>

- AS-IS: `Flt10_Tab_CeoReport`(#1464 E0~E9: retrieve, apprChk → `Apr01_Appr.selectByLinkCode` L73, dcrChk L353-377 → `insertLinkApproval` L379-395(A72, stdDate·stdDateStr)), 탭 `Flt10_TabPage_ReportPerson`(`flt10_tr.selectByStdDate`)·`Flt03_TabPage_Account`(`flt03_account.selectByStdDate`)·`Flt10_TabPage_TrList`(`flt10_tr.selectByStdDate2`, `<include refid="flt10_tr.selectEmp2"/>`).
- TOBE: `FltCeoReportController`(`/api/v1/flt/ceo-reports/report-persons`·`/accounts`·`/trs`·`/apprs`·`/excel`), `FltCeoReportMapper.xml` `ceoEmp` L50-154·`selectReportPersons` L157, 프론트 `Flt10_Tab_CeoReport.tsx` L39(transCode)·L52(기간)·L120·L137.
</details>
