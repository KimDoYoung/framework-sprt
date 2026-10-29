# SID 샘플 만들기 목록

작성 2026-10-29. 신규 SID 5개(`docs/page-style.md`에 초안으로 등록)의 견본을 만들기 위해 사용자가 검토할 화면 목록이다.
흐름: 대표 화면을 열어 확인·수정 → 확정하면 `docs/page-style/{SID}/`에 복사 + `page-style.md`에 상세 절 → 같은 SID 화면을 맞춘다. 판별기 규칙은 `docs/yunhee-page-style-판별.md`.
화면은 독립으로 유지한다(레이아웃 프레임 부품은 만들지 않는다, `PageTabs`만 공유).

## 1. 검토할 대표 화면

| 상태 | SID | 화면번호 | 클래스 | 비고 |
|:---|:---|:---:|:---|:---|
| 확정 | SGHF | 1131 | `Biz01_Tab_Card` | 조회 줄 + 그리드 + 편집 폼을 좌우로 배치 |
| 확정 | MG | 1066 | `Sys90_Tab_AfterService` | 조회 줄 + 그리드 여러 개 + 폼, 위아래 분할 아님 |
| 확정 | TO | 1028 | `Org01_Tab_OrgCode` | 트리 중심, 편집은 팝업. 같은 클래스가 1451에도 있음 |
| 확정 | GO | 1459 | `Tdm54_Tab_CheckInsuff` | 그리드 하나, 조회 툴바 없음 |
| 확정 | DB | 1495 | `Tdm50_Tab_TotalDashboard` | 그리드·트리·툴바 없이 카드/요약 |

상태: `대기` → `검토중` → `확정`(견본 폴더에 복사 완료).

## 2. 같은 SID로 묶어 나중에 맞출 화면

| SID | 화면번호 · 클래스 |
|:---|:---|
| SGHF | 1132 `Biz01_Tab_Other`, 1138 `Biz01_Tab_CardContents`, 1319 `Biz01_Tab_CardSimple`, 1320 `Biz01_Tab_OtherSimple`, 1321 `Biz01_Tab_CardContentsSimple` |
| MG | 1121 `Sys90_Tab_AfterServiceAdmin`, 1256 `Ics20_Tab_RevisionHistory`, 1257 `Ics20_Tab_RevisionHistoryAdmin`, 1367 `Sms03_Tab_SendAdmin` |
| TO | 1244 `Chk01_Tab_ClassTree`, 1116 `Fbx01_Tab_Document` |
| GO | 1305 `Sms02_Tab_TotalCount`, 1306 `Sys10_Tab_TotalSize` |
| DB | 1467 `Tdm35_Tab_TaskList` |

대표 화면을 확정한 뒤, 이 화면들이 실제로 같은 모양인지 확인한다. 다르면 SID를 나누거나 다른 SID로 옮긴다.

## 3. SID가 아직 정해지지 않은 화면 (열어서 확인 필요)

구조를 자식 컴포넌트에 맡겨서 판별기가 읽지 못한 화면이다. 열어 본 뒤 어느 SID에 넣을지 제안한다.

| 화면번호 | 클래스 |
|:---:|:---|
| 1002 | `Dcr01_Tab_DcrUser` |
| 1247 | `Sys07_Tab_Company` |
| 1369 | `Flt00_Tab_Info` |
| 1370 | `Flt10_Tab_ViolateUser` |
| 1455 | `Tdm50_Tab_CheckJob` |

## 4. 기존 SID에 편입할 화면 (새 견본 불필요, `스타일:` 표시만)

| SID | 화면번호 · 클래스 |
|:---|:---|
| TP | 1185 `Emp21_Tab_UnLeaveList`, 1279 `Pay20_Tab_DeductAdmin`, 1275 `Pay31_Tab_InsureApply`, 1278 `Pay20_Tab_Deduct` |
| STP | 1133 `Biz01_Tab_LimitCheckList`, 1464 `Flt10_Tab_CeoReport`, 1271 `Pay10_Tab_List` |
| TG | 1003 `Dcr01_Tab_DcrManager`, 1030 `Emp00_Tab_OrgPerson` |
| SR | 1324 `Emp01_Tab_DueDiligence` (이미 SR) |

## 5. 확정된 견본 (참고)

SG 1411 `Tdm01_Tab_Hr` · SGP 1240 `Chk02_Tab_DailyList` · SGVF 1049 `Fnd01_Tab_FundSearch` · SGEF 1048 `Fnd01_Tab_FundCode` · SGTP 1105 `Fnd20_Tab_Plan` · GG 1378 `Est02_Tab_PfResultReport` · CG 1026 `Apr10_Tab_Stamp` · TG 1077 `Sys06_Tab_Menu` · SGT 1050 `Fnd08_Tab_OrgAuth` · STP 1274 `Pay10_Tab_Retire` · TP 1289 `Rpt10_Tab_FssOrg` · GCG 1187 `Car03_Tab_List` · SR 1287 `Emp01_Tab_InoutState` · SGHF 1131 `Biz01_Tab_Card` · MG 1066 `Sys90_Tab_AfterService` · TO 1028 `Org01_Tab_OrgCode` · GO 1459 `Tdm54_Tab_CheckInsuff` · DB 1495 `Tdm50_Tab_TotalDashboard`

STP는 마지막에 다시 보기로 했다가 2026-10-29에 1274를 다시 확인하고 그대로 확정했다.
