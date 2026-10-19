# 도메인: act

화면 19개, 컴포넌트 9개, 서버 클래스 14개, 매퍼 14개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Act01_Tab_AccountCode`](screens/Act01_Tab_AccountCode.md) | 관리회계 > 21. 회계장부 > 계정과목 관리; 기초자료 > 40. 관리회계 > 계정코드 관리 | 5 | 13 |
| [`Act02_Tab_CreateForJournal`](screens/Act02_Tab_CreateForJournal.md) | 관리회계 > 12. 특수회계처리(외화) > 전표입력(외화) | 3 | 9 |
| [`Act02_Tab_CreateJournal`](screens/Act02_Tab_CreateJournal.md) | 관리회계 > 10. 전표입력 > 전표입력 | 1 | 7 |
| [`Act02_Tab_CreateJournalBiz`](screens/Act02_Tab_CreateJournalBiz.md) | 자금관리 > 20. 사업비관리 > 급여/카드 회계처리 | 2 | 9 |
| [`Act02_Tab_DepositIoList`](screens/Act02_Tab_DepositIoList.md) | 자금관리 > 10. 자금관리 > 일일자금관리; 고유자산 > 40. 예금관리 > 일일자금관리 | 1 | 10 |
| [`Act02_Tab_ForJournal`](screens/Act02_Tab_ForJournal.md) | 관리회계 > 21. 회계장부 > 분개장(외화) | 1 | 4 |
| [`Act02_Tab_Journal`](screens/Act02_Tab_Journal.md) | 관리회계 > 21. 회계장부 > 분개장 | 1 | 4 |
| [`Act02_Tab_JournalFix`](screens/Act02_Tab_JournalFix.md) | 관리회계 > 10. 전표입력 > 전표승인처리 | 1 | 3 |
| [`Act02_Tab_JournalSub`](screens/Act02_Tab_JournalSub.md) | 관리회계 > 21. 회계장부 > 계정별원장 | 2 | 8 |
| [`Act04_Tab_Close`](screens/Act04_Tab_Close.md) | 관리회계 > 20. 결산 > 회계마감 | 1 | 2 |
| [`Act04_Tab_GenLedger`](screens/Act04_Tab_GenLedger.md) | 관리회계 > 21. 회계장부 > 계정과목집계표 | 3 | 7 |
| [`Act04_Tab_ReportBS`](screens/Act04_Tab_ReportBS.md) | 관리회계 > 22. 재무제표 > 재무상태표 | 1 | 4 |
| [`Act04_Tab_ReportFSS`](screens/Act04_Tab_ReportFSS.md) | 관리회계 > 22. 재무제표 > 금감원보고용 재무제표 | 2 | 1 |
| [`Act04_Tab_ReportPL`](screens/Act04_Tab_ReportPL.md) | 관리회계 > 22. 재무제표 > 손익계산서 | 1 | 4 |
| [`Act09_Tab_AccountNum`](screens/Act09_Tab_AccountNum.md) | 관리자 > 05. 관리회계 > 결산회기관리 | 1 | 3 |
| [`Act10_Tab_ReprAccount`](screens/Act10_Tab_ReprAccount.md) | 관리자 > 05. 관리회계 > 대표계정 관리; 기초자료 > 40. 관리회계 > 대표계정관리 | 2 | 4 |
| [`Act11_Tab_TrJournalMap`](screens/Act11_Tab_TrJournalMap.md) | 관리자 > 05. 관리회계 > 거래유형별 분개맵핑; 기초자료 > 40. 관리회계 > 거래유형별 분개맵핑 | 3 | 9 |
| [`Act13_Tab_RealAccountMap`](screens/Act13_Tab_RealAccountMap.md) | 관리자 > 05. 관리회계 > 실계정맵핑; 기초자료 > 40. 관리회계 > 실계정맵핑 | 2 | 6 |
| [`Act15_Tab_CloseCheck`](screens/Act15_Tab_CloseCheck.md) | 기초자료 > 40. 관리회계 > 마감검증 체크항목 | 1 | 2 |

## 컴포넌트

다른 도메인 화면에서도 쓰는 클래스. 화면 파일은 여기까지만 적고 링크한다.

| 컴포넌트 | 사용 도메인 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Act01_Lookup_AccountCode`](components/Act01_Lookup_AccountCode.md) | biz, emp, pay | 1 | 1 |
| [`Act02_Grid_CreateJournal`](components/Act02_Grid_CreateJournal.md) | pay | 1 | 1 |
| [`Act02_Grid_History`](components/Act02_Grid_History.md) | ast | 1 | 1 |
| [`Act02_Grid_JournalFix`](components/Act02_Grid_JournalFix.md) | ast | 1 | 2 |
| [`Act02_Lookup_CreateJournal`](components/Act02_Lookup_CreateJournal.md) | pay | 2 | 5 |
| [`Act02_Lookup_ModiForJournal`](components/Act02_Lookup_ModiForJournal.md) | ast | 1 | 5 |
| [`Act02_Lookup_ModiJournal`](components/Act02_Lookup_ModiJournal.md) | ast | 1 | 5 |
| [`Act14_Lookup_LinkProvideContent`](components/Act14_Lookup_LinkProvideContent.md) | biz | 1 | 6 |
| [`Act80_Lookup_RelateAppr`](components/Act80_Lookup_RelateAppr.md) | ast, pay | 2 | 8 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`act.Act01_AccountCode`](../act/services/Act01_AccountCode.md) | 8 |
| [`act.Act02_Journal`](../act/services/Act02_Journal.md) | 15 |
| [`act.Act03_JournalDtl`](../act/services/Act03_JournalDtl.md) | 14 |
| [`act.Act04_GenLedger`](../act/services/Act04_GenLedger.md) | 10 |
| [`act.Act06_JournalTmp`](../act/services/Act06_JournalTmp.md) | 2 |
| [`act.Act08_JournalUpload`](../act/services/Act08_JournalUpload.md) | 5 |
| [`act.Act09_AccountNum`](../act/services/Act09_AccountNum.md) | 4 |
| [`act.Act10_ReprAccount`](../act/services/Act10_ReprAccount.md) | 5 |
| [`act.Act11_TrMap`](../act/services/Act11_TrMap.md) | 5 |
| [`act.Act12_JournalMap`](../act/services/Act12_JournalMap.md) | 5 |
| [`act.Act13_RealAccountMap`](../act/services/Act13_RealAccountMap.md) | 7 |
| [`act.Act14_Link`](../act/services/Act14_Link.md) | 8 |
| [`act.Act15_CloseCheck`](../act/services/Act15_CloseCheck.md) | 3 |
| [`act.Act80_RelateAppr`](../act/services/Act80_RelateAppr.md) | 6 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`act01_account_code`](sql/act01_account_code.md) | 11 |
| [`act02_journal`](sql/act02_journal.md) | 30 |
| [`act03_journal_dtl`](sql/act03_journal_dtl.md) | 19 |
| [`act04_gen_ledger`](sql/act04_gen_ledger.md) | 34 |
| [`act06_journal_tmp`](sql/act06_journal_tmp.md) | 8 |
| [`act08_journal_upload`](sql/act08_journal_upload.md) | 4 |
| [`act09_account_num`](sql/act09_account_num.md) | 5 |
| [`act10_repr_account`](sql/act10_repr_account.md) | 5 |
| [`act11_tr_map`](sql/act11_tr_map.md) | 5 |
| [`act12_journal_map`](sql/act12_journal_map.md) | 6 |
| [`act13_real_account_map`](sql/act13_real_account_map.md) | 7 |
| [`act14_link`](sql/act14_link.md) | 5 |
| [`act15_close_check`](sql/act15_close_check.md) | 2 |
| [`act80_relate_appr`](sql/act80_relate_appr.md) | 8 |

## 화면·컴포넌트에서 도달하지 않는 클래스

메뉴에 없거나 다른 방식으로 열리는 클래스 중 서비스를 호출하는 것.

| 클래스 | 파일 | 서비스 |
|:---|:---|:---|
| `Act03_Lookup_Note` | `client/vi/act/Act03_Lookup_Note.java` | `act.Act03_JournalDtl.updateNote` |
