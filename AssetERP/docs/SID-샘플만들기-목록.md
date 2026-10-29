# SID 샘플 만들기 목록

작성 2026-10-29. 신규 SID 5개(`docs/page-style.md`에 초안으로 등록)의 견본을 만들기 위해 사용자가 검토할 화면 목록이다.
흐름: 대표 화면을 열어 확인·수정 → 확정하면 `docs/page-style/{SID}/`에 복사 + `page-style.md`에 상세 절 → 같은 SID 화면을 맞춘다. 판별기 규칙은 `docs/yunhee-page-style-판별.md`.
화면은 독립으로 유지한다(레이아웃 프레임 부품은 만들지 않는다, `PageTabs`만 공유).

## 1. 검토할 대표 화면

| 상태 | SID | 화면번호 | 클래스 | 비고 |
|:---|:---|:---:|:---|:---|
| 확정 | SGHF | 1131 | `Biz01_Tab_Card` | 조회 줄 + 그리드 + 편집 폼을 좌우로 배치 |
| 확정 | SGEF(변형) | 1066 | `Sys90_Tab_AfterService` | 구 MG. SGEF 구조 + 폼 안에 보조 그리드. 2026-10-29 SGEF에 합침 |
| 확정 | TO | 1028 | `Org01_Tab_OrgCode` | 트리 중심, 편집은 팝업. 같은 클래스가 1451에도 있음 |
| 확정 | GO | 1459 | `Tdm54_Tab_CheckInsuff` | 그리드 하나, 조회 툴바 없음 |
| 확정 | DSBRD | 1495 | `Tdm50_Tab_TotalDashboard` | 그리드·트리·툴바 없이 카드/요약 |
| 확정 | IN | 1369 | `Flt00_Tab_Info` | 안내 문서(조회·저장 없음, 안내 문구 + 링크). 준법감시 > 10. 임직원매매 > 화면사용순서 |

상태: `대기` → `검토중` → `확정`(견본 폴더에 복사 완료).

## 2. 같은 SID로 묶어 나중에 맞출 화면

| SID | 화면번호 · 클래스 |
|:---|:---|
| SGHF | 1132 `Biz01_Tab_Other`, 1138 `Biz01_Tab_CardContents`, 1319 `Biz01_Tab_CardSimple`, 1320 `Biz01_Tab_OtherSimple`, 1321 `Biz01_Tab_CardContentsSimple` |
| SGEF(구 MG) | 1121 `Sys90_Tab_AfterServiceAdmin`, 1256 `Ics20_Tab_RevisionHistory`, 1257 `Ics20_Tab_RevisionHistoryAdmin` |
| TO | 1244 `Chk01_Tab_ClassTree` (1116 `Fbx01_Tab_Document`는 TO가 아니다 → SID 미정) |
| (SID 미정) | 1116 `Fbx01_Tab_Document` — 위: 문서함 편집 그리드(`SearchBar`), 아래: 좌 문서분류 트리 + 우 파일 목록(`Fbx01_TabPage_DocList`)의 3영역 |
| GDP | 1306 `Sys10_Tab_TotalSize`, 1367 `Sms03_Tab_SendAdmin`(왼쪽 아래 폼 변형), 1213 `Ics02_Tab_Manager` (견본 1305 `Sms02_Tab_TotalCount`) |
| DSBRD | 1467 `Tdm35_Tab_TaskList` |

대표 화면을 확정한 뒤, 이 화면들이 실제로 같은 모양인지 확인한다. 다르면 SID를 나누거나 다른 SID로 옮긴다.

## 3. 열어 본 결과 (2026-10-29) — 기존 SID 편입 또는 새 SID

| 화면번호 | 클래스 | 실제 구조 | SID |
|:---:|:---|:---|:---|
| 1002 | `Dcr01_Tab_DcrUser` | 20줄 껍데기. `Dcr01_Tab_DcrManager`(1003)를 가져다 트리 조회 함수만 바꿔 쓴다 | TG (1003과 같음) |
| 1370 | `Flt10_Tab_ViolateUser` | 9줄 껍데기. `Flt10_Tab_Violate`(SG)를 가져다 쓴다 | SG |
| 1247 | `Sys07_Tab_Company` | 버튼 줄 + 세로 `Splitter`로 출발지/목적지 SG 두 영역 | GG 변형 후보(열어서 최종 확인). 툴바 줄 테두리·`padding 12` 손볼 수 있음 |
| 1455 | `Tdm50_Tab_CheckJob` | 툴바 줄 + 요약 글 줄 + 직책별 탭. 테두리 박스, antd `Tabs` | STP (외곽 테두리 제거·`PageTabs`·툴바 고정 높이 제거 필요) |
| 1369 | `Flt00_Tab_Info` | 조회·저장 없는 안내 문서 | **IN** (신규, 위 표 1번에 추가) |

## 4. 기존 SID에 편입할 화면 (새 견본 불필요, `스타일:` 표시만)

| SID | 화면번호 · 클래스 |
|:---|:---|
| TP | 1185 `Emp21_Tab_UnLeaveList`, 1279 `Pay20_Tab_DeductAdmin`, 1275 `Pay31_Tab_InsureApply`, 1278 `Pay20_Tab_Deduct` |
| STP | 1133 `Biz01_Tab_LimitCheckList`, 1464 `Flt10_Tab_CeoReport`, 1271 `Pay10_Tab_List`, 1455 `Tdm50_Tab_CheckJob` |
| TG | 1003 `Dcr01_Tab_DcrManager`, 1030 `Emp00_Tab_OrgPerson`, 1002 `Dcr01_Tab_DcrUser`(껍데기) |
| SR | 1324 `Emp01_Tab_DueDiligence` (이미 SR) |

## 5. 확정된 견본 (참고)

SG 1411 `Tdm01_Tab_Hr` · SGP 1240 `Chk02_Tab_DailyList` · SGVF 1049 `Fnd01_Tab_FundSearch` · SGEF 1048 `Fnd01_Tab_FundCode` · SGTP 1105 `Fnd20_Tab_Plan` · GG 1378 `Est02_Tab_PfResultReport` · CG 1026 `Apr10_Tab_Stamp` · TG 1077 `Sys06_Tab_Menu` · SGT 1050 `Fnd08_Tab_OrgAuth` · STP 1274 `Pay10_Tab_Retire` · TP 1289 `Rpt10_Tab_FssOrg` · GCG 1187 `Car03_Tab_List` · SR 1287 `Emp01_Tab_InoutState` · SGHF 1131 `Biz01_Tab_Card` · SGEF(구 MG) 1066 `Sys90_Tab_AfterService` · TO 1028 `Org01_Tab_OrgCode` · GO 1459 `Tdm54_Tab_CheckInsuff` · GDP 1305 `Sms02_Tab_TotalCount` · DSBRD 1495 `Tdm50_Tab_TotalDashboard` · IN 1369 `Flt00_Tab_Info`

STP는 마지막에 다시 보기로 했다가 2026-10-29에 1274를 다시 확인하고 그대로 확정했다.
